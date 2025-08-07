import NodeCache from 'node-cache';
import { ScrapedKeyword } from './keyword-scraper';

export interface CacheEntry {
  data: ScrapedKeyword[];
  timestamp: number;
  source: string;
}

export class CacheManager {
  private static instance: CacheManager;
  private shortTermCache: NodeCache; // 10 minutes for real-time data
  private longTermCache: NodeCache;  // 2 hours for stable data
  private rateLimitCache: NodeCache; // 1 minute for rate limiting

  private constructor() {
    this.shortTermCache = new NodeCache({ stdTTL: 600, checkperiod: 120 }); // 10 minutes
    this.longTermCache = new NodeCache({ stdTTL: 7200, checkperiod: 600 }); // 2 hours
    this.rateLimitCache = new NodeCache({ stdTTL: 60, checkperiod: 30 }); // 1 minute
  }

  public static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  generateCacheKey(keyword: string, location: string, language: string, source?: string): string {
    const base = `${keyword.toLowerCase()}_${location}_${language}`;
    return source ? `${base}_${source}` : base;
  }

  setCacheEntry(key: string, data: ScrapedKeyword[], isLongTerm: boolean = false): void {
    const entry: CacheEntry = {
      data,
      timestamp: Date.now(),
      source: 'scraper'
    };

    if (isLongTerm) {
      this.longTermCache.set(key, entry);
    } else {
      this.shortTermCache.set(key, entry);
    }
  }

  getCacheEntry(key: string): CacheEntry | null {
    // Try short-term cache first, then long-term
    let entry = this.shortTermCache.get<CacheEntry>(key);
    if (!entry) {
      entry = this.longTermCache.get<CacheEntry>(key);
    }
    return entry || null;
  }

  isRateLimited(source: string): boolean {
    const rateLimitKey = `rate_limit_${source}`;
    const lastRequest = this.rateLimitCache.get<number>(rateLimitKey);
    
    if (lastRequest) {
      const timeSince = Date.now() - lastRequest;
      return timeSince < this.getRateLimitDelay(source);
    }
    
    return false;
  }

  setRateLimit(source: string): void {
    const rateLimitKey = `rate_limit_${source}`;
    this.rateLimitCache.set(rateLimitKey, Date.now());
  }

  private getRateLimitDelay(source: string): number {
    const delays: Record<string, number> = {
      'google': 1000,      // 1 second
      'youtube': 1500,     // 1.5 seconds
      'reddit': 2000,      // 2 seconds
      'quora': 3000,       // 3 seconds
      'wikipedia': 500,    // 0.5 seconds
      'bing': 1000,        // 1 second
      'default': 1000      // 1 second
    };
    return delays[source.toLowerCase()] || delays.default;
  }

  getCacheStats(): object {
    return {
      shortTerm: {
        keys: this.shortTermCache.keys().length,
        hits: this.shortTermCache.getStats().hits,
        misses: this.shortTermCache.getStats().misses
      },
      longTerm: {
        keys: this.longTermCache.keys().length,
        hits: this.longTermCache.getStats().hits,
        misses: this.longTermCache.getStats().misses
      },
      rateLimit: {
        keys: this.rateLimitCache.keys().length
      }
    };
  }

  clearCache(): void {
    this.shortTermCache.flushAll();
    this.longTermCache.flushAll();
    this.rateLimitCache.flushAll();
  }
}