import axios from 'axios';
import * as cheerio from 'cheerio';
import { URL } from 'url';

export interface WebsiteAuthorityMetrics {
  domain: string;
  url: string;
  domain_authority: number;
  page_authority: number;
  metadata: {
    title: string;
    description: string;
    keywords: string[];
    openGraph: Record<string, string>;
    twitterCard: Record<string, string>;
    canonicalUrl?: string;
    robots?: string;
    lang?: string;
  };
}

interface PageData {
  metadata: {
    title: string;
    description: string;
    keywords: string[];
    openGraph: Record<string, string>;
    twitterCard: Record<string, string>;
    canonicalUrl?: string;
    robots?: string;
    lang?: string;
  };
  contentMetrics: {
    wordCount: number;
    headings: number;
    images: number;
    internalLinks: number;
    externalLinks: number;
  };
}

export class WebsiteAuthorityAnalyzer {
  private static instance: WebsiteAuthorityAnalyzer;
  private cache = new Map<string, WebsiteAuthorityMetrics>();
  private readonly cacheTimeout = 30 * 60 * 1000; // 30 minutes

  static getInstance(): WebsiteAuthorityAnalyzer {
    if (!WebsiteAuthorityAnalyzer.instance) {
      WebsiteAuthorityAnalyzer.instance = new WebsiteAuthorityAnalyzer();
    }
    return WebsiteAuthorityAnalyzer.instance;
  }

  async analyzeWebsiteAuthority(inputUrl: string): Promise<WebsiteAuthorityMetrics> {
    try {
      // Normalize and validate URL
      const normalizedUrl = this.normalizeUrl(inputUrl);
      const parsedUrl = new URL(normalizedUrl);
      const domain = parsedUrl.hostname;

      // Check cache first
      const cacheKey = `${domain}-${normalizedUrl}`;
      const cached = this.cache.get(cacheKey);
      if (cached) {
        console.log(`Using cached authority data for ${domain}`);
        return cached;
      }

      console.log(`Analyzing website authority for: ${normalizedUrl}`);

      // Scrape page content and extract metadata
      const pageData = await this.scrapePageContent(normalizedUrl);

      // Calculate authority scores based on actual scraped data
      const domainAuthority = this.calculateDomainAuthorityFromContent(pageData);
      const pageAuthority = this.calculatePageAuthorityFromContent(pageData);

      const result: WebsiteAuthorityMetrics = {
        domain,
        url: normalizedUrl,
        domain_authority: domainAuthority,
        page_authority: pageAuthority,
        metadata: pageData.metadata
      };

      // Cache the result
      this.cache.set(cacheKey, result);
      setTimeout(() => this.cache.delete(cacheKey), this.cacheTimeout);

      return result;
    } catch (error) {
      console.error('Website authority analysis error:', error);
      throw new Error(`Failed to analyze website authority: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private normalizeUrl(url: string): string {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    return url.trim().toLowerCase();
  }

  private async scrapePageContent(url: string): Promise<PageData> {
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        },
        timeout: 10000,
        maxRedirects: 5
      });

      const $ = cheerio.load(response.data);
      const parsedUrl = new URL(url);
      const domain = parsedUrl.hostname;

      // Extract metadata
      const metadata = this.extractMetadata($);
      
      // Extract content metrics
      const contentMetrics = this.analyzeContentMetrics($, domain);

      return {
        metadata,
        contentMetrics
      };
    } catch (error) {
      console.error(`Failed to scrape ${url}:`, error);
      throw new Error(`Failed to scrape page content: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private extractMetadata($: cheerio.CheerioAPI) {
    const metadata = {
      title: $('title').first().text().trim() || '',
      description: $('meta[name="description"]').attr('content') || '',
      keywords: ($('meta[name="keywords"]').attr('content') || '').split(',').map(k => k.trim()).filter(Boolean),
      openGraph: {} as Record<string, string>,
      twitterCard: {} as Record<string, string>,
      canonicalUrl: $('link[rel="canonical"]').attr('href'),
      robots: $('meta[name="robots"]').attr('content'),
      lang: $('html').attr('lang')
    };

    // Extract Open Graph tags
    $('meta[property^="og:"]').each((_, el) => {
      const property = $(el).attr('property');
      const content = $(el).attr('content');
      if (property && content) {
        metadata.openGraph[property] = content;
      }
    });

    // Extract Twitter Card tags
    $('meta[name^="twitter:"]').each((_, el) => {
      const name = $(el).attr('name');
      const content = $(el).attr('content');
      if (name && content) {
        metadata.twitterCard[name] = content;
      }
    });

    return metadata;
  }

  private analyzeContentMetrics($: cheerio.CheerioAPI, domain: string) {
    const bodyText = $('body').text().replace(/\s+/g, ' ').trim();
    const wordCount = bodyText.split(' ').filter(word => word.length > 0).length;
    const headings = $('h1, h2, h3, h4, h5, h6').length;
    const images = $('img').length;
    
    // Count internal and external links
    let internalLinks = 0;
    let externalLinks = 0;
    
    $('a[href]').each((_, el) => {
      const href = $(el).attr('href');
      if (!href) return;
      
      try {
        if (href.startsWith('/') || href.includes(domain)) {
          internalLinks++;
        } else if (href.startsWith('http')) {
          externalLinks++;
        }
      } catch (error) {
        // Skip invalid URLs
      }
    });

    return {
      wordCount,
      headings,
      images,
      internalLinks,
      externalLinks
    };
  }

  private calculateDomainAuthorityFromContent(pageData: PageData): number {
    let score = 0;

    // Content quality factors (max 40 points)
    const { wordCount, headings, images, internalLinks, externalLinks } = pageData.contentMetrics;
    
    // Word count scoring
    if (wordCount > 2000) score += 15;
    else if (wordCount > 1000) score += 10;
    else if (wordCount > 500) score += 5;

    // Structure scoring
    if (headings > 10) score += 10;
    else if (headings > 5) score += 7;
    else if (headings > 2) score += 4;

    // Image optimization
    if (images > 5) score += 5;

    // Link structure
    if (internalLinks > 20) score += 5;
    else if (internalLinks > 10) score += 3;

    if (externalLinks > 5) score += 5;
    else if (externalLinks > 2) score += 3;

    // Metadata quality (max 30 points)
    const { title, description, openGraph, twitterCard } = pageData.metadata;
    
    if (title && title.length > 30 && title.length < 60) score += 10;
    else if (title && title.length > 0) score += 5;

    if (description && description.length > 120 && description.length < 160) score += 10;
    else if (description && description.length > 0) score += 5;

    if (Object.keys(openGraph).length > 3) score += 5;
    if (Object.keys(twitterCard).length > 2) score += 5;

    // Technical factors (max 30 points)
    if (pageData.metadata.canonicalUrl) score += 5;
    if (pageData.metadata.robots) score += 5;
    if (pageData.metadata.lang) score += 5;
    
    // Bonus for comprehensive metadata
    if (pageData.metadata.keywords.length > 0) score += 5;
    if (Object.keys(openGraph).length > 0 && Object.keys(twitterCard).length > 0) score += 10;

    return Math.min(Math.max(score, 1), 100);
  }

  private calculatePageAuthorityFromContent(pageData: PageData): number {
    let score = 0;

    // Page-specific content quality (max 50 points)
    const { wordCount, headings, images, internalLinks } = pageData.contentMetrics;
    
    // Content depth
    if (wordCount > 1500) score += 20;
    else if (wordCount > 800) score += 15;
    else if (wordCount > 300) score += 10;

    // Content structure
    if (headings > 8) score += 15;
    else if (headings > 4) score += 10;
    else if (headings > 1) score += 5;

    // Visual content
    if (images > 3) score += 10;
    else if (images > 0) score += 5;

    // Internal linking
    if (internalLinks > 15) score += 5;

    // Page metadata optimization (max 30 points)
    const { title, description, openGraph } = pageData.metadata;
    
    if (title && title.length > 20 && title.length < 70) score += 15;
    else if (title) score += 8;

    if (description && description.length > 100 && description.length < 170) score += 15;
    else if (description) score += 8;

    // Technical SEO (max 20 points)
    if (pageData.metadata.canonicalUrl) score += 5;
    if (pageData.metadata.robots && !pageData.metadata.robots.includes('noindex')) score += 5;
    if (Object.keys(openGraph).length > 2) score += 5;
    if (pageData.metadata.lang) score += 5;

    return Math.min(Math.max(score, 1), 100);
  }
}