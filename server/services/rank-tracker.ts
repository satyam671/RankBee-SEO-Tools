import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import axios from 'axios';
import * as cheerio from 'cheerio';

puppeteer.use(StealthPlugin());

// In-memory cache for rank results
const rankCache: Record<string, { results: string[], timestamp: number }> = {};

interface RankResult {
  keyword: string;
  domain: string;
  searchEngine: string;
  position: number | null;
  top3: boolean;
  top10: boolean;
  top20: boolean;
  firstPage: boolean;
  visibility: 'easy' | 'medium' | 'hard';
  matchedUrl?: string;
  totalResults: number;
  searchUrl: string;
  timestamp: string;
}

interface BatchRankResult {
  domain: string;
  searchEngine: string;
  results: RankResult[];
  summary: {
    totalKeywords: number;
    found: number;
    top3: number;
    top10: number;
    top20: number;
    averagePosition: number | null;
  };
}

export class RankTracker {
  private static instance: RankTracker;

  public static getInstance(): RankTracker {
    if (!RankTracker.instance) {
      RankTracker.instance = new RankTracker();
    }
    return RankTracker.instance;
  }

  private readonly searchEngineUrls: Record<string, (keyword: string) => string> = {
    google: (kw) => `https://www.google.com/search?q=${encodeURIComponent(kw)}`,
    bing: (kw) => `https://www.bing.com/search?q=${encodeURIComponent(kw)}`,
    yahoo: (kw) => `https://search.yahoo.com/search?p=${encodeURIComponent(kw)}`,
    duckduckgo: (kw) => `https://duckduckgo.com/html/?q=${encodeURIComponent(kw)}`
  };

  private readonly userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:121.0) Gecko/20100101 Firefox/121.0'
  ];

  private filterLinks(links: string[]): string[] {
    return Array.from(new Set(links)).filter(link =>
      link.startsWith('http') &&
      !link.includes('google.com') &&
      !link.includes('bing.com') &&
      !link.includes('yahoo.com') &&
      !link.includes('duckduckgo.com') &&
      !link.includes('youtube.com') &&
      !link.includes('maps.google') &&
      !link.includes('translate.google')
    );
  }

  private getCacheKey(keyword: string, engine: string): string {
    return `${engine.toLowerCase()}:${keyword.toLowerCase()}`;
  }

  private isCacheValid(timestamp: number): boolean {
    const cacheTime = 10 * 60 * 1000; // 10 minutes
    return Date.now() - timestamp < cacheTime;
  }

  private getRandomUserAgent(): string {
    return this.userAgents[Math.floor(Math.random() * this.userAgents.length)];
  }

  async trackKeywordRanking(domain: string, keyword: string, searchEngine: string = 'duckduckgo'): Promise<RankResult> {
    console.log(`Tracking rank for domain: ${domain}, keyword: "${keyword}", search engine: ${searchEngine}`);
    
    try {
      // Use enhanced Puppeteer-based scraping for better results
      const links = await this.fetchSERPAdvanced(keyword, searchEngine);
      const result = this.analyzeRank(domain, links, keyword, searchEngine);
      
      console.log(`Rank tracking completed. Position: ${result.position || 'Not found'}`);
      return result;
    } catch (error) {
      console.error('Rank tracking error:', error);
      throw new Error(`Failed to track keyword ranking: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async trackBatchKeywords(domain: string, keywords: string[], searchEngine: string = 'duckduckgo'): Promise<BatchRankResult> {
    console.log(`Tracking ${keywords.length} keywords for domain: ${domain}, search engine: ${searchEngine}`);
    
    const results: RankResult[] = [];
    
    for (const keyword of keywords) {
      try {
        // Add small delay between requests to be respectful
        if (results.length > 0) {
          await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
        }
        
        const result = await this.trackKeywordRanking(domain, keyword, searchEngine);
        results.push(result);
        
        console.log(`Progress: ${results.length}/${keywords.length} keywords processed`);
      } catch (error) {
        console.error(`Failed to track keyword "${keyword}":`, error);
        // Add failed result to maintain array consistency
        results.push({
          keyword,
          domain: this.normalizeDomain(domain),
          searchEngine,
          position: null,
          top3: false,
          top10: false,
          top20: false,
          firstPage: false,
          visibility: 'hard',
          totalResults: 0,
          searchUrl: this.searchEngineUrls[searchEngine.toLowerCase()]?.(keyword) || '',
          timestamp: new Date().toISOString()
        });
      }
    }

    // Calculate summary statistics
    const foundResults = results.filter(r => r.position !== null);
    const top3Count = results.filter(r => r.top3).length;
    const top10Count = results.filter(r => r.top10).length;
    const top20Count = results.filter(r => r.top20).length;
    
    const averagePosition = foundResults.length > 0 
      ? foundResults.reduce((sum, r) => sum + (r.position || 0), 0) / foundResults.length
      : null;

    const batchResult: BatchRankResult = {
      domain: this.normalizeDomain(domain),
      searchEngine,
      results,
      summary: {
        totalKeywords: keywords.length,
        found: foundResults.length,
        top3: top3Count,
        top10: top10Count,
        top20: top20Count,
        averagePosition: averagePosition ? Math.round(averagePosition * 100) / 100 : null
      }
    };

    console.log(`Batch tracking completed: ${foundResults.length}/${keywords.length} keywords found`);
    return batchResult;
  }

  private async fetchSERPAdvanced(keyword: string, engine: string): Promise<string[]> {
    console.log(`Using advanced Puppeteer-based SERP fetching for ${engine}...`);
    
    // Try Puppeteer method first for better results
    try {
      return await this.fetchWithPuppeteerAdvanced(keyword, engine);
    } catch (error) {
      console.log(`Puppeteer method failed for ${engine}, falling back to axios method:`, error instanceof Error ? error.message : String(error));
      return await this.fetchSERP(keyword, engine);
    }
  }

  private async fetchSERP(keyword: string, engine: string): Promise<string[]> {
    const urlBuilder = this.searchEngineUrls[engine.toLowerCase()];
    if (!urlBuilder) {
      throw new Error(`Unsupported search engine: ${engine}`);
    }

    const searchUrl = urlBuilder(keyword);
    console.log(`Fetching SERP from: ${searchUrl}`);
    
    // Check cache first
    const cacheKey = this.getCacheKey(keyword, engine);
    const cached = rankCache[cacheKey];
    if (cached && this.isCacheValid(cached.timestamp)) {
      console.log(`Using cached results for ${engine}:${keyword}`);
      return cached.results;
    }

    try {
      let results: string[] = [];
      
      // Focus on DuckDuckGo as it's most reliable for this use case
      if (engine.toLowerCase() === 'duckduckgo') {
        results = await this.fetchDuckDuckGo(keyword);
      } else {
        console.log(`${engine} is not fully supported due to bot protection. Using DuckDuckGo as fallback...`);
        results = await this.fetchDuckDuckGo(keyword);
      }
      
      // Cache successful results
      if (results.length > 0) {
        rankCache[cacheKey] = {
          results,
          timestamp: Date.now()
        };
      }
      
      return results;
      
    } catch (error) {
      console.error(`Error fetching SERP from ${engine}:`, error);
      throw new Error(`Failed to fetch SERP data from ${engine}. This may be due to network issues or search engine rate limiting.`);
    }
  }

  private async fetchWithPuppeteerAdvanced(keyword: string, engine: string): Promise<string[]> {
    let browser;
    try {
      const puppeteer = (await import('puppeteer')).default;
      const UserAgent = (await import('user-agents')).default;
      
      console.log(`Using advanced Puppeteer for ${engine}...`);
      
      browser = await puppeteer.launch({ 
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu',
          '--disable-web-security',
          '--disable-features=VizDisplayCompositor',
          '--run-all-compositor-stages-before-draw',
          '--disable-background-timer-throttling',
          '--disable-renderer-backgrounding',
          '--disable-backgrounding-occluded-windows',
          '--disable-ipc-flooding-protection'
        ]
      });
      
      const page = await browser.newPage();
      const userAgent = new UserAgent({ deviceCategory: 'desktop' });
      await page.setUserAgent(userAgent.toString());
      
      // Set realistic viewport and headers
      await page.setViewport({ 
        width: Math.floor(Math.random() * 400) + 1200, 
        height: Math.floor(Math.random() * 300) + 700 
      });
      
      await page.setExtraHTTPHeaders({
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Cache-Control': 'max-age=0'
      });

      // Get the appropriate search URL
      let searchUrl: string;
      if (engine.toLowerCase() === 'google') {
        searchUrl = `https://www.google.com/search?q=${encodeURIComponent(keyword)}&num=100`;
      } else if (engine.toLowerCase() === 'bing') {
        searchUrl = `https://www.bing.com/search?q=${encodeURIComponent(keyword)}&count=50`;
      } else if (engine.toLowerCase() === 'yahoo') {
        searchUrl = `https://search.yahoo.com/search?p=${encodeURIComponent(keyword)}&n=50`;
      } else {
        searchUrl = `https://duckduckgo.com/html/?q=${encodeURIComponent(keyword)}`;
      }
      
      // Navigate with realistic behavior
      await page.goto(searchUrl, {
        waitUntil: 'networkidle2',
        timeout: 30000
      });
      
      // Random human-like delays
      await new Promise(resolve => setTimeout(resolve, Math.random() * 3000 + 2000));
      
      // Extract search result links with improved selectors for each engine
      let links: string[] = [];
      
      if (engine.toLowerCase() === 'google') {
        links = await page.evaluate(() => {
          const results: string[] = [];
          const selectors = [
            'div.g a[href]',
            'div[data-ved] a[href]', 
            'div.yuRUbf a[href]',
            'h3 a[href]',
            'div[jscontroller] a[href]'
          ];
          
          for (const selector of selectors) {
            const anchors = document.querySelectorAll(selector);
            anchors.forEach(anchor => {
              const href = (anchor as HTMLAnchorElement).href;
              if (href && href.startsWith('http') && !href.includes('google.') && !href.includes('youtube.')) {
                results.push(href);
              }
            });
            if (results.length >= 20) break;
          }
          
          return Array.from(new Set(results)).slice(0, 20);
        });
      } else if (engine.toLowerCase() === 'bing') {
        links = await page.evaluate(() => {
          const results: string[] = [];
          const selectors = [
            'h2 a[href]',
            '.b_title a[href]',
            '.b_algo a[href]',
            'li.b_algo a[href]'
          ];
          
          for (const selector of selectors) {
            const anchors = document.querySelectorAll(selector);
            anchors.forEach(anchor => {
              const href = (anchor as HTMLAnchorElement).href;
              if (href && href.startsWith('http') && !href.includes('bing.') && !href.includes('microsoft.') && !href.includes('msn.')) {
                results.push(href);
              }
            });
            if (results.length >= 20) break;
          }
          
          return Array.from(new Set(results)).slice(0, 20);
        });
      } else if (engine.toLowerCase() === 'yahoo') {
        links = await page.evaluate(() => {
          const results: string[] = [];
          const selectors = [
            'h3 a[href]',
            '.algo-sr a[href]',
            '.Sr a[href]',
            '[data-reactid] a[href]'
          ];
          
          for (const selector of selectors) {
            const anchors = document.querySelectorAll(selector);
            anchors.forEach(anchor => {
              const href = (anchor as HTMLAnchorElement).href;
              if (href && href.startsWith('http') && !href.includes('yahoo.') && !href.includes('search.yahoo')) {
                results.push(href);
              }
            });
            if (results.length >= 20) break;
          }
          
          return Array.from(new Set(results)).slice(0, 20);
        });
      } else {
        // DuckDuckGo
        links = await page.evaluate(() => {
          const results: string[] = [];
          const selectors = [
            'a.result__a[href]',
            '.result__url a[href]',
            '.result__title a[href]'
          ];
          
          for (const selector of selectors) {
            const anchors = document.querySelectorAll(selector);
            anchors.forEach(anchor => {
              let href = (anchor as HTMLAnchorElement).href;
              
              // Handle DuckDuckGo redirect URLs
              if (href.includes('uddg=')) {
                const urlMatch = href.match(/uddg=([^&]+)/);
                if (urlMatch) {
                  href = decodeURIComponent(urlMatch[1]);
                }
              }
              
              if (href && href.startsWith('http') && !href.includes('duckduckgo.')) {
                results.push(href);
              }
            });
            if (results.length >= 20) break;
          }
          
          return Array.from(new Set(results)).slice(0, 20);
        });
      }
      
      console.log(`Advanced Puppeteer extracted ${links.length} links from ${engine}`);
      return links;
      
    } catch (error) {
      console.error(`Advanced Puppeteer error for ${engine}:`, error);
      throw error;
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }

  private async fetchWithPuppeteer(keyword: string, engine: string): Promise<string[]> {
    let browser;
    try {
      console.log(`Using Puppeteer stealth mode for ${engine}...`);
      
      browser = await puppeteer.launch({ 
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu',
          '--disable-web-security',
          '--disable-features=VizDisplayCompositor',
          '--run-all-compositor-stages-before-draw',
          '--disable-background-timer-throttling',
          '--disable-renderer-backgrounding',
          '--disable-backgrounding-occluded-windows',
          '--disable-ipc-flooding-protection'
        ]
      });
      
      const page = await browser.newPage();
      
      // Set realistic viewport and user agent with randomization
      await page.setViewport({ 
        width: Math.floor(Math.random() * 400) + 1200, 
        height: Math.floor(Math.random() * 300) + 700 
      });
      
      // Generate unique user agent
      const baseAgent = this.getRandomUserAgent();
      const randomVersion = Math.floor(Math.random() * 1000000);
      const uniqueAgent = baseAgent.replace(/AppleWebKit\/\d+\.\d+/, `AppleWebKit/${randomVersion}.0`);
      await page.setUserAgent(uniqueAgent);
      
      // Add realistic headers
      await page.setExtraHTTPHeaders({
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Cache-Control': 'max-age=0'
      });

      const searchUrl = this.searchEngineUrls[engine.toLowerCase()](keyword);
      
      // Navigate with realistic behavior
      await page.goto(searchUrl, {
        waitUntil: 'networkidle2',
        timeout: 30000
      });
      
      // Random human-like delays
      await new Promise(resolve => setTimeout(resolve, Math.random() * 3000 + 2000));
      
      // Extract search result links with improved selectors
      let links: string[] = [];
      
      if (engine.toLowerCase() === 'google') {
        links = await page.$$eval('a[href]', anchors =>
          anchors
            .map(a => (a as HTMLAnchorElement).href)
            .filter(href => href.startsWith('http'))
        );
      } else if (engine.toLowerCase() === 'bing') {
        links = await page.$$eval('h2 a, .b_title a, .b_algo a', anchors =>
          anchors
            .map(a => (a as HTMLAnchorElement).href)
            .filter(href => href.startsWith('http'))
        );
      }
      
      const filteredLinks = this.filterLinks(links);
      console.log(`Extracted ${filteredLinks.length} links from ${engine}`);
      return filteredLinks.slice(0, 50);
      
    } catch (error) {
      console.error(`Puppeteer error for ${engine}:`, error);
      throw error;
    } finally {
      if (browser) {
        try {
          await browser.close();
        } catch (closeError) {
          console.error('Error closing browser:', closeError);
        }
      }
    }
  }

  private async fetchDuckDuckGo(keyword: string): Promise<string[]> {
    try {
      console.log('Using DuckDuckGo for SERP data...');
      
      const searchUrl = `https://duckduckgo.com/html/?q=${encodeURIComponent(keyword)}`;
      
      const response = await axios.get(searchUrl, {
        headers: {
          'User-Agent': this.getRandomUserAgent(),
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
          'Referer': 'https://duckduckgo.com/',
          'DNT': '1',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'same-origin'
        },
        timeout: 15000,
        maxRedirects: 3
      });

      const $ = cheerio.load(response.data);
      const links: string[] = [];

      // Primary extraction from result links - most reliable method
      $('a.result__a').each((_, element) => {
        let href = $(element).attr('href');
        if (href && href.startsWith('http')) {
          // Clean up URL (remove tracking parameters)
          const cleanUrl = href.split('&')[0];
          if (!cleanUrl.includes('duckduckgo.com')) {
            links.push(cleanUrl);
          }
        }
      });

      // Fallback extraction methods
      if (links.length < 5) {
        // Extract from other result containers
        $('.result__url, a[href*="uddg"]').each((_, element) => {
          let href = $(element).attr('href');
          
          if (href) {
            // Handle DuckDuckGo redirect URLs
            if (href.includes('uddg=')) {
              const urlMatch = href.match(/uddg=([^&]+)/);
              if (urlMatch) {
                href = decodeURIComponent(urlMatch[1]);
              }
            }
            
            if (href.startsWith('http') && !href.includes('duckduckgo.com')) {
              links.push(href);
            }
          }
        });

        // Additional extraction from title links
        $('.result__title a, .results .result a').each((_, element) => {
          const href = $(element).attr('href');
          if (href && href.startsWith('http') && !href.includes('duckduckgo.com')) {
            links.push(href);
          }
        });
      }

      const uniqueLinks = Array.from(new Set(links)).slice(0, 50);
      console.log(`Extracted ${uniqueLinks.length} links from DuckDuckGo`);
      
      if (uniqueLinks.length === 0) {
        console.warn('No links extracted from DuckDuckGo - may need to check selectors or rate limiting');
      }
      
      return uniqueLinks;
      
    } catch (error) {
      console.error('DuckDuckGo fetch error:', error);
      throw new Error(`Failed to fetch from DuckDuckGo: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async fetchWithAxios(searchUrl: string): Promise<string[]> {
    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': this.getRandomUserAgent(),
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      timeout: 15000,
      maxRedirects: 3
    });

    const $ = cheerio.load(response.data);
    const links: string[] = [];

    // Generic link extraction
    $('a[href]').each((_, element) => {
      const href = $(element).attr('href');
      if (href && href.startsWith('http')) {
        links.push(href);
      }
    });

    return Array.from(new Set(links)).slice(0, 50);
  }

  private normalizeDomain(domain: string): string {
    try {
      const url = new URL(domain.startsWith('http') ? domain : `https://${domain}`);
      return url.hostname.replace(/^www\./, '').toLowerCase();
    } catch {
      return domain.replace(/^https?:\/\//, '').replace(/^www\./, '').toLowerCase();
    }
  }

  private analyzeRank(domain: string, links: string[], keyword: string, engine: string): RankResult {
    console.log(`Analyzing rank for domain: ${domain} in ${links.length} results`);
    
    const normalizedDomain = this.normalizeDomain(domain);
    console.log(`Normalized domain: ${normalizedDomain}`);
    
    let position: number | null = null;
    let matchedUrl: string | undefined;

    // Find the domain in the results
    for (let i = 0; i < links.length; i++) {
      const link = links[i];
      const linkDomain = this.normalizeDomain(link);
      
      console.log(`Checking link ${i + 1}: ${linkDomain} vs ${normalizedDomain}`);
      
      if (linkDomain.includes(normalizedDomain) || normalizedDomain.includes(linkDomain)) {
        position = i + 1;
        matchedUrl = link;
        console.log(`Found domain at position ${position}: ${matchedUrl}`);
        break;
      }
    }

    // Calculate visibility based on position
    let visibility: 'easy' | 'medium' | 'hard' = 'hard';
    if (position && position <= 5) {
      visibility = 'easy';
    } else if (position && position <= 20) {
      visibility = 'medium';
    }

    const result: RankResult = {
      keyword,
      domain: normalizedDomain,
      searchEngine: engine,
      position,
      top3: position !== null && position <= 3,
      top10: position !== null && position <= 10,
      top20: position !== null && position <= 20,
      firstPage: position !== null && position <= 10,
      visibility,
      matchedUrl,
      totalResults: links.length,
      searchUrl: this.searchEngineUrls[engine.toLowerCase()]?.(keyword) || '',
      timestamp: new Date().toISOString()
    };

    return result;
  }
}