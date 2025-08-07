import { useState } from "react";
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
import type { CompetitionAnalysis, CompetitorData } from "../../../shared/schema";

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
    <div className="space-y-6 max-h-[70vh] overflow-y-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Target className="h-5 w-5" />
            Competition Analysis Setup
          </CardTitle>
          <CardDescription>
            Enter competitor website URL and keywords to analyze their SEO performance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="targetUrl">Competitor Website URL</Label>
              <Input
                id="targetUrl"
                data-testid="input-target-url"
                placeholder="https://competitor.com"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                disabled={isAnalyzing}
                className="text-sm"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select value={country} onValueChange={setCountry} disabled={isAnalyzing}>
                <SelectTrigger id="country" data-testid="select-country" className="text-sm">
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
              placeholder="SEO tools, keyword research, rank tracking"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              disabled={isAnalyzing}
              rows={2}
              className="resize-none text-sm"
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">{error}</AlertDescription>
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
                Analyzing...
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
        <div className="space-y-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card className="p-3">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                <div className="text-center">
                  <p className="text-xs text-gray-600">Competitors</p>
                  <p className="text-lg font-bold">{results.summary.totalCompetitors}</p>
                </div>
              </div>
            </Card>

            <Card className="p-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <div className="text-center">
                  <p className="text-xs text-gray-600">Avg DA</p>
                  <p className="text-lg font-bold">{results.summary.averageDA}</p>
                </div>
              </div>
            </Card>

            <Card className="p-3">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-purple-600" />
                <div className="text-center">
                  <p className="text-xs text-gray-600">Avg PA</p>
                  <p className="text-lg font-bold">{results.summary.averagePA}</p>
                </div>
              </div>
            </Card>

            <Card className="p-3">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-orange-600" />
                <div className="text-center">
                  <p className="text-xs text-gray-600">Opportunities</p>
                  <p className="text-lg font-bold">{results.summary.keywordGaps.length}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Top Competitors */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Top Competitors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {results.competitors.slice(0, 5).map((competitor: CompetitorData, index: number) => (
                <div 
                  key={competitor.domain} 
                  className="p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                  data-testid={`competitor-${index}`}
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary" className="text-xs">#{competitor.rank}</Badge>
                        <h4 className="font-medium text-sm truncate">{competitor.name}</h4>
                      </div>
                      <p className="text-xs text-gray-600 truncate">{competitor.domain}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="text-center">
                        <p className="text-gray-500">DA</p>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getDAColor(competitor.da)}`}
                          data-testid={`da-score-${index}`}
                        >
                          {competitor.da}
                        </Badge>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-500">PA</p>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getPAColor(competitor.pa)}`}
                          data-testid={`pa-score-${index}`}
                        >
                          {competitor.pa}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3 text-xs mt-2 pt-2 border-t">
                    <div>
                      <p className="text-gray-500">Backlinks</p>
                      <p className="font-medium" data-testid={`backlinks-${index}`}>
                        {formatNumber(competitor.backlinks)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Keywords</p>
                      <p className="font-medium">{formatNumber(competitor.organicKeywords)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">URL</p>
                      <a 
                        href={competitor.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-xs font-medium truncate block"
                        title={competitor.url}
                      >
                        {competitor.domain}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Keyword Opportunities */}
          {results.summary.keywordGaps.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="h-4 w-4 text-green-600" />
                  Keyword Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1">
                  {results.summary.keywordGaps.slice(0, 10).map((keyword: string, index: number) => (
                    <Badge 
                      key={keyword} 
                      variant="secondary" 
                      className="text-xs text-green-700 bg-green-50 border-green-200"
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
  );
}