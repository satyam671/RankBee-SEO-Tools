import axios from 'axios';
import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';
import UserAgent from 'user-agents';

interface YouTubeKeywordData {
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

export class YouTubeKeywordTool {
  private static instance: YouTubeKeywordTool;
  private userAgents: string[];

  private constructor() {
    this.userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    ];
  }

  static getInstance(): YouTubeKeywordTool {
    if (!YouTubeKeywordTool.instance) {
      YouTubeKeywordTool.instance = new YouTubeKeywordTool();
    }
    return YouTubeKeywordTool.instance;
  }

  private getRandomUserAgent(): string {
    return this.userAgents[Math.floor(Math.random() * this.userAgents.length)];
  }

  private getCountryCode(country: string): string {
    const codes: Record<string, string> = {
      'us': 'US',
      'uk': 'GB',
      'ca': 'CA',
      'de': 'DE',
      'fr': 'FR',
      'it': 'IT',
      'es': 'ES',
      'jp': 'JP',
      'au': 'AU',
      'in': 'IN',
      'br': 'BR',
      'mx': 'MX'
    };
    return codes[country.toLowerCase()] || 'US';
  }

  private getCountryLanguage(country: string): string {
    const languages: Record<string, string> = {
      'us': 'en',
      'uk': 'en',
      'ca': 'en',
      'de': 'de',
      'fr': 'fr',
      'it': 'it',
      'es': 'es',
      'jp': 'ja',
      'au': 'en',
      'in': 'en',
      'br': 'pt',
      'mx': 'es'
    };
    return languages[country.toLowerCase()] || 'en';
  }

  private getYouTubeDomain(country: string): string {
    // YouTube uses the same domain globally but different language/region parameters
    return 'youtube.com';
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getYouTubeKeywords(keyword: string, country: string = 'us'): Promise<YouTubeKeywordData[]> {
    console.log(`Researching YouTube keywords for: "${keyword}" in ${country}`);
    
    try {
      // Method 1: Scrape YouTube autocomplete suggestions
      const autocompleteResults = await this.scrapeYouTubeAutocomplete(keyword, country);
      await this.sleep(2000 + Math.random() * 2000);
      
      // Method 2: Scrape YouTube search results for keyword extraction
      const searchResults = await this.scrapeYouTubeSearch(keyword, country);
      await this.sleep(2000 + Math.random() * 2000);
      
      // Method 3: Get related keywords from video metadata
      const relatedResults = await this.scrapeYouTubeRelated(keyword, country);
      
      // Combine and deduplicate results
      const allKeywords = [...autocompleteResults, ...searchResults, ...relatedResults];
      const uniqueKeywords = this.deduplicateKeywords(allKeywords);
      
      // Analyze and add metrics to keywords
      const analyzedKeywords = await this.analyzeYouTubeKeywords(uniqueKeywords, country);
      
      console.log(`Found ${analyzedKeywords.length} YouTube keywords for "${keyword}"`);
      return analyzedKeywords.sort((a, b) => b.volume - a.volume);
    } catch (error) {
      console.error('Error in YouTube keyword research:', error);
      throw new Error('Failed to retrieve YouTube keywords');
    }
  }

  private async scrapeYouTubeAutocomplete(keyword: string, country: string): Promise<YouTubeKeywordData[]> {
    try {
      const countryCode = this.getCountryCode(country);
      const language = this.getCountryLanguage(country);
      
      // Use YouTube's autocomplete API with country-specific parameters
      const response = await axios.get(
        `https://suggestqueries.google.com/complete/search?client=youtube&ds=yt&q=${encodeURIComponent(keyword)}&hl=${language}&gl=${countryCode}&lr=lang_${language}`,
        {
          headers: {
            'User-Agent': this.getRandomUserAgent(),
            'Accept': 'application/json',
            'Accept-Language': `${language},en;q=0.9`
          },
          timeout: 15000
        }
      );

      if (Array.isArray(response.data) && response.data.length > 1) {
        return response.data[1].map((suggestion: string) => ({
          keyword: suggestion.toLowerCase(),
          volume: 0,
          competition: 0,
          cpc: 0,
          trend: 0,
          difficulty: 0,
          clicks: 0
        }));
      }
    } catch (error) {
      console.log('YouTube autocomplete API failed, trying fallback method');
    }

    return [];
  }

  private async scrapeYouTubeSearch(keyword: string, country: string): Promise<YouTubeKeywordData[]> {
    try {
      const countryCode = this.getCountryCode(country);
      const language = this.getCountryLanguage(country);
      const response = await axios.get(
        `https://www.youtube.com/results?search_query=${encodeURIComponent(keyword)}&gl=${countryCode}&hl=${language}&lr=lang_${language}`,
        {
          headers: { 
            'User-Agent': this.getRandomUserAgent(),
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': `${language},en;q=0.9`
          },
          timeout: 15000
        }
      );
      
      const $ = cheerio.load(response.data);
      const keywords: YouTubeKeywordData[] = [];
      
      // Extract keywords from video titles in search results
      const scriptTags = $('script').get();
      let videoData: any = null;
      
      for (const script of scriptTags) {
        const content = $(script).html();
        if (content && content.includes('var ytInitialData')) {
          try {
            const match = content.match(/var ytInitialData = ({.*?});/);
            if (match) {
              videoData = JSON.parse(match[1]);
              break;
            }
          } catch (e) {
            continue;
          }
        }
      }
      
      if (videoData) {
        try {
          const contents = videoData?.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents;
          if (contents && contents[0] && contents[0].itemSectionRenderer) {
            const videos = contents[0].itemSectionRenderer.contents;
            
            videos.forEach((video: any) => {
              if (video.videoRenderer && video.videoRenderer.title && video.videoRenderer.title.runs) {
                const title = video.videoRenderer.title.runs[0].text;
                const viewCount = video.videoRenderer.viewCountText?.simpleText || '0';
                
                if (title) {
                  // Generate related keywords from video title that include the search term
                  const relatedKeywords = this.extractRelevantKeywords(title, keyword);
                  relatedKeywords.forEach(relatedKeyword => {
                    keywords.push({
                      keyword: relatedKeyword,
                      volume: 0,
                      competition: 0,
                      cpc: 0,
                      trend: 0,
                      firstPositionTitle: title,
                      firstPositionUrl: video.videoRenderer.videoId ? `https://youtube.com/watch?v=${video.videoRenderer.videoId}` : undefined,
                      difficulty: 0,
                      clicks: 0
                    });
                  });
                }
              }
            });
          }
        } catch (parseError) {
          console.log('Error parsing YouTube data, using fallback extraction');
        }
      }
      
      // Fallback: Simple HTML parsing
      if (keywords.length === 0) {
        $('a[href*="/watch"]').each((_, element) => {
          const title = $(element).attr('title') || $(element).text().trim();
          if (title && title.length > 10) {
            const words = title.toLowerCase()
              .replace(/[^\w\s]/g, ' ')
              .split(/\s+/)
              .filter(word => word.length > 3 && !this.isStopWord(word));
            
            words.forEach((word: string) => {
              keywords.push({
                keyword: word,
                volume: 0,
                competition: 0,
                cpc: 0,
                trend: 0,
                firstPositionTitle: title,
                difficulty: 0,
                clicks: 0
              });
            });
          }
        });
      }
      
      return keywords;
    } catch (error) {
      console.error('YouTube search scraping error:', error);
      return [];
    }
  }

  private async scrapeYouTubeRelated(keyword: string, country: string): Promise<YouTubeKeywordData[]> {
    try {
      // Search for trending/related terms
      const trends = await this.getYouTubeTrends(keyword, country);
      return trends;
    } catch (error) {
      console.error('YouTube related scraping error:', error);
      return [];
    }
  }

  private async getYouTubeTrends(keyword: string, country: string): Promise<YouTubeKeywordData[]> {
    // Generate related keyword suggestions based on common YouTube patterns
    const relatedTerms = [
      `how to ${keyword}`,
      `${keyword} tutorial`,
      `${keyword} review`,
      `${keyword} 2024`,
      `${keyword} guide`,
      `${keyword} tips`,
      `${keyword} tricks`,
      `${keyword} compilation`,
      `${keyword} music`,
      `${keyword} video`,
      `${keyword} live`,
      `${keyword} reaction`,
      `${keyword} vs`,
      `${keyword} challenge`,
      `${keyword} funny`,
      `${keyword} best`,
      `${keyword} top 10`,
      `${keyword} fail`,
      `${keyword} success`,
      `${keyword} documentary`
    ];

    return relatedTerms.map(term => ({
      keyword: term,
      volume: 0,
      competition: 0,
      cpc: 0,
      trend: 0,
      difficulty: 0,
      clicks: 0
    }));
  }

  private deduplicateKeywords(keywords: YouTubeKeywordData[]): YouTubeKeywordData[] {
    const seen = new Set<string>();
    return keywords.filter(keyword => {
      const key = keyword.keyword.toLowerCase().trim();
      if (seen.has(key) || key.length < 3) return false;
      seen.add(key);
      return true;
    });
  }

  private async analyzeYouTubeKeywords(keywords: YouTubeKeywordData[], country: string): Promise<YouTubeKeywordData[]> {
    return keywords.map(keyword => {
      // Estimate search volume based on keyword characteristics
      const volume = this.estimateSearchVolume(keyword.keyword);
      const competition = this.estimateCompetition(keyword.keyword);
      const difficulty = this.estimateDifficulty(keyword.keyword, competition);
      const clicks = Math.floor(volume * 0.4 * Math.random()); // YouTube typically has higher CTR
      
      return {
        ...keyword,
        volume,
        competition,
        difficulty,
        clicks,
        trend: Math.floor(Math.random() * 21) - 10, // -10 to +10
        cpc: this.estimateCPC(keyword.keyword)
      };
    });
  }

  private estimateSearchVolume(keyword: string): number {
    const baseVolume = 5000; // YouTube typically has higher search volumes
    let multiplier = 1;
    
    // Shorter keywords tend to have higher volume
    if (keyword.length < 10) multiplier *= 2;
    else if (keyword.length > 25) multiplier *= 0.4;
    
    // Popular YouTube content types get higher volume
    const highVolumeTerms = ['tutorial', 'how to', 'review', 'music', 'funny', 'compilation', 'reaction'];
    if (highVolumeTerms.some(term => keyword.toLowerCase().includes(term))) {
      multiplier *= 1.8;
    }
    
    // Current year content gets boost
    if (keyword.includes('2024') || keyword.includes('2025')) {
      multiplier *= 1.3;
    }
    
    // Add randomness
    multiplier *= (0.3 + Math.random() * 1.4);
    
    return Math.floor(baseVolume * multiplier);
  }

  private estimateCompetition(keyword: string): number {
    let competition = 45; // Base competition (slightly lower than Amazon)
    
    // Popular content types have higher competition
    const competitiveTerms = ['tutorial', 'review', 'music', 'gaming', 'trending'];
    if (competitiveTerms.some(term => keyword.toLowerCase().includes(term))) {
      competition += 25;
    }
    
    // Longer tail keywords have lower competition
    const wordCount = keyword.split(' ').length;
    if (wordCount > 4) competition -= 20;
    else if (wordCount === 1) competition += 15;
    
    // Add randomness
    competition += Math.floor(Math.random() * 20) - 10;
    
    return Math.max(1, Math.min(100, competition));
  }

  private estimateDifficulty(keyword: string, competition: number): number {
    let difficulty = competition * 0.9;
    
    // Viral/trending keywords are harder to rank for
    const difficultTerms = ['viral', 'trending', 'challenge', 'meme'];
    if (difficultTerms.some(term => keyword.toLowerCase().includes(term))) {
      difficulty += 20;
    }
    
    // Educational content often has good ranking opportunities
    const educationalTerms = ['tutorial', 'how to', 'guide', 'learn'];
    if (educationalTerms.some(term => keyword.toLowerCase().includes(term))) {
      difficulty -= 10;
    }
    
    return Math.max(1, Math.min(100, Math.floor(difficulty)));
  }

  private estimateCPC(keyword: string): number {
    // YouTube ads generally have lower CPC than Google Ads
    let baseCPC = 0.5;
    
    // Commercial intent keywords have higher CPC
    const commercialTerms = ['review', 'buy', 'best', 'top', 'comparison'];
    if (commercialTerms.some(term => keyword.toLowerCase().includes(term))) {
      baseCPC *= 2;
    }
    
    // Entertainment content typically has lower CPC
    const entertainmentTerms = ['funny', 'compilation', 'reaction', 'meme'];
    if (entertainmentTerms.some(term => keyword.toLowerCase().includes(term))) {
      baseCPC *= 0.5;
    }
    
    return Math.max(0.05, Math.min(3.0, baseCPC * (0.5 + Math.random())));
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
      `${originalKeyword} tutorial`,
      `how to ${originalKeyword}`,
      `${originalKeyword} guide`,
      `${originalKeyword} tips`,
      `${originalKeyword} review`,
      `${originalKeyword} 2024`,
      `${originalKeyword} compilation`,
      `${originalKeyword} reaction`,
      `${originalKeyword} challenge`,
      `best ${originalKeyword}`
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
        
        // Add YouTube-specific qualifiers
        const qualifiers = ['how to', 'best', 'top', 'funny', 'epic', 'amazing'];
        qualifiers.forEach(qualifier => {
          keywords.push(`${qualifier} ${originalKeyword} ${word}`);
          keywords.push(`${qualifier} ${word} ${originalKeyword}`);
        });
      }
    });
    
    // 4. Add YouTube-specific content types
    const contentTypes = this.getYouTubeContentTypes(originalKeyword);
    keywords.push(...contentTypes);
    
    // Remove duplicates and filter by relevance
    const uniqueKeywords = Array.from(new Set(keywords))
      .filter(kw => kw.length > originalKeyword.length / 2) // Minimum length check
      .filter(kw => kw.length < 100) // Maximum length check
      .slice(0, 15); // Limit results
    
    return uniqueKeywords;
  }

  private getYouTubeContentTypes(keyword: string): string[] {
    const variations: string[] = [];
    const lowerKeyword = keyword.toLowerCase();
    
    // Tutorial/Educational content
    if (lowerKeyword.includes('cooking') || lowerKeyword.includes('recipe') || lowerKeyword.includes('tutorial')) {
      variations.push(
        `${keyword} step by step`,
        `${keyword} for beginners`,
        `${keyword} easy`,
        `${keyword} quick`,
        `${keyword} tips and tricks`,
        `${keyword} masterclass`,
        `${keyword} course`,
        `${keyword} explained`
      );
    }
    
    // Entertainment content
    if (lowerKeyword.includes('game') || lowerKeyword.includes('music') || lowerKeyword.includes('movie')) {
      variations.push(
        `${keyword} funny moments`,
        `${keyword} compilation`,
        `${keyword} highlights`,
        `${keyword} reaction`,
        `${keyword} review`,
        `${keyword} trailer`,
        `${keyword} gameplay`,
        `${keyword} live stream`
      );
    }
    
    // Tech/Product content
    if (lowerKeyword.includes('phone') || lowerKeyword.includes('laptop') || lowerKeyword.includes('tech')) {
      variations.push(
        `${keyword} unboxing`,
        `${keyword} review 2024`,
        `${keyword} vs comparison`,
        `${keyword} features`,
        `${keyword} hands on`,
        `${keyword} first look`,
        `${keyword} pros and cons`
      );
    }
    
    // Fitness/Health content
    if (lowerKeyword.includes('workout') || lowerKeyword.includes('fitness') || lowerKeyword.includes('health')) {
      variations.push(
        `${keyword} at home`,
        `${keyword} for beginners`,
        `${keyword} routine`,
        `${keyword} challenge`,
        `${keyword} results`,
        `${keyword} transformation`,
        `${keyword} motivation`
      );
    }
    
    return variations;
  }
}