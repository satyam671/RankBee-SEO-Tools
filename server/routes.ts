import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, loginUserSchema, insertToolResultSchema } from "@shared/schema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { WebScraper } from "./services/scraper";
import { SEOAnalyzer } from "./services/seo-analyzer";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const scraper = WebScraper.getInstance();
const seoAnalyzer = SEOAnalyzer.getInstance();

// Middleware to verify JWT token
const authenticateToken = async (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const session = await storage.getSessionByToken(token);
    if (!session) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    const user = await storage.getUser(session.userId);
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const user = await storage.createUser(userData);
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
      
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);
      
      await storage.createSession(user.id, token, expiresAt);

      res.json({ 
        user: { id: user.id, email: user.email, name: user.name }, 
        token 
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  // Google OAuth route
  app.post("/api/auth/google", async (req, res) => {
    try {
      const { email, name, googleId, avatar, provider } = req.body;
      
      if (!email || !name || !googleId) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Check if user exists
      let user = await storage.getUserByEmail(email);
      
      if (user) {
        // Update existing user with Google info if not already set
        if (!user.googleId) {
          user = await storage.updateUser(user.id, { googleId, avatar, provider });
        }
      } else {
        // Create new user
        user = await storage.createUser({
          email,
          name,
          googleId,
          avatar,
          provider
        });
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
      
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);
      
      await storage.createSession(user.id, token, expiresAt);

      res.json({ 
        user: { id: user.id, email: user.email, name: user.name, avatar: user.avatar }, 
        token 
      });
    } catch (error) {
      console.error("Google auth error:", error);
      res.status(500).json({ error: "Authentication failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = loginUserSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      if (!user.password) {
        return res.status(401).json({ message: "Please sign in with Google" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
      
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);
      
      await storage.createSession(user.id, token, expiresAt);

      res.json({ 
        user: { id: user.id, email: user.email, name: user.name }, 
        token 
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid credentials" });
    }
  });

  app.post("/api/auth/logout", authenticateToken, async (req, res) => {
    try {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      
      if (token) {
        await storage.deleteSession(token);
      }
      
      res.json({ message: "Logged out successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error logging out" });
    }
  });

  // SEO Tools routes (no authentication required)
  app.post("/api/tools/keyword-research", async (req, res) => {
    try {
      const { keyword, location, language } = req.body;
      
      if (!keyword) {
        return res.status(400).json({ message: "Keyword is required" });
      }
      
      const suggestions = await seoAnalyzer.generateKeywordSuggestions(
        keyword, 
        location || 'United States', 
        language || 'English'
      );
      
      // Only save results if user is authenticated
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      if (token) {
        try {
          const session = await storage.getSessionByToken(token);
          if (session) {
            await storage.saveToolResult({
              userId: session.userId,
              toolType: 'keyword-research',
              query: keyword,
              results: { suggestions, location, language }
            });
          }
        } catch (error) {
          // Continue without saving if auth fails
        }
      }

      res.json({ suggestions });
    } catch (error) {
      console.error('Keyword research error:', error);
      res.status(500).json({ message: "Error generating keyword suggestions" });
    }
  });

  // Website Authority (DA/PA) endpoint - Enhanced version
  app.post("/api/tools/website-authority", async (req, res) => {
    try {
      const { url } = req.body;
      
      if (!url) {
        return res.status(400).json({ message: "URL is required" });
      }

      const { WebsiteAuthorityAnalyzer } = await import('./services/website-authority.js');
      const analyzer = WebsiteAuthorityAnalyzer.getInstance();
      
      const result = await analyzer.analyzeWebsiteAuthority(url);
      
      // Only save results if user is authenticated
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      if (token) {
        try {
          const session = await storage.getSessionByToken(token);
          if (session) {
            await storage.saveToolResult({
              userId: session.userId,
              toolType: 'website-authority',
              query: url,
              results: result
            });
          }
        } catch (error) {
          // Continue without saving if auth fails
        }
      }
      
      res.json(result);
    } catch (error) {
      console.error('Website authority analysis error:', error);
      res.status(500).json({ 
        message: "Error analyzing website authority",
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Legacy domain authority endpoint for backward compatibility
  app.post("/api/tools/domain-authority", async (req, res) => {
    try {
      const { domain, url } = req.body;
      
      // Accept either domain or url for flexibility
      const inputUrl = url || domain;
      if (!inputUrl) {
        return res.status(400).json({ message: "URL or domain is required" });
      }

      const { WebsiteAuthorityAnalyzer } = await import('./services/website-authority.js');
      const analyzer = WebsiteAuthorityAnalyzer.getInstance();
      
      const result = await analyzer.analyzeWebsiteAuthority(inputUrl);
      
      // Only save results if user is authenticated
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      if (token) {
        try {
          const session = await storage.getSessionByToken(token);
          if (session) {
            await storage.saveToolResult({
              userId: session.userId,
              toolType: 'domain-authority',
              query: inputUrl,
              results: result
            });
          }
        } catch (error) {
          // Continue without saving if auth fails
        }
      }

      // Return in legacy format for backward compatibility
      res.json({
        url: result.url,
        domain: result.domain,
        domainAuthority: result.domain_authority,
        pageAuthority: result.page_authority,
        metadata: result.metadata,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Domain authority error:', error);
      res.status(500).json({ message: "Error checking domain authority" });
    }
  });

  app.post("/api/tools/meta-tags", async (req, res) => {
    try {
      const { url } = req.body;
      
      if (!url) {
        return res.status(400).json({ message: "URL is required" });
      }
      
      const metaTags = await scraper.scrapeMetaTags(url);
      
      // Only save results if user is authenticated
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      if (token) {
        try {
          const session = await storage.getSessionByToken(token);
          if (session) {
            await storage.saveToolResult({
              userId: session.userId,
              toolType: 'meta-tags',
              query: url,
              results: metaTags
            });
          }
        } catch (error) {
          // Continue without saving if auth fails
        }
      }

      res.json(metaTags);
    } catch (error) {
      console.error('Meta tags error:', error);
      res.status(500).json({ message: "Error extracting meta tags" });
    }
  });

  app.post("/api/tools/keyword-density", async (req, res) => {
    try {
      const { url, content } = req.body;
      
      if (!url && !content) {
        return res.status(400).json({ message: "URL or content is required" });
      }
      
      let textContent = content;
      if (url && !content) {
        textContent = await scraper.scrapePageContent(url);
      }
      
      const density = await scraper.analyzeKeywordDensity(textContent);
      
      // Only save results if user is authenticated
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      if (token) {
        try {
          const session = await storage.getSessionByToken(token);
          if (session) {
            await storage.saveToolResult({
              userId: session.userId,
              toolType: 'keyword-density',
              query: url || 'text-content',
              results: { density, wordCount: textContent.split(/\s+/).length }
            });
          }
        } catch (error) {
          // Continue without saving if auth fails
        }
      }

      res.json({ density, wordCount: textContent.split(/\s+/).length });
    } catch (error) {
      console.error('Keyword density error:', error);
      res.status(500).json({ message: "Error analyzing keyword density" });
    }
  });

  app.post("/api/tools/backlink-analyzer", async (req, res) => {
    try {
      const { domain } = req.body;
      
      if (!domain) {
        return res.status(400).json({ message: "URL is required" });
      }

      const { BacklinkAnalyzer } = await import('./services/backlink-analyzer.js');
      const analyzer = BacklinkAnalyzer.getInstance();
      
      const result = await analyzer.analyzeBacklinks(domain);
      
      // Only save results if user is authenticated
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      if (token) {
        try {
          const session = await storage.getSessionByToken(token);
          if (session) {
            await storage.saveToolResult({
              userId: session.userId,
              toolType: 'backlink-analyzer',
              query: domain,
              results: result
            });
          }
        } catch (error) {
          // Continue without saving if auth fails
        }
      }

      res.json(result);
    } catch (error) {
      console.error('Backlink analyzer error:', error);
      res.status(500).json({ 
        message: "Error analyzing backlinks",
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.post("/api/tools/rank-tracker", async (req, res) => {
    try {
      const { domain, keyword, searchEngine } = req.body;
      
      if (!domain || !keyword) {
        return res.status(400).json({ message: "Domain and keyword are required" });
      }

      const { RankTracker } = await import('./services/rank-tracker.js');
      const tracker = RankTracker.getInstance();
      
      const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '');
      const ranking = await tracker.trackKeywordRanking(cleanDomain, keyword, searchEngine || 'duckduckgo');
      
      // Only save results if user is authenticated
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      if (token) {
        try {
          const session = await storage.getSessionByToken(token);
          if (session) {
            await storage.saveToolResult({
              userId: session.userId,
              toolType: 'rank-tracker',
              query: `${cleanDomain} - ${keyword}`,
              results: ranking
            });
          }
        } catch (error) {
          // Continue without saving if auth fails
        }
      }

      res.json(ranking);
    } catch (error) {
      console.error('Rank tracker error:', error);
      res.status(500).json({ 
        message: "Error tracking keyword ranking",
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.post("/api/tools/rank-tracker/batch", async (req, res) => {
    try {
      const { domain, keywords, searchEngine } = req.body;
      
      if (!domain || !Array.isArray(keywords) || keywords.length === 0) {
        return res.status(400).json({ message: "Domain and keywords array are required" });
      }

      if (keywords.length > 50) {
        return res.status(400).json({ message: "Maximum 50 keywords allowed per batch" });
      }
      
      const { RankTracker } = await import('./services/rank-tracker.js');
      const tracker = RankTracker.getInstance();
      
      const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '');
      const batchResults = await tracker.trackBatchKeywords(cleanDomain, keywords, searchEngine || 'duckduckgo');
      
      // Only save results if user is authenticated
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      if (token) {
        try {
          const session = await storage.getSessionByToken(token);
          if (session) {
            await storage.saveToolResult({
              userId: session.userId,
              toolType: 'rank-tracker-batch',
              query: `${cleanDomain} - ${keywords.length} keywords`,
              results: batchResults
            });
          }
        } catch (error) {
          // Continue without saving if auth fails
        }
      }

      res.json(batchResults);
    } catch (error) {
      console.error('Batch rank tracking error:', error);
      res.status(500).json({ 
        message: "Error tracking batch keywords",
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.post("/api/tools/competition-checker", async (req, res) => {
    try {
      const { targetUrl, keywords, country } = req.body;
      
      if (!targetUrl || !Array.isArray(keywords) || keywords.length === 0) {
        return res.status(400).json({ message: "Target URL and keywords array are required" });
      }

      if (keywords.length > 20) {
        return res.status(400).json({ message: "Maximum 20 keywords allowed for competition analysis" });
      }
      
      const { CompetitionChecker } = await import('./services/competition-checker.js');
      const checker = CompetitionChecker.getInstance();
      
      const analysis = await checker.analyzeCompetition(targetUrl, keywords, country || 'US');
      
      // Save results if user is authenticated
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      if (token) {
        try {
          const session = await storage.getSessionByToken(token);
          if (session) {
            await storage.saveToolResult({
              userId: session.userId,
              toolType: 'competition-checker',
              query: `${targetUrl} - ${keywords.length} keywords`,
              results: analysis
            });
          }
        } catch (error) {
          // Continue without saving if auth fails
        }
      }

      res.json(analysis);
    } catch (error) {
      console.error('Competition checker error:', error);
      res.status(500).json({ 
        message: "Error analyzing competition",
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.post("/api/tools/content-seo", async (req, res) => {
    try {
      const { content, targetKeyword } = req.body;
      
      if (!content || !targetKeyword) {
        return res.status(400).json({ message: "Content and target keyword are required" });
      }
      
      const analysis = await seoAnalyzer.analyzeContentSEO(content, targetKeyword);
      
      // Only save results if user is authenticated
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      if (token) {
        try {
          const session = await storage.getSessionByToken(token);
          if (session) {
            await storage.saveToolResult({
              userId: session.userId,
              toolType: 'content-seo',
              query: targetKeyword,
              results: analysis
            });
          }
        } catch (error) {
          // Continue without saving if auth fails
        }
      }

      res.json(analysis);
    } catch (error) {
      console.error('Content SEO analysis error:', error);
      res.status(500).json({ message: "Error analyzing content SEO" });
    }
  });

  app.post("/api/tools/top-search-queries", async (req, res) => {
    try {
      const { targetUrl, country } = req.body;
      
      if (!targetUrl) {
        return res.status(400).json({ message: "Target URL is required" });
      }

      const { TopSearchQueries } = await import('./services/top-search-queries.js');
      const queryAnalyzer = TopSearchQueries.getInstance();
      
      const queries = await queryAnalyzer.getTopQueries(targetUrl, country || 'us');
      
      // Calculate summary statistics
      const totalQueries = queries.length;
      const averageRank = queries.length > 0 ? Math.round(queries.reduce((sum, q) => sum + q.rank, 0) / queries.length) : 0;
      const totalClicks = queries.reduce((sum, q) => sum + q.clicks, 0);
      const averageCPC = queries.length > 0 ? Math.round((queries.reduce((sum, q) => sum + q.cpc, 0) / queries.length) * 100) / 100 : 0;
      const highVolumeKeywords = queries.filter(q => q.monthlyVolume > 1000).length;
      const competitiveKeywords = queries.filter(q => q.difficulty > 70).length;

      const analysis = {
        domain: targetUrl,
        country: country || 'us',
        totalQueries,
        queries,
        summary: {
          averageRank,
          totalClicks,
          averageCPC,
          highVolumeKeywords,
          competitiveKeywords
        }
      };
      
      // Save results if user is authenticated
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      if (token) {
        try {
          const session = await storage.getSessionByToken(token);
          if (session) {
            await storage.saveToolResult({
              userId: session.userId,
              toolType: 'top-search-queries',
              query: `${targetUrl} - ${country || 'us'}`,
              results: analysis
            });
          }
        } catch (error) {
          // Continue without saving if auth fails
        }
      }

      res.json(analysis);
    } catch (error) {
      console.error('Top search queries error:', error);
      res.status(500).json({ 
        message: "Error analyzing top search queries",
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Top Referrers endpoint
  app.post("/api/tools/top-referrers", async (req, res) => {
    try {
      const { url } = req.body;
      
      if (!url) {
        return res.status(400).json({ message: "URL is required" });
      }

      const { TopReferrersService } = await import('./services/top-referrers.js');
      const referrerAnalyzer = TopReferrersService.getInstance();
      
      const referrers = await referrerAnalyzer.getTopReferrers(url);
      
      // Calculate summary statistics
      const summary = {
        totalReferrers: referrers.length,
        averageDA: referrers.length > 0 ? Math.round(referrers.reduce((sum, r) => sum + r.domainAuthority, 0) / referrers.length) : 0,
        totalBacklinks: referrers.reduce((sum, r) => sum + r.backlinks, 0),
        highAuthorityDomains: referrers.filter(r => r.domainAuthority > 70).length,
        dofollowLinks: referrers.filter(r => r.linkType === 'dofollow').length,
        nofollowLinks: referrers.filter(r => r.linkType === 'nofollow').length,
        uniqueDomains: new Set(referrers.map(r => r.domain)).size
      };

      const result = {
        url,
        referrers,
        summary,
        timestamp: new Date().toISOString()
      };
      
      // Only save results if user is authenticated
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      if (token) {
        try {
          const session = await storage.getSessionByToken(token);
          if (session) {
            await storage.saveToolResult({
              userId: session.userId,
              toolType: 'top-referrers',
              query: url,
              results: result
            });
          }
        } catch (error) {
          // Continue without saving if auth fails
        }
      }
      
      res.json(result);
    } catch (error) {
      console.error('Top referrers error:', error);
      res.status(500).json({ 
        message: "Error retrieving top referrers",
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Amazon Keyword Tool endpoint
  app.post("/api/tools/amazon-keywords", async (req, res) => {
    try {
      const { keyword, country } = req.body;
      
      if (!keyword) {
        return res.status(400).json({ message: "Keyword is required" });
      }

      const { AmazonKeywordTool } = await import('./services/amazon-keyword-tool.js');
      const keywordTool = AmazonKeywordTool.getInstance();
      
      const keywords = await keywordTool.getAmazonKeywords(keyword, country || 'us');
      
      // Calculate summary statistics
      const summary = {
        totalKeywords: keywords.length,
        averageVolume: keywords.length > 0 ? Math.round(keywords.reduce((sum, k) => sum + k.volume, 0) / keywords.length) : 0,
        averageCompetition: keywords.length > 0 ? Math.round(keywords.reduce((sum, k) => sum + k.competition, 0) / keywords.length) : 0,
        averageCPC: keywords.length > 0 ? Math.round((keywords.reduce((sum, k) => sum + k.cpc, 0) / keywords.length) * 100) / 100 : 0,
        highVolumeKeywords: keywords.filter(k => k.volume > 5000).length,
        lowCompetitionKeywords: keywords.filter(k => k.competition < 30).length,
        commercialKeywords: keywords.filter(k => k.cpc > 1.0).length
      };

      const result = {
        keyword,
        country: country || 'us',
        platform: 'amazon',
        keywords,
        summary,
        timestamp: new Date().toISOString()
      };
      
      // Save results if user is authenticated
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      if (token) {
        try {
          const session = await storage.getSessionByToken(token);
          if (session) {
            await storage.saveToolResult({
              userId: session.userId,
              toolType: 'amazon-keywords',
              query: `${keyword} - ${country || 'us'}`,
              results: result
            });
          }
        } catch (error) {
          // Continue without saving if auth fails
        }
      }
      
      res.json(result);
    } catch (error) {
      console.error('Amazon keyword tool error:', error);
      res.status(500).json({ 
        message: "Error retrieving Amazon keywords",
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // YouTube Keyword Tool endpoint
  app.post("/api/tools/youtube-keywords", async (req, res) => {
    try {
      const { keyword, country } = req.body;
      
      if (!keyword) {
        return res.status(400).json({ message: "Keyword is required" });
      }

      const { YouTubeKeywordTool } = await import('./services/youtube-keyword-tool.js');
      const keywordTool = YouTubeKeywordTool.getInstance();
      
      const keywords = await keywordTool.getYouTubeKeywords(keyword, country || 'us');
      
      // Calculate summary statistics
      const summary = {
        totalKeywords: keywords.length,
        averageVolume: keywords.length > 0 ? Math.round(keywords.reduce((sum, k) => sum + k.volume, 0) / keywords.length) : 0,
        averageCompetition: keywords.length > 0 ? Math.round(keywords.reduce((sum, k) => sum + k.competition, 0) / keywords.length) : 0,
        averageCPC: keywords.length > 0 ? Math.round((keywords.reduce((sum, k) => sum + k.cpc, 0) / keywords.length) * 100) / 100 : 0,
        highVolumeKeywords: keywords.filter(k => k.volume > 10000).length,
        lowCompetitionKeywords: keywords.filter(k => k.competition < 30).length,
        tutorialKeywords: keywords.filter(k => k.keyword.includes('tutorial') || k.keyword.includes('how to')).length
      };

      const result = {
        keyword,
        country: country || 'us',
        platform: 'youtube',
        keywords,
        summary,
        timestamp: new Date().toISOString()
      };
      
      // Save results if user is authenticated
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      if (token) {
        try {
          const session = await storage.getSessionByToken(token);
          if (session) {
            await storage.saveToolResult({
              userId: session.userId,
              toolType: 'youtube-keywords',
              query: `${keyword} - ${country || 'us'}`,
              results: result
            });
          }
        } catch (error) {
          // Continue without saving if auth fails
        }
      }
      
      res.json(result);
    } catch (error) {
      console.error('YouTube keyword tool error:', error);
      res.status(500).json({ 
        message: "Error retrieving YouTube keywords",
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get user's tool history
  app.get("/api/tools/history", authenticateToken, async (req, res) => {
    try {
      const { toolType } = req.query;
      const results = await storage.getToolResults((req as any).user.id, toolType as string);
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: "Error fetching tool history" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
