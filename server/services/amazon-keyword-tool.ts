import axios from 'axios';
import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';
import UserAgent from 'user-agents';

interface AmazonKeywordData {
  keyword: string;
  volume: number;
  competition: number;
  cpc: number;
  trend: number;
  firstPositionUrl?: string;
  firstPositionTitle?: string;
  difficulty: number;
  clicks: number;
}

export class AmazonKeywordTool {
  private static instance: AmazonKeywordTool;
  private userAgents: string[];

  private constructor() {
    this.userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    ];
  }

  static getInstance(): AmazonKeywordTool {
    if (!AmazonKeywordTool.instance) {
      AmazonKeywordTool.instance = new AmazonKeywordTool();
    }
    return AmazonKeywordTool.instance;
  }

  private getRandomUserAgent(): string {
    return this.userAgents[Math.floor(Math.random() * this.userAgents.length)];
  }

  private getAmazonDomain(country: string): string {
    const domains: Record<string, string> = {
      'us': 'amazon.com',
      'uk': 'amazon.co.uk',
      'ca': 'amazon.ca',
      'de': 'amazon.de',
      'fr': 'amazon.fr',
      'it': 'amazon.it',
      'es': 'amazon.es',
      'jp': 'amazon.co.jp',
      'au': 'amazon.com.au',
      'in': 'amazon.in',
      'br': 'amazon.com.br',
      'mx': 'amazon.com.mx'
    };
    return domains[country.toLowerCase()] || 'amazon.com';
  }

  private getCountryLanguage(country: string): string {
    const languages: Record<string, string> = {
      'us': 'en_US',
      'uk': 'en_GB',
      'ca': 'en_CA',
      'de': 'de_DE',
      'fr': 'fr_FR',
      'it': 'it_IT',
      'es': 'es_ES',
      'jp': 'ja_JP',
      'au': 'en_AU',
      'in': 'en_IN',
      'br': 'pt_BR',
      'mx': 'es_MX'
    };
    return languages[country.toLowerCase()] || 'en_US';
  }

  private getCountryParams(country: string): Record<string, string> {
    const params: Record<string, Record<string, string>> = {
      'us': { ref: 'sr_nr_i_0', rh: 'i:aps', field_availability: '1' },
      'uk': { ref: 'sr_nr_i_0', rh: 'i:aps', field_availability: '1', language: 'en_GB' },
      'ca': { ref: 'sr_nr_i_0', rh: 'i:aps', field_availability: '1', language: 'en_CA' },
      'de': { ref: 'sr_nr_i_0', rh: 'i:aps', field_availability: '1', language: 'de_DE' },
      'fr': { ref: 'sr_nr_i_0', rh: 'i:aps', field_availability: '1', language: 'fr_FR' },
      'it': { ref: 'sr_nr_i_0', rh: 'i:aps', field_availability: '1', language: 'it_IT' },
      'es': { ref: 'sr_nr_i_0', rh: 'i:aps', field_availability: '1', language: 'es_ES' },
      'jp': { ref: 'sr_nr_i_0', rh: 'i:aps', field_availability: '1', language: 'ja_JP' },
      'au': { ref: 'sr_nr_i_0', rh: 'i:aps', field_availability: '1', language: 'en_AU' },
      'in': { ref: 'sr_nr_i_0', rh: 'i:aps', field_availability: '1', language: 'en_IN' },
      'br': { ref: 'sr_nr_i_0', rh: 'i:aps', field_availability: '1', language: 'pt_BR' },
      'mx': { ref: 'sr_nr_i_0', rh: 'i:aps', field_availability: '1', language: 'es_MX' }
    };
    return params[country.toLowerCase()] || params['us'];
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAmazonKeywords(keyword: string, country: string = 'us'): Promise<AmazonKeywordData[]> {
    console.log(`Researching Amazon keywords for: "${keyword}" in ${country}`);
    
    try {
      // Method 1: Scrape Amazon autocomplete suggestions
      const autocompleteResults = await this.scrapeAmazonAutocomplete(keyword, country);
      await this.sleep(2000 + Math.random() * 2000);
      
      // Method 2: Scrape Amazon search results for keyword extraction
      const searchResults = await this.scrapeAmazonSearch(keyword, country);
      await this.sleep(2000 + Math.random() * 2000);
      
      // Method 3: Get related keywords from product listings
      const relatedResults = await this.scrapeAmazonRelated(keyword, country);
      
      // Combine and deduplicate results
      const allKeywords = [...autocompleteResults, ...searchResults, ...relatedResults];
      const uniqueKeywords = this.deduplicateKeywords(allKeywords);
      
      // Analyze and add metrics to keywords
      const analyzedKeywords = await this.analyzeAmazonKeywords(uniqueKeywords, country);
      
      console.log(`Found ${analyzedKeywords.length} Amazon keywords for "${keyword}"`);
      return analyzedKeywords.sort((a, b) => b.volume - a.volume);
    } catch (error) {
      console.error('Error in Amazon keyword research:', error);
      throw new Error('Failed to retrieve Amazon keywords');
    }
  }

  private async scrapeAmazonAutocomplete(keyword: string, country: string): Promise<AmazonKeywordData[]> {
    try {
      const amazonDomain = this.getAmazonDomain(country);
      
      // Try Amazon's autocomplete API with country-specific parameters
      const language = this.getCountryLanguage(country);
      const response = await axios.get(
        `https://completion.${amazonDomain}/api/2017/suggestions?limit=20&prefix=${encodeURIComponent(keyword)}&suggestion-type=KEYWORD&page-type=Gateway&lop=${language}&site-variant=desktop&client-info=amazon-search-ui`,
        {
          headers: {
            'User-Agent': this.getRandomUserAgent(),
            'Accept': 'application/json',
            'Accept-Language': language.replace('_', '-'),
            'Referer': `https://${amazonDomain}/`
          },
          timeout: 15000
        }
      );

      if (response.data && response.data.suggestions) {
        return response.data.suggestions.map((suggestion: any) => ({
          keyword: suggestion.value || suggestion,
          volume: 0,
          competition: 0,
          cpc: 0,
          trend: 0,
          difficulty: 0,
          clicks: 0
        }));
      }
    } catch (error) {
      console.log('Amazon autocomplete API failed, trying fallback method');
    }

    // Fallback: Use basic search suggestions
    try {
      const amazonDomain = this.getAmazonDomain(country);
      const response = await axios.get(`https://${amazonDomain}/s?k=${encodeURIComponent(keyword)}`, {
        headers: { 'User-Agent': this.getRandomUserAgent() },
        timeout: 15000
      });
      
      const $ = cheerio.load(response.data);
      const suggestions: AmazonKeywordData[] = [];
      
      // Extract suggestions from search page
      $('.s-suggestion').each((_, element) => {
        const suggestion = $(element).text().trim();
        if (suggestion) {
          suggestions.push({
            keyword: suggestion,
            volume: 0,
            competition: 0,
            cpc: 0,
            trend: 0,
            difficulty: 0,
            clicks: 0
          });
        }
      });
      
      return suggestions;
    } catch (error) {
      console.error('Amazon autocomplete fallback failed:', error);
      return [];
    }
  }

  private async scrapeAmazonSearch(keyword: string, country: string): Promise<AmazonKeywordData[]> {
    try {
      const amazonDomain = this.getAmazonDomain(country);
      const language = this.getCountryLanguage(country);
      const countryParams = this.getCountryParams(country);
      const searchParams = new URLSearchParams({
        k: keyword,
        ...countryParams
      });
      
      const response = await axios.get(`https://${amazonDomain}/s?${searchParams.toString()}`, {
        headers: { 
          'User-Agent': this.getRandomUserAgent(),
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': language.replace('_', '-')
        },
        timeout: 15000
      });
      
      const $ = cheerio.load(response.data);
      const keywords: AmazonKeywordData[] = [];
      
      // Extract keywords from product titles and descriptions
      $('.s-result-item').each((_, product) => {
        const title = $(product).find('h2 a span, .a-size-medium span').text().trim();
        const price = $(product).find('.a-price-whole').text().trim();
        
        if (title) {
          // Generate related keywords from product title that include the search term
          const relatedKeywords = this.extractRelevantKeywords(title, keyword);
          relatedKeywords.forEach(relatedKeyword => {
            keywords.push({
              keyword: relatedKeyword,
              volume: 0,
              competition: 0,
              cpc: price ? this.estimateCPC(price) : 0,
              trend: 0,
              firstPositionTitle: title,
              difficulty: 0,
              clicks: 0
            });
          });
        }
      });
      
      return keywords;
    } catch (error) {
      console.error('Amazon search scraping error:', error);
      return [];
    }
  }

  private async scrapeAmazonRelated(keyword: string, country: string): Promise<AmazonKeywordData[]> {
    try {
      const amazonDomain = this.getAmazonDomain(country);
      const response = await axios.get(`https://${amazonDomain}/s?k=${encodeURIComponent(keyword)}`, {
        headers: { 'User-Agent': this.getRandomUserAgent() },
        timeout: 15000
      });
      
      const $ = cheerio.load(response.data);
      const keywords: AmazonKeywordData[] = [];
      
      // Extract related search terms
      $('.s-breadcrumb a, .a-link-normal').each((_, element) => {
        const text = $(element).text().trim();
        if (text && text.length > 3 && text.toLowerCase().includes(keyword.toLowerCase())) {
          keywords.push({
            keyword: text.toLowerCase(),
            volume: 0,
            competition: 0,
            cpc: 0,
            trend: 0,
            difficulty: 0,
            clicks: 0
          });
        }
      });
      
      return keywords;
    } catch (error) {
      console.error('Amazon related scraping error:', error);
      return [];
    }
  }

  private deduplicateKeywords(keywords: AmazonKeywordData[]): AmazonKeywordData[] {
    const seen = new Set<string>();
    return keywords.filter(keyword => {
      const key = keyword.keyword.toLowerCase().trim();
      if (seen.has(key) || key.length < 3) return false;
      seen.add(key);
      return true;
    });
  }

  private async analyzeAmazonKeywords(keywords: AmazonKeywordData[], country: string): Promise<AmazonKeywordData[]> {
    return keywords.map(keyword => {
      // Estimate search volume based on keyword characteristics
      const volume = this.estimateSearchVolume(keyword.keyword);
      const competition = this.estimateCompetition(keyword.keyword);
      const difficulty = this.estimateDifficulty(keyword.keyword, competition);
      const clicks = Math.floor(volume * 0.3 * Math.random());
      
      return {
        ...keyword,
        volume,
        competition,
        difficulty,
        clicks,
        trend: Math.floor(Math.random() * 21) - 10 // -10 to +10
      };
    });
  }

  private estimateSearchVolume(keyword: string): number {
    const baseVolume = 1000;
    let multiplier = 1;
    
    // Shorter keywords tend to have higher volume
    if (keyword.length < 10) multiplier *= 2;
    else if (keyword.length > 20) multiplier *= 0.5;
    
    // Common product-related keywords get higher volume
    const highVolumeTerms = ['best', 'cheap', 'buy', 'sale', 'deal', 'new', 'top', 'review'];
    if (highVolumeTerms.some(term => keyword.toLowerCase().includes(term))) {
      multiplier *= 1.5;
    }
    
    // Add randomness
    multiplier *= (0.5 + Math.random());
    
    return Math.floor(baseVolume * multiplier);
  }

  private estimateCompetition(keyword: string): number {
    let competition = 50; // Base competition
    
    // Commercial keywords tend to have higher competition
    const commercialTerms = ['buy', 'best', 'cheap', 'deal', 'sale', 'discount'];
    if (commercialTerms.some(term => keyword.toLowerCase().includes(term))) {
      competition += 20;
    }
    
    // Longer tail keywords have lower competition
    const wordCount = keyword.split(' ').length;
    if (wordCount > 3) competition -= 15;
    else if (wordCount === 1) competition += 10;
    
    // Add randomness
    competition += Math.floor(Math.random() * 20) - 10;
    
    return Math.max(1, Math.min(100, competition));
  }

  private estimateDifficulty(keyword: string, competition: number): number {
    let difficulty = competition * 0.8;
    
    // Brand keywords are harder to rank for
    const brandTerms = ['amazon', 'apple', 'samsung', 'nike', 'adidas'];
    if (brandTerms.some(term => keyword.toLowerCase().includes(term))) {
      difficulty += 15;
    }
    
    return Math.max(1, Math.min(100, Math.floor(difficulty)));
  }

  private estimateCPC(priceText: string): number {
    try {
      const price = parseFloat(priceText.replace(/[^\d.]/g, ''));
      return Math.max(0.1, Math.min(5.0, price * 0.05));
    } catch {
      return Math.random() * 2;
    }
  }

  private isStopWord(word: string): boolean {
    const stopWords = ['the', 'and', 'for', 'with', 'that', 'this', 'from', 'they', 'have', 'are', 'was', 'been', 'will', 'can', 'all', 'any', 'how', 'its', 'our', 'out', 'day', 'get', 'has', 'had', 'her', 'his', 'him', 'now', 'old', 'see', 'two', 'who', 'way', 'use', 'may', 'new', 'say', 'each', 'which', 'their', 'time', 'will', 'about', 'would', 'there', 'could', 'other', 'after', 'first', 'well', 'also', 'back', 'where', 'much', 'your', 'work', 'life', 'only', 'think', 'over', 'just', 'any', 'very', 'what', 'know', 'take', 'than', 'them', 'good', 'some'];
    return stopWords.includes(word.toLowerCase());
  }

  private extractRelevantKeywords(title: string, originalKeyword: string): string[] {
    const keywords: string[] = [];
    const titleLower = title.toLowerCase();
    const originalLower = originalKeyword.toLowerCase();
    
    // Split original keyword into parts
    const originalParts = originalLower.split(/\s+/);
    
    // Clean and split title
    const words = titleLower
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !this.isStopWord(word));
    
    // 1. Add variations with original keyword base
    const variations = [
      `${originalKeyword}`,
      `best ${originalKeyword}`,
      `cheap ${originalKeyword}`,
      `${originalKeyword} online`,
      `${originalKeyword} buy`,
      `${originalKeyword} price`,
      `${originalKeyword} deals`,
      `${originalKeyword} sale`,
      `buy ${originalKeyword}`,
      `${originalKeyword} review`,
      `${originalKeyword} discount`
    ];
    
    keywords.push(...variations);
    
    // 2. Find words that commonly appear with our keyword parts
    const relevantWords: string[] = [];
    originalParts.forEach(part => {
      words.forEach(word => {
        if (word.includes(part) || part.includes(word)) {
          relevantWords.push(word);
        }
      });
    });
    
    // 3. Generate combinations with relevant words
    relevantWords.forEach(word => {
      if (!originalLower.includes(word)) {
        keywords.push(`${originalKeyword} ${word}`);
        keywords.push(`${word} ${originalKeyword}`);
        
        // Add qualifier combinations
        const qualifiers = ['best', 'top', 'premium', 'quality', 'cheap', 'affordable'];
        qualifiers.forEach(qualifier => {
          keywords.push(`${qualifier} ${originalKeyword} ${word}`);
          keywords.push(`${qualifier} ${word} ${originalKeyword}`);
        });
      }
    });
    
    // 4. Extract brand + product combinations
    words.forEach((word, index) => {
      originalParts.forEach(part => {
        if (titleLower.includes(part) && word !== part) {
          keywords.push(`${word} ${originalKeyword}`);
          keywords.push(`${originalKeyword} ${word}`);
          
          // Brand + keyword combinations
          if (index < words.length - 1) {
            keywords.push(`${word} ${words[index + 1]} ${originalKeyword}`);
            keywords.push(`${originalKeyword} ${word} ${words[index + 1]}`);
          }
        }
      });
    });
    
    // 5. Add category-specific variations
    const categories = this.getCategoryVariations(originalKeyword);
    keywords.push(...categories);
    
    // Remove duplicates and filter by relevance
    const uniqueKeywords = Array.from(new Set(keywords))
      .filter(kw => kw.length > originalKeyword.length / 2) // Minimum length check
      .filter(kw => kw.length < 100) // Maximum length check
      .slice(0, 15); // Limit results
    
    return uniqueKeywords;
  }

  private getCategoryVariations(keyword: string): string[] {
    const variations: string[] = [];
    const lowerKeyword = keyword.toLowerCase();
    
    // Food/Kitchen related
    if (lowerKeyword.includes('dal') || lowerKeyword.includes('rice') || lowerKeyword.includes('oil')) {
      variations.push(
        `organic ${keyword}`,
        `${keyword} 1kg`,
        `${keyword} 5kg`,
        `${keyword} bulk`,
        `${keyword} brand`,
        `${keyword} pack`,
        `fresh ${keyword}`,
        `${keyword} grocery`,
        `${keyword} online grocery`,
        `${keyword} delivery`
      );
    }
    
    // Electronics
    if (lowerKeyword.includes('phone') || lowerKeyword.includes('laptop') || lowerKeyword.includes('headphone')) {
      variations.push(
        `${keyword} under 10000`,
        `${keyword} under 20000`,
        `${keyword} wireless`,
        `${keyword} bluetooth`,
        `${keyword} waterproof`,
        `${keyword} gaming`,
        `${keyword} professional`,
        `${keyword} accessories`
      );
    }
    
    // Clothing
    if (lowerKeyword.includes('shirt') || lowerKeyword.includes('dress') || lowerKeyword.includes('shoes')) {
      variations.push(
        `${keyword} men`,
        `${keyword} women`,
        `${keyword} cotton`,
        `${keyword} size m`,
        `${keyword} size l`,
        `${keyword} branded`,
        `${keyword} designer`,
        `${keyword} casual`,
        `${keyword} formal`
      );
    }
    
    // Home & Garden
    if (lowerKeyword.includes('furniture') || lowerKeyword.includes('decor') || lowerKeyword.includes('kitchen')) {
      variations.push(
        `${keyword} wooden`,
        `${keyword} steel`,
        `${keyword} modern`,
        `${keyword} traditional`,
        `${keyword} space saving`,
        `${keyword} storage`,
        `${keyword} compact`
      );
    }
    
    return variations;
  }
}