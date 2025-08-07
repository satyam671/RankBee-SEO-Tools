import axios from 'axios';

export class RobotsChecker {
  private static instance: RobotsChecker;
  private robotsCache = new Map<string, { allowed: boolean, timestamp: number }>();
  private cacheTimeout = 24 * 60 * 60 * 1000; // 24 hours

  public static getInstance(): RobotsChecker {
    if (!RobotsChecker.instance) {
      RobotsChecker.instance = new RobotsChecker();
    }
    return RobotsChecker.instance;
  }

  async isScrapingAllowed(domain: string, userAgent: string = '*'): Promise<boolean> {
    const cacheKey = `${domain}_${userAgent}`;
    const cached = this.robotsCache.get(cacheKey);
    
    if (cached && (Date.now() - cached.timestamp) < this.cacheTimeout) {
      return cached.allowed;
    }

    try {
      const robotsUrl = `https://${domain}/robots.txt`;
      const response = await axios.get(robotsUrl, {
        timeout: 5000,
        headers: { 'User-Agent': 'RankBee-SEO-Bot/1.0' }
      });

      const robotsContent = response.data;
      const allowed = this.parseRobotsTxt(robotsContent, userAgent);
      
      this.robotsCache.set(cacheKey, { allowed, timestamp: Date.now() });
      return allowed;
    } catch (error) {
      // If robots.txt is not accessible, assume scraping is allowed with respectful limits
      const allowed = true;
      this.robotsCache.set(cacheKey, { allowed, timestamp: Date.now() });
      return allowed;
    }
  }

  private parseRobotsTxt(content: string, userAgent: string): boolean {
    const lines = content.split('\n').map(line => line.trim());
    let currentUserAgent = '';
    let isRelevantSection = false;
    
    for (const line of lines) {
      if (line.startsWith('User-agent:')) {
        currentUserAgent = line.split(':')[1].trim();
        isRelevantSection = currentUserAgent === userAgent || currentUserAgent === '*';
      } else if (isRelevantSection && line.startsWith('Disallow:')) {
        const disallowPath = line.split(':')[1].trim();
        if (disallowPath === '/' || disallowPath === '/*') {
          return false; // Complete disallow
        }
      } else if (isRelevantSection && line.startsWith('Allow:')) {
        // Allow directive found, generally means scraping is okay for specified paths
        return true;
      }
    }
    
    return true; // No explicit disallow found
  }

  getRecommendedDelay(domain: string): number {
    // Conservative delays based on site type
    const delays: Record<string, number> = {
      'google.com': 2000,
      'youtube.com': 1500,
      'reddit.com': 3000,
      'quora.com': 4000,
      'wikipedia.org': 1000,
      'bing.com': 2000
    };
    
    for (const [site, delay] of Object.entries(delays)) {
      if (domain.includes(site)) {
        return delay;
      }
    }
    
    return 2000; // Default 2 second delay
  }
}