import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, Globe, TrendingUp, Link, Users, Target, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import type { CompetitionAnalysis } from "../../../shared/schema";

export default function CompetitionChecker() {
  const [targetUrl, setTargetUrl] = useState("");
  const [keywords, setKeywords] = useState("");
  const [country, setCountry] = useState("US");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<CompetitionAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!targetUrl.trim() || !keywords.trim()) {
      setError("Please enter both target URL and keywords");
      return;
    }

    const keywordsList = keywords.split(',').map(k => k.trim()).filter(k => k.length > 0);
    
    if (keywordsList.length === 0) {
      setError("Please enter at least one keyword");
      return;
    }

    if (keywordsList.length > 20) {
      setError("Maximum 20 keywords allowed");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResults(null);

    try {
      const response = await apiRequest('POST', '/api/tools/competition-checker', {
        targetUrl: targetUrl.trim(),
        keywords: keywordsList,
        country
      });
      
      const analysis = await response.json() as CompetitionAnalysis;

      console.log('Competition analysis received:', {
        totalCompetitors: analysis.competitors.length,
        competitors: analysis.competitors.map(c => ({ name: c.name, domain: c.domain }))
      });

      setResults(analysis);
    } catch (err) {
      console.error('Competition analysis error:', err);
      setError(err instanceof Error ? err.message : 'Failed to analyze competition');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getDAColor = (da: number): string => {
    if (da >= 70) return "text-green-600 bg-green-50 border-green-200";
    if (da >= 40) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getPAColor = (pa: number): string => {
    if (pa >= 60) return "text-green-600 bg-green-50 border-green-200";
    if (pa >= 30) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Competition Checker
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Analyze your competitors' websites, keywords, and SEO metrics. Get real-time insights into 
            competitor rankings, domain authority, backlinks, and keyword opportunities.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Competition Analysis Setup
            </CardTitle>
            <CardDescription>
              Enter your competitor's website URL and target keywords to analyze their SEO performance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="targetUrl">Competitor Website URL</Label>
                <Input
                  id="targetUrl"
                  data-testid="input-target-url"
                  placeholder="https://competitor.com"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  disabled={isAnalyzing}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select value={country} onValueChange={setCountry} disabled={isAnalyzing}>
                  <SelectTrigger id="country" data-testid="select-country">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="US">United States</SelectItem>
                    <SelectItem value="UK">United Kingdom</SelectItem>
                    <SelectItem value="CA">Canada</SelectItem>
                    <SelectItem value="AU">Australia</SelectItem>
                    <SelectItem value="DE">Germany</SelectItem>
                    <SelectItem value="FR">France</SelectItem>
                    <SelectItem value="ES">Spain</SelectItem>
                    <SelectItem value="IT">Italy</SelectItem>
                    <SelectItem value="NL">Netherlands</SelectItem>
                    <SelectItem value="BR">Brazil</SelectItem>
                    <SelectItem value="MX">Mexico</SelectItem>
                    <SelectItem value="AR">Argentina</SelectItem>
                    <SelectItem value="IN">India</SelectItem>
                    <SelectItem value="JP">Japan</SelectItem>
                    <SelectItem value="CN">China</SelectItem>
                    <SelectItem value="KR">South Korea</SelectItem>
                    <SelectItem value="SG">Singapore</SelectItem>
                    <SelectItem value="TH">Thailand</SelectItem>
                    <SelectItem value="MY">Malaysia</SelectItem>
                    <SelectItem value="ID">Indonesia</SelectItem>
                    <SelectItem value="PH">Philippines</SelectItem>
                    <SelectItem value="VN">Vietnam</SelectItem>
                    <SelectItem value="RU">Russia</SelectItem>
                    <SelectItem value="PL">Poland</SelectItem>
                    <SelectItem value="CZ">Czech Republic</SelectItem>
                    <SelectItem value="HU">Hungary</SelectItem>
                    <SelectItem value="RO">Romania</SelectItem>
                    <SelectItem value="SE">Sweden</SelectItem>
                    <SelectItem value="NO">Norway</SelectItem>
                    <SelectItem value="DK">Denmark</SelectItem>
                    <SelectItem value="FI">Finland</SelectItem>
                    <SelectItem value="ZA">South Africa</SelectItem>
                    <SelectItem value="EG">Egypt</SelectItem>
                    <SelectItem value="NG">Nigeria</SelectItem>
                    <SelectItem value="KE">Kenya</SelectItem>
                    <SelectItem value="MA">Morocco</SelectItem>
                    <SelectItem value="AE">UAE</SelectItem>
                    <SelectItem value="SA">Saudi Arabia</SelectItem>
                    <SelectItem value="IL">Israel</SelectItem>
                    <SelectItem value="TR">Turkey</SelectItem>
                    <SelectItem value="GR">Greece</SelectItem>
                    <SelectItem value="PT">Portugal</SelectItem>
                    <SelectItem value="BE">Belgium</SelectItem>
                    <SelectItem value="AT">Austria</SelectItem>
                    <SelectItem value="CH">Switzerland</SelectItem>
                    <SelectItem value="IE">Ireland</SelectItem>
                    <SelectItem value="NZ">New Zealand</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="keywords">Keywords (comma-separated, max 20)</Label>
              <Textarea
                id="keywords"
                data-testid="textarea-keywords"
                placeholder="SEO tools, keyword research, rank tracking, backlink analysis"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                disabled={isAnalyzing}
                rows={3}
                className="resize-none"
              />
              <p className="text-sm text-gray-500">
                Enter up to 20 keywords separated by commas to analyze competitor rankings
              </p>
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
              data-testid="button-analyze-competition"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing Competition...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Analyze Competition
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {results && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Total Competitors
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {results.summary.totalCompetitors}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Average DA
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {results.summary.averageDA}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Average PA
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {results.summary.averagePA}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-orange-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Keyword Gaps
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {results.summary.keywordGaps.length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Competitors List */}
            <Card>
              <CardHeader>
                <CardTitle>All Competitors ({results.competitors.length})</CardTitle>
                <CardDescription>
                  Complete list of competitors with their SEO metrics and authority scores
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {console.log('Rendering competitors in UI:', results.competitors.length)}
                  {console.log('All competitors found:', results.competitors.map(c => c.domain))}
                  {results.competitors.map((competitor, index) => (
                    <div 
                      key={competitor.domain} 
                      className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      data-testid={`competitor-${index}`}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge variant="secondary" className="text-xs">
                              #{competitor.rank}
                            </Badge>
                            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                              {competitor.name}
                            </h3>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            {competitor.domain}
                          </p>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500 dark:text-gray-400">DA</p>
                              <Badge 
                                variant="outline" 
                                className={`${getDAColor(competitor.da)}`}
                                data-testid={`da-score-${index}`}
                              >
                                {competitor.da}
                              </Badge>
                            </div>
                            <div>
                              <p className="text-gray-500 dark:text-gray-400">PA</p>
                              <Badge 
                                variant="outline" 
                                className={`${getPAColor(competitor.pa)}`}
                                data-testid={`pa-score-${index}`}
                              >
                                {competitor.pa}
                              </Badge>
                            </div>
                            <div>
                              <p className="text-gray-500 dark:text-gray-400">Backlinks</p>
                              <p className="font-medium" data-testid={`backlinks-${index}`}>
                                {formatNumber(competitor.backlinks)}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500 dark:text-gray-400">Ref. Domains</p>
                              <p className="font-medium" data-testid={`ref-domains-${index}`}>
                                {formatNumber(competitor.referringDomains)}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm lg:w-48">
                          <div>
                            <p className="text-gray-500 dark:text-gray-400">Keywords</p>
                            <p className="font-medium" data-testid={`keywords-${index}`}>
                              {formatNumber(competitor.organicKeywords)}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500 dark:text-gray-400">URL</p>
                            <a 
                              href={competitor.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                              title={competitor.url}
                              data-testid={`url-${index}`}
                            >
                              Visit Site
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Keyword Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Keyword Analysis</CardTitle>
                <CardDescription>
                  Performance of your target keywords with top competing websites
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {results.keywordAnalysis.map((analysis, index) => (
                    <div key={analysis.keyword} className="border-b pb-6 last:border-b-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                            {analysis.keyword}
                          </h3>
                          <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                            <span>Volume: {formatNumber(analysis.searchVolume)}</span>
                            <span>Difficulty: {analysis.difficulty}%</span>
                          </div>
                        </div>
                        <Badge 
                          variant={analysis.difficulty < 30 ? "default" : analysis.difficulty < 70 ? "secondary" : "destructive"}
                          data-testid={`keyword-difficulty-${index}`}
                        >
                          {analysis.difficulty < 30 ? "Easy" : analysis.difficulty < 70 ? "Medium" : "Hard"}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900 dark:text-white">Top Ranking Competitors:</h4>
                        <div className="grid gap-2">
                          {analysis.topCompetitors.map((comp, compIndex) => (
                            <div 
                              key={`${comp.domain}-${comp.position}`}
                              className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm"
                              data-testid={`keyword-competitor-${index}-${compIndex}`}
                            >
                              <div className="flex items-center gap-3">
                                <Badge variant="outline" className="text-xs">
                                  #{comp.position}
                                </Badge>
                                <span className="font-medium">{comp.domain}</span>
                              </div>
                              <span className="text-gray-500 dark:text-gray-400 text-xs truncate max-w-48">
                                {comp.title}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Keyword Gaps */}
            {results.summary.keywordGaps.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-green-600" />
                    Keyword Opportunities
                  </CardTitle>
                  <CardDescription>
                    Low-competition keywords where you can potentially rank higher
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {results.summary.keywordGaps.map((keyword, index) => (
                      <Badge 
                        key={keyword} 
                        variant="secondary" 
                        className="text-green-700 bg-green-50 border-green-200"
                        data-testid={`keyword-gap-${index}`}
                      >
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}