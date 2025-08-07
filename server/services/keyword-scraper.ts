import puppeteer, { Browser, Page } from 'puppeteer';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import axios from 'axios';
import * as cheerio from 'cheerio';
import NodeCache from 'node-cache';
import { CacheManager } from './cache-manager';
import { RobotsChecker } from './robots-checker';

// Add stealth plugin to avoid detection
import puppeteerExtra from 'puppeteer-extra';

export interface ScrapedKeyword {
  keyword: string;
  source: string;
  relevance?: number;
  searchVolume?: number;
}

export class AdvancedKeywordScraper {
  private static instance: AdvancedKeywordScraper;
  private browser: Browser | null = null;
  private cacheManager: CacheManager;
  private robotsChecker: RobotsChecker;
  private userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  ];

  private constructor() {
    this.cacheManager = CacheManager.getInstance();
    this.robotsChecker = RobotsChecker.getInstance();
  }

  public static getInstance(): AdvancedKeywordScraper {
    if (!AdvancedKeywordScraper.instance) {
      AdvancedKeywordScraper.instance = new AdvancedKeywordScraper();
    }
    return AdvancedKeywordScraper.instance;
  }

  private async getBrowser(): Promise<Browser> {
    if (!this.browser) {
      puppeteerExtra.use(StealthPlugin());
      this.browser = await puppeteerExtra.launch({
        headless: true,
        executablePath: process.env.CHROME_BIN || '/nix/store/*/bin/chromium',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu',
          '--disable-web-security',
          '--disable-features=VizDisplayCompositor'
        ]
      });
    }
    return this.browser;
  }

  private getRandomUserAgent(): string {
    return this.userAgents[Math.floor(Math.random() * this.userAgents.length)];
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async scrapeAllSources(keyword: string, location: string = 'US', language: string = 'en'): Promise<ScrapedKeyword[]> {
    const cacheKey = this.cacheManager.generateCacheKey(keyword, location, language);
    const cached = this.cacheManager.getCacheEntry(cacheKey);
    
    if (cached) {
      console.log(`Using cached keywords for: ${keyword}`);
      return cached.data;
    }

    console.log(`Starting fresh scraping for: ${keyword}`);
    const allKeywords: ScrapedKeyword[] = [];

    // Run all scraping operations in parallel with error handling and respect rate limits
    const scrapingTasks = [
      this.scrapeGoogleAutocomplete(keyword, location, language),
      this.scrapeGoogleTrends(keyword),
      this.scrapeGooglePeopleAlsoAsk(keyword),
      this.scrapeYouTubeAutocomplete(keyword),
      this.scrapeRedditKeywords(keyword),
      this.scrapeQuoraKeywords(keyword),
      this.scrapeWikipediaKeywords(keyword),
      this.scrapeAnswerThePublic(keyword),
      this.scrapeBingAutocomplete(keyword, location, language)
    ];

    const results = await Promise.allSettled(scrapingTasks);
    
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        allKeywords.push(...result.value);
        console.log(`Scraping task ${index} completed with ${result.value.length} keywords`);
      } else {
        console.log(`Scraping task ${index} failed:`, result.reason?.message || 'Unknown error');
      }
    });

    // Remove duplicates and sort by relevance
    const uniqueKeywords = this.deduplicateKeywords(allKeywords);
    
    // Cache the results (short-term for dynamic data)
    this.cacheManager.setCacheEntry(cacheKey, uniqueKeywords, false);
    
    console.log(`Total unique keywords found: ${uniqueKeywords.length}`);
    return uniqueKeywords;
  }

  private async scrapeGoogleAutocomplete(keyword: string, location: string, language: string): Promise<ScrapedKeyword[]> {
    try {
      // Check rate limiting for Google
      if (this.cacheManager.isRateLimited('google')) {
        console.log('Google scraping rate limited, using cached or alternative data');
        return [];
      }

      const locationCodes: Record<string, string> = {
        'United States': 'us', 'United Kingdom': 'uk', 'Canada': 'ca', 'Australia': 'au',
        'Germany': 'de', 'France': 'fr', 'Spain': 'es', 'Italy': 'it', 'Brazil': 'br',
        'Japan': 'jp', 'India': 'in', 'Mexico': 'mx', 'Netherlands': 'nl', 'Sweden': 'se'
      };

      const languageCodes: Record<string, string> = {
        'English': 'en', 'Spanish': 'es', 'French': 'fr', 'German': 'de', 'Italian': 'it',
        'Portuguese': 'pt', 'Russian': 'ru', 'Japanese': 'ja', 'Korean': 'ko', 'Chinese': 'zh'
      };

      const gl = locationCodes[location] || 'us';
      const hl = languageCodes[language] || 'en';

      const variations = [
        keyword,
        `${keyword} `,
        `how ${keyword}`,
        `what ${keyword}`,
        `${keyword} for`,
        `${keyword} in`,
        `${keyword} with`,
        `${keyword} without`,
        `${keyword} vs`,
        `best ${keyword}`
      ];

      const keywords: ScrapedKeyword[] = [];

      for (const variation of variations.slice(0, 5)) { // Limit to avoid rate limiting
        try {
          const response = await axios.get(`http://suggestqueries.google.com/complete/search?client=firefox&gl=${gl}&hl=${hl}&q=${encodeURIComponent(variation)}`, {
            headers: { 'User-Agent': this.getRandomUserAgent() },
            timeout: 5000
          });

          if (response.data && Array.isArray(response.data) && response.data.length > 1) {
            const suggestions = response.data[1] || [];
            suggestions.forEach((suggestion: string) => {
              if (suggestion && suggestion.toLowerCase().includes(keyword.toLowerCase())) {
                keywords.push({
                  keyword: suggestion,
                  source: 'Google Autocomplete',
                  relevance: 0.9
                });
              }
            });
          }
          await this.delay(150); // Rate limiting
        } catch (error) {
          // Continue with other variations
        }
      }

      // Set rate limit after successful scraping
      this.cacheManager.setRateLimit('google');
      return keywords;
    } catch (error) {
      return [];
    }
  }

  private async scrapeGoogleTrends(keyword: string): Promise<ScrapedKeyword[]> {
    try {
      const keywords: ScrapedKeyword[] = [];
      const response = await axios.get(`https://trends.google.com/trends/api/autocomplete/${encodeURIComponent(keyword)}`, {
        headers: { 'User-Agent': this.getRandomUserAgent() },
        timeout: 8000
      });

      const data = response.data.replace(')]}', '');
      const trends = JSON.parse(data);
      
      if (trends && trends.default && trends.default.topics) {
        trends.default.topics.slice(0, 10).forEach((topic: any) => {
          if (topic.title) {
            keywords.push({
              keyword: topic.title,
              source: 'Google Trends',
              relevance: 0.8
            });
          }
        });
      }

      return keywords;
    } catch (error) {
      return [];
    }
  }

  private async scrapeGooglePeopleAlsoAsk(keyword: string): Promise<ScrapedKeyword[]> {
    try {
      // Check robots.txt compliance
      const allowed = await this.robotsChecker.isScrapingAllowed('google.com');
      if (!allowed) {
        console.log('Google scraping not allowed by robots.txt');
        return [];
      }

      // Check rate limiting
      if (this.cacheManager.isRateLimited('google_paa')) {
        return [];
      }

      const browser = await this.getBrowser();
      const page = await browser.newPage();
      await page.setUserAgent(this.getRandomUserAgent());

      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(keyword)}`;
      await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 15000 });

      const keywords: ScrapedKeyword[] = [];

      // Wait for content to load
      await this.delay(2000);

      // Extract "People also ask" questions with more specific selectors
      try {
        const paaElements = await page.$$eval('[jsname="yEVEwb"], [data-initq], .related-question-pair, .cbphWd', (elements) => {
          return elements.map(el => el.textContent?.trim()).filter(Boolean);
        });

        paaElements.slice(0, 8).forEach(question => {
          if (question && question.length > 10) {
            keywords.push({
              keyword: question,
              source: 'Google People Also Ask',
              relevance: 0.85
            });
          }
        });
      } catch (paaError) {
        console.log('PAA extraction failed:', paaError);
      }

      // Extract related searches
      try {
        const relatedElements = await page.$$eval('.s75CSd, .k8XOCe', (elements) => {
          return elements.map(el => el.textContent?.trim()).filter(Boolean);
        });

        relatedElements.slice(0, 10).forEach(related => {
          if (related && related.toLowerCase().includes(keyword.toLowerCase().split(' ')[0])) {
            keywords.push({
              keyword: related,
              source: 'Google Related Searches',
              relevance: 0.8
            });
          }
        });
      } catch (relatedError) {
        console.log('Related searches extraction failed:', relatedError);
      }

      await page.close();
      
      // Set rate limit
      this.cacheManager.setRateLimit('google_paa');
      
      return keywords;
    } catch (error) {
      console.log('Google PAA scraping failed:', error);
      return [];
    }
  }

  private async scrapeYouTubeAutocomplete(keyword: string): Promise<ScrapedKeyword[]> {
    try {
      const keywords: ScrapedKeyword[] = [];
      const alphabet = 'abcdefghijklmnopqrstuvwxyz';

      for (let i = 0; i < 5; i++) { // Limit iterations
        const query = `${keyword} ${alphabet[i]}`;
        
        try {
          const response = await axios.get(`https://suggestqueries.google.com/complete/search?client=youtube&ds=yt&q=${encodeURIComponent(query)}`, {
            headers: { 'User-Agent': this.getRandomUserAgent() },
            timeout: 5000
          });

          if (response.data && Array.isArray(response.data) && response.data.length > 1) {
            const suggestions = response.data[1] || [];
            suggestions.slice(0, 5).forEach((suggestion: any) => {
              const keywordText = Array.isArray(suggestion) ? suggestion[0] : suggestion;
              if (keywordText && keywordText.toLowerCase().includes(keyword.toLowerCase())) {
                keywords.push({
                  keyword: keywordText,
                  source: 'YouTube Autocomplete',
                  relevance: 0.75
                });
              }
            });
          }
          await this.delay(150);
        } catch (error) {
          // Continue with next iteration
        }
      }

      return keywords;
    } catch (error) {
      return [];
    }
  }

  private async scrapeRedditKeywords(keyword: string): Promise<ScrapedKeyword[]> {
    try {
      const keywords: ScrapedKeyword[] = [];
      const searchUrl = `https://www.reddit.com/search.json?q=${encodeURIComponent(keyword)}&limit=25&sort=relevance`;
      
      const response = await axios.get(searchUrl, {
        headers: { 'User-Agent': this.getRandomUserAgent() },
        timeout: 8000
      });

      if (response.data && response.data.data && response.data.data.children) {
        response.data.data.children.slice(0, 15).forEach((post: any) => {
          if (post.data && post.data.title) {
            const title = post.data.title;
            // Extract keywords from titles
            const words = title.split(' ').filter((word: string) => word.length > 3);
            words.forEach((word: string) => {
              if (word.toLowerCase().includes(keyword.toLowerCase().substring(0, 4))) {
                keywords.push({
                  keyword: title,
                  source: 'Reddit',
                  relevance: 0.7
                });
              }
            });
          }
        });
      }

      return keywords;
    } catch (error) {
      return [];
    }
  }

  private async scrapeQuoraKeywords(keyword: string): Promise<ScrapedKeyword[]> {
    try {
      const keywords: ScrapedKeyword[] = [];
      const searchUrl = `https://www.quora.com/search?q=${encodeURIComponent(keyword)}`;
      
      const response = await axios.get(searchUrl, {
        headers: { 
          'User-Agent': this.getRandomUserAgent(),
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        },
        timeout: 8000
      });

      const $ = cheerio.load(response.data);
      
      // Extract question titles
      $('[class*="question"], .question_text, .QuestionText').each((_, element) => {
        const text = $(element).text().trim();
        if (text && text.toLowerCase().includes(keyword.toLowerCase()) && text.length > 10) {
          keywords.push({
            keyword: text,
            source: 'Quora',
            relevance: 0.75
          });
        }
      });

      return keywords.slice(0, 12);
    } catch (error) {
      return [];
    }
  }

  private async scrapeWikipediaKeywords(keyword: string): Promise<ScrapedKeyword[]> {
    try {
      const keywords: ScrapedKeyword[] = [];
      
      // Search Wikipedia
      const searchResponse = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(keyword)}`, {
        headers: { 'User-Agent': this.getRandomUserAgent() },
        timeout: 5000
      });

      if (searchResponse.data && searchResponse.data.extract) {
        const extract = searchResponse.data.extract;
        // Extract potential keywords from the summary
        const sentences = extract.split('. ');
        sentences.slice(0, 3).forEach((sentence: string) => {
          if (sentence.length > 20 && sentence.toLowerCase().includes(keyword.toLowerCase())) {
            keywords.push({
              keyword: sentence,
              source: 'Wikipedia',
              relevance: 0.8
            });
          }
        });
      }

      // Also try opensearch for suggestions
      const opensearchResponse = await axios.get(`https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(keyword)}&limit=10&format=json`, {
        headers: { 'User-Agent': this.getRandomUserAgent() },
        timeout: 5000
      });

      if (opensearchResponse.data && Array.isArray(opensearchResponse.data) && opensearchResponse.data.length > 1) {
        const suggestions = opensearchResponse.data[1] || [];
        suggestions.forEach((suggestion: string) => {
          keywords.push({
            keyword: suggestion,
            source: 'Wikipedia Suggestions',
            relevance: 0.85
          });
        });
      }

      return keywords;
    } catch (error) {
      return [];
    }
  }

  private async scrapeAnswerThePublic(keyword: string): Promise<ScrapedKeyword[]> {
    try {
      const keywords: ScrapedKeyword[] = [];
      
      // Generate question patterns similar to AnswerThePublic
      const questionWords = ['what', 'how', 'where', 'when', 'why', 'who', 'which', 'can', 'will', 'are'];
      const prepositions = ['for', 'with', 'without', 'vs', 'versus', 'like', 'to', 'near'];
      
      questionWords.forEach(q => {
        keywords.push({
          keyword: `${q} ${keyword}`,
          source: 'AnswerThePublic Pattern',
          relevance: 0.7
        });
      });

      prepositions.forEach(prep => {
        keywords.push({
          keyword: `${keyword} ${prep}`,
          source: 'AnswerThePublic Pattern',
          relevance: 0.65
        });
      });

      return keywords.slice(0, 15);
    } catch (error) {
      return [];
    }
  }

  private async scrapeBingAutocomplete(keyword: string, location: string, language: string): Promise<ScrapedKeyword[]> {
    try {
      const keywords: ScrapedKeyword[] = [];
      const variations = [`${keyword}`, `${keyword} how`, `best ${keyword}`, `${keyword} guide`];

      for (const variation of variations.slice(0, 3)) {
        try {
          const response = await axios.get(`https://www.bing.com/AS/Suggestions?pt=page.serp&mkt=en-US&qry=${encodeURIComponent(variation)}&cp=0&cvid=`, {
            headers: { 'User-Agent': this.getRandomUserAgent() },
            timeout: 5000
          });

          const $ = cheerio.load(response.data);
          $('span.sa_tm_text').each((_, element) => {
            const suggestion = $(element).text().trim();
            if (suggestion && suggestion.toLowerCase().includes(keyword.toLowerCase())) {
              keywords.push({
                keyword: suggestion,
                source: 'Bing Autocomplete',
                relevance: 0.8
              });
            }
          });

          await this.delay(200);
        } catch (error) {
          // Continue with next variation
        }
      }

      return keywords;
    } catch (error) {
      return [];
    }
  }

  private deduplicateKeywords(keywords: ScrapedKeyword[]): ScrapedKeyword[] {
    const seen = new Set<string>();
    const unique: ScrapedKeyword[] = [];

    keywords.forEach(kw => {
      const normalized = kw.keyword.toLowerCase().trim();
      if (!seen.has(normalized) && normalized.length > 2 && normalized.length < 150) {
        seen.add(normalized);
        unique.push(kw);
      }
    });

    // Sort by relevance and source priority
    return unique.sort((a, b) => {
      const sourceWeights: Record<string, number> = {
        'Google Autocomplete': 1.0,
        'Google People Also Ask': 0.9,
        'Google Trends': 0.85,
        'Google Related Searches': 0.8,
        'Wikipedia Suggestions': 0.85,
        'YouTube Autocomplete': 0.75,
        'Bing Autocomplete': 0.8,
        'Reddit': 0.7,
        'Quora': 0.75,
        'Wikipedia': 0.8,
        'AnswerThePublic Pattern': 0.65
      };

      const aWeight = (a.relevance || 0) * (sourceWeights[a.source] || 0.5);
      const bWeight = (b.relevance || 0) * (sourceWeights[b.source] || 0.5);
      
      return bWeight - aWeight;
    }).slice(0, 80); // Return top 80 unique keywords
  }

  async cleanup(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}