import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, TrendingUp, Globe, Target, BarChart3, MousePointer, DollarSign, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import type { TopSearchQueriesAnalysis } from "../../../shared/schema";

export default function TopSearchQueries() {
  const [targetUrl, setTargetUrl] = useState("");
  const [country, setCountry] = useState("us");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<TopSearchQueriesAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!targetUrl.trim()) {
      setError("Please enter a website URL");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResults(null);

    try {
      const response = await apiRequest('POST', '/api/tools/top-search-queries', {
        targetUrl: targetUrl.trim(),
        country
      });
      
      const analysis = await response.json() as TopSearchQueriesAnalysis;
      setResults(analysis);
    } catch (err) {
      console.error('Top search queries analysis error:', err);
      setError(err instanceof Error ? err.message : 'Failed to analyze top search queries');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getDifficultyColor = (difficulty: number): string => {
    if (difficulty >= 80) return "text-red-600 bg-red-50 border-red-200";
    if (difficulty >= 60) return "text-orange-600 bg-orange-50 border-orange-200";
    if (difficulty >= 40) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-green-600 bg-green-50 border-green-200";
  };

  const getTrendColor = (trend: string): string => {
    switch (trend.toLowerCase()) {
      case 'rising': return "text-green-600 bg-green-50 border-green-200";
      case 'high': return "text-blue-600 bg-blue-50 border-blue-200";
      case 'competitive': return "text-red-600 bg-red-50 border-red-200";
      case 'niche': return "text-purple-600 bg-purple-50 border-purple-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const countries = [
    { code: 'us', name: 'United States', flag: '🇺🇸' },
    { code: 'uk', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'ca', name: 'Canada', flag: '🇨🇦' },
    { code: 'au', name: 'Australia', flag: '🇦🇺' },
    { code: 'de', name: 'Germany', flag: '🇩🇪' },
    { code: 'fr', name: 'France', flag: '🇫🇷' },
    { code: 'es', name: 'Spain', flag: '🇪🇸' },
    { code: 'it', name: 'Italy', flag: '🇮🇹' },
    { code: 'nl', name: 'Netherlands', flag: '🇳🇱' },
    { code: 'br', name: 'Brazil', flag: '🇧🇷' },
    { code: 'mx', name: 'Mexico', flag: '🇲🇽' },
    { code: 'ar', name: 'Argentina', flag: '🇦🇷' },
    { code: 'jp', name: 'Japan', flag: '🇯🇵' },
    { code: 'kr', name: 'South Korea', flag: '🇰🇷' },
    { code: 'cn', name: 'China', flag: '🇨🇳' },
    { code: 'in', name: 'India', flag: '🇮🇳' },
    { code: 'sg', name: 'Singapore', flag: '🇸🇬' },
    { code: 'za', name: 'South Africa', flag: '🇿🇦' },
    { code: 'ie', name: 'Ireland', flag: '🇮🇪' },
    { code: 'nz', name: 'New Zealand', flag: '🇳🇿' }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Top Search Queries
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Discover the top search keywords related to your website with CPC estimates and 
            keyword difficulty analysis. Get actionable insights for SEO optimization.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Query Analysis Setup
            </CardTitle>
            <CardDescription>
              Enter your website URL to discover top search queries and their performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="targetUrl">Website URL</Label>
                <Input
                  id="targetUrl"
                  data-testid="input-target-url"
                  placeholder="https://example.com"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  disabled={isAnalyzing}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select value={country} onValueChange={setCountry} disabled={isAnalyzing}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map(c => (
                      <SelectItem key={c.code} value={c.code}>
                        {c.flag} {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button 
              onClick={handleAnalyze} 
              disabled={isAnalyzing}
              className="w-full"
              data-testid="button-analyze-queries"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing Search Queries...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Analyze Top Search Queries
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {results && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <Search className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Total Queries
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {results.totalQueries}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Avg Rank
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {results.summary.averageRank}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Avg Difficulty
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {Math.round(results.queries.reduce((sum, q) => sum + q.difficulty, 0) / results.queries.length)}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-orange-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Avg CPC
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        ${results.summary.averageCPC}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Low Competition
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {results.queries.filter(q => q.difficulty < 50).length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Search Queries Table */}
            <Card>
              <CardHeader>
                <CardTitle>Top Search Queries ({results.queries.length})</CardTitle>
                <CardDescription>
                  Keywords related to your website with CPC and difficulty analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {results.queries.map((query, index) => (
                    <div 
                      key={`${query.keyword}-${index}`}
                      className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      data-testid={`query-${index}`}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge variant="secondary" className="text-xs">
                              #{query.rank}
                            </Badge>
                            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                              {query.keyword}
                            </h3>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500 dark:text-gray-400">Cost Per Click</p>
                              <p className="font-medium text-lg" data-testid={`cpc-${index}`}>
                                ${query.cpc.toFixed(2)}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500 dark:text-gray-400">Keyword Difficulty</p>
                              <Badge 
                                variant="outline" 
                                className={`${getDifficultyColor(query.difficulty)} text-sm px-3 py-1`}
                                data-testid={`difficulty-${index}`}
                              >
                                {query.difficulty}%
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-sm lg:w-48">
                          {query.url && (
                            <div>
                              <p className="text-gray-500 dark:text-gray-400">Ranking URL</p>
                              <a 
                                href={query.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 font-medium truncate block"
                                title={query.url}
                                data-testid={`url-${index}`}
                              >
                                View Page
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Additional Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-green-600" />
                    SEO Opportunities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Low Competition Keywords (&lt;50% difficulty)
                      </span>
                      <Badge variant="secondary">
                        {results.queries.filter(q => q.difficulty < 50).length}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        High Competition Keywords (70%+ difficulty)
                      </span>
                      <Badge variant="secondary">
                        {results.queries.filter(q => q.difficulty >= 70).length}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Commercial Intent Keywords
                      </span>
                      <Badge variant="secondary">
                        {results.queries.filter(q => 
                          q.keyword.includes('buy') || 
                          q.keyword.includes('price') || 
                          q.keyword.includes('cost') || 
                          q.keyword.includes('free')
                        ).length}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-blue-600" />
                    Performance Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Keywords Analyzed
                      </span>
                      <Badge variant="secondary">
                        {results.queries.length}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Average CPC
                      </span>
                      <Badge variant="secondary">
                        ${results.summary.averageCPC}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Easiest Keyword (Lowest Difficulty)
                      </span>
                      <Badge variant="secondary">
                        {Math.min(...results.queries.map(q => q.difficulty))}%
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}