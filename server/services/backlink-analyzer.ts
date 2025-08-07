import axios from 'axios';
import * as cheerio from 'cheerio';
import { URL } from 'url';

interface LinkDetail {
  url: string;
  type: 'internal' | 'external';
  rel: string[];
  anchorText: string;
}

export interface BacklinkAnalysisResult {
  totalLinks: number;
  internalLinks: LinkDetail[];
  externalLinks: LinkDetail[];
  domain: string;
  url: string;
}

export class BacklinkAnalyzer {
  private static instance: BacklinkAnalyzer;
  private cache = new Map<string, BacklinkAnalysisResult>();
  private readonly cacheTimeout = 60 * 60 * 1000; // 1 hour cache

  static getInstance(): BacklinkAnalyzer {
    if (!BacklinkAnalyzer.instance) {
      BacklinkAnalyzer.instance = new BacklinkAnalyzer();
    }
    return BacklinkAnalyzer.instance;
  }

  async analyzeBacklinks(inputUrl: string): Promise<BacklinkAnalysisResult> {
    try {
      // Normalize and validate URL
      const normalizedUrl = this.normalizeUrl(inputUrl);
      const parsedUrl = new URL(normalizedUrl);
      const domain = parsedUrl.hostname;

      // Check cache first
      const cached = this.cache.get(normalizedUrl);
      if (cached) {
        console.log(`Using cached backlink data for ${normalizedUrl}`);
        return cached;
      }

      console.log(`Analyzing backlinks for: ${normalizedUrl}`);

      // Scrape the page and extract all links
      const response = await axios.get(normalizedUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        },
        timeout: 10000,
        maxRedirects: 5
      });

      const $ = cheerio.load(response.data);
      const internalLinks: LinkDetail[] = [];
      const externalLinks: LinkDetail[] = [];

      // Extract all links from the page
      $('a[href]').each((_, element) => {
        const href = $(element).attr('href');
        if (!href) return;

        try {
          const linkType = this.classifyLink(href, domain);
          const rel = this.extractRelAttributes(element, $);
          const anchorText = $(element).text().trim() || 'No anchor text';
          const fullUrl = this.resolveUrl(href, normalizedUrl);

          const linkDetail: LinkDetail = {
            url: fullUrl,
            type: linkType,
            rel,
            anchorText
          };

          if (linkType === 'internal') {
            internalLinks.push(linkDetail);
          } else {
            externalLinks.push(linkDetail);
          }
        } catch (error) {
          // Skip invalid URLs
          console.warn(`Skipping invalid URL: ${href}`);
        }
      });

      const result: BacklinkAnalysisResult = {
        totalLinks: internalLinks.length + externalLinks.length,
        internalLinks,
        externalLinks,
        domain,
        url: normalizedUrl
      };

      // Cache the result
      this.cache.set(normalizedUrl, result);
      setTimeout(() => this.cache.delete(normalizedUrl), this.cacheTimeout);

      return result;
    } catch (error) {
      console.error('Backlink analysis error:', error);
      throw new Error(`Failed to analyze backlinks: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private normalizeUrl(url: string): string {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    return url.trim();
  }

  private classifyLink(href: string, baseDomain: string): 'internal' | 'external' {
    try {
      // Handle relative URLs
      if (href.startsWith('/') || href.startsWith('#') || href.startsWith('?')) {
        return 'internal';
      }

      // Handle absolute URLs
      if (href.startsWith('http://') || href.startsWith('https://')) {
        const url = new URL(href);
        return url.hostname === baseDomain || url.hostname.endsWith(`.${baseDomain}`) ? 'internal' : 'external';
      }

      // Handle protocol-relative URLs
      if (href.startsWith('//')) {
        const url = new URL(`https:${href}`);
        return url.hostname === baseDomain || url.hostname.endsWith(`.${baseDomain}`) ? 'internal' : 'external';
      }

      // Handle relative paths without leading slash
      return 'internal';
    } catch (error) {
      // If URL parsing fails, treat as external for safety
      return 'external';
    }
  }

  private extractRelAttributes(element: any, $: cheerio.CheerioAPI): string[] {
    const rel = $(element).attr('rel');
    return rel ? rel.split(' ').map(r => r.trim()).filter(Boolean) : [];
  }

  private resolveUrl(href: string, baseUrl: string): string {
    try {
      return new URL(href, baseUrl).href;
    } catch (error) {
      // If URL resolution fails, return the original href
      return href;
    }
  }
}