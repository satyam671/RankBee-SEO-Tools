// Add this to your existing routes.ts file
app.post("/api/tools/top-search-queries", async (req, res) => {
  try {
    const { url, country } = req.body;
    
    if (!url) {
      return res.status(400).json({ message: "URL is required" });
    }

    const { TopSearchQueries } = await import('./services/top-search-queries.js');
    const topQueriesTool = TopSearchQueries.getInstance();
    
    const results = await topQueriesTool.getTopQueries(url, country || 'us');
    
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
            query: url,
            results: { queries: results, country }
          });
        }
      } catch (error) {
        // Continue without saving if auth fails
      }
    }

    res.json({ queries: results });
  } catch (error) {
    console.error('Top search queries error:', error);
    res.status(500).json({ 
      message: "Error fetching top search queries",
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});