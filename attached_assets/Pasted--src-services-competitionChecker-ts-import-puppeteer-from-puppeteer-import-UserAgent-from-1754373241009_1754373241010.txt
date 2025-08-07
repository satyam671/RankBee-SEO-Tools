// src/services/competitionChecker.ts
import puppeteer from 'puppeteer';
import { UserAgent } from 'user-agents';
import cheerio from 'cheerio';

interface Competitor {
  url: string;
  title: string;
  description: string;
  position: number;
}

export class CompetitionChecker {
  async getCompetitors(keyword: string, country: string): Promise<Competitor[]> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
      const page = await browser.newPage();
      const userAgent = new UserAgent({ deviceCategory: 'desktop' });
      await page.setUserAgent(userAgent.toString());
      
      // Set Google domain based on country
      const googleDomain = this.getGoogleDomain(country);
      const searchUrl = `https://${googleDomain}/search?q=${encodeURIComponent(keyword)}&num=100`;
      
      await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 30000 });
      await page.waitForSelector('div.g', { timeout: 10000 });
      
      const html = await page.content();
      const $ = cheerio.load(html);
      const competitors: Competitor[] = [];
      
      $('div.g').each((i, el) => {
        const url = $(el).find('a').attr('href');
        const title = $(el).find('h3').text();
        const description = $(el).find('div[data-sncf]').first().text();
        
        if (url && title) {
          competitors.push({
            url: this.cleanUrl(url),
            title,
            description,
            position: i + 1
          });
        }
      });
      
      return competitors;
    } finally {
      await browser.close();
    }
  }
  
  private cleanUrl(url: string): string {
    try {
      const parsed = new URL(url);
      return `${parsed.hostname}${parsed.pathname}`.replace(/\/$/, '');
    } catch {
      return url;
    }
  }
  
  private getGoogleDomain(country: string): string {
    const domains: Record<string, string> = {
      'us': 'google.com',
      'uk': 'google.co.uk',
      'ca': 'google.ca',
      'au': 'google.com.au',
      // Add more country codes as needed
    };
    
    return domains[country.toLowerCase()] || 'google.com';
  }
}