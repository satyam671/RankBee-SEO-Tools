import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Target, TrendingUp, ExternalLink, Search, AlertCircle } from "lucide-react";
import { getAuthHeaders } from "@/lib/auth";

interface RankResult {
  keyword: string;
  domain: string;
  searchEngine: string;
  position: number | null;
  top3: boolean;
  top10: boolean;
  top20: boolean;
  firstPage: boolean;
  visibility: 'easy' | 'medium' | 'hard';
  matchedUrl?: string;
  totalResults: number;
  searchUrl: string;
}

interface RankFormData {
  domain: string;
  keyword: string;
  searchEngine: string;
}

export default function RankTracker() {
  const [results, setResults] = useState<RankResult | null>(null);
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<RankFormData>({
    defaultValues: {
      domain: '',
      keyword: '',
      searchEngine: 'google',
    },
  });

  const rankMutation = useMutation({
    mutationFn: async (data: RankFormData) => {
      const authHeaders = getAuthHeaders();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (authHeaders && typeof authHeaders === 'object') {
        Object.assign(headers, authHeaders);
      }
      
      const response = await fetch('/api/tools/rank-tracker', {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to track keyword ranking');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setResults(data);
    },
  });

  const onSubmit = (data: RankFormData) => {
    rankMutation.mutate(data);
  };

  const getPositionColor = (position: number | null) => {
    if (!position) return 'text-gray-500 dark:text-gray-400';
    if (position <= 3) return 'text-green-600 dark:text-green-400';
    if (position <= 10) return 'text-blue-600 dark:text-blue-400';
    if (position <= 20) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getPositionBadge = (position: number | null) => {
    if (!position) return { text: 'Not Found', color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300' };
    if (position <= 3) return { text: `#${position} - Top 3`, color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' };
    if (position <= 10) return { text: `#${position} - First Page`, color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' };
    if (position <= 20) return { text: `#${position} - Top 20`, color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' };
    return { text: `#${position}`, color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' };
  };

  const getVisibilityBadge = (visibility: 'easy' | 'medium' | 'hard') => {
    switch (visibility) {
      case 'easy':
        return { text: 'Easy to Rank', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' };
      case 'medium':
        return { text: 'Medium Competition', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' };
      case 'hard':
        return { text: 'High Competition', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' };
      default:
        return { text: 'Unknown', color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300' };
    }
  };

  const watchedSearchEngine = watch('searchEngine');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Keyword Rank Tracker
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Real-time keyword ranking by scraping search engine results
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="domain">Domain to Track</Label>
                <Input
                  id="domain"
                  placeholder="example.com or https://example.com"
                  {...register('domain', { 
                    required: 'Domain is required',
                    pattern: {
                      value: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
                      message: 'Please enter a valid domain'
                    }
                  })}
                />
                {errors.domain && (
                  <p className="text-sm text-red-600 mt-1">{errors.domain.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="keyword">Target Keyword</Label>
                <Input
                  id="keyword"
                  placeholder="SEO tools"
                  {...register('keyword', { 
                    required: 'Keyword is required',
                    minLength: {
                      value: 2,
                      message: 'Keyword must be at least 2 characters'
                    }
                  })}
                />
                {errors.keyword && (
                  <p className="text-sm text-red-600 mt-1">{errors.keyword.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="searchEngine">Search Engine</Label>
              <Select value={watchedSearchEngine} onValueChange={(value) => setValue('searchEngine', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select search engine" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="google">Google</SelectItem>
                  <SelectItem value="bing">Bing</SelectItem>
                  <SelectItem value="yahoo">Yahoo</SelectItem>
                  <SelectItem value="duckduckgo">DuckDuckGo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              className="material-button-primary w-full"
              disabled={rankMutation.isPending}
            >
              {rankMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Tracking Rankings...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Track Keyword Ranking
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Loading State */}
      {rankMutation.isPending && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="loading-skeleton h-20 rounded" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="loading-skeleton h-16 rounded" />
                <div className="loading-skeleton h-16 rounded" />
                <div className="loading-skeleton h-16 rounded" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {rankMutation.isError && (
        <Card className="border-orange-200 dark:border-orange-800">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                <AlertCircle className="h-4 w-4" />
                <p className="font-medium">Search Engine Protection Detected</p>
              </div>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>Search engines like Google, Bing, and others use bot protection to prevent automated scraping. This is normal security behavior.</p>
                <p><strong>For production rank tracking, consider:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Google Search Console (free, official)</li>
                  <li>Bing Webmaster Tools (free, official)</li>
                  <li>SEMrush or Ahrefs (paid services with API access)</li>
                  <li>Manual rank checking in incognito mode</li>
                </ul>
              </div>
              <div className="text-xs text-muted-foreground border-t pt-2">
                Technical details: {rankMutation.error?.message}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {results && (
        <div className="space-y-6">
          {/* Main Result */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Ranking Results
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {results.domain} • "{results.keyword}" • {results.searchEngine}
              </p>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                {/* Position Display */}
                <div className="space-y-2">
                  {results.position ? (
                    <>
                      <div className={`text-4xl font-bold ${getPositionColor(results.position)}`}>
                        #{results.position}
                      </div>
                      <Badge className={getPositionBadge(results.position).color}>
                        {getPositionBadge(results.position).text}
                      </Badge>
                    </>
                  ) : (
                    <>
                      <div className="text-4xl font-bold text-gray-500 dark:text-gray-400">
                        Not Found
                      </div>
                      <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                        Not in Top {results.totalResults} Results
                      </Badge>
                    </>
                  )}
                </div>

                {/* Matched URL */}
                {results.matchedUrl && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Ranking URL</Label>
                    <div className="flex items-center justify-center gap-2">
                      <p className="text-sm text-muted-foreground break-all">
                        {results.matchedUrl}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(results.matchedUrl, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Ranking Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Ranking Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center space-y-2">
                  <div className={`text-lg font-semibold ${results.top3 ? 'text-green-600' : 'text-gray-500'}`}>
                    {results.top3 ? '✓' : '✗'}
                  </div>
                  <div className="text-sm text-muted-foreground">Top 3</div>
                </div>

                <div className="text-center space-y-2">
                  <div className={`text-lg font-semibold ${results.top10 ? 'text-blue-600' : 'text-gray-500'}`}>
                    {results.top10 ? '✓' : '✗'}
                  </div>
                  <div className="text-sm text-muted-foreground">First Page</div>
                </div>

                <div className="text-center space-y-2">
                  <div className={`text-lg font-semibold ${results.top20 ? 'text-yellow-600' : 'text-gray-500'}`}>
                    {results.top20 ? '✓' : '✗'}
                  </div>
                  <div className="text-sm text-muted-foreground">Top 20</div>
                </div>

                <div className="text-center space-y-2">
                  <Badge className={getVisibilityBadge(results.visibility).color}>
                    {getVisibilityBadge(results.visibility).text}
                  </Badge>
                  <div className="text-sm text-muted-foreground">Competition</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Search Details */}
          <Card>
            <CardHeader>
              <CardTitle>Search Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Total Results Analyzed</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {results.totalResults.toLocaleString()} search results
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-medium">Search Engine</Label>
                  <p className="text-sm text-muted-foreground mt-1 capitalize">
                    {results.searchEngine}
                  </p>
                </div>
              </div>

              {results.searchUrl && (
                <div>
                  <Label className="text-sm font-medium">Search URL</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm text-muted-foreground break-all flex-1">
                      {results.searchUrl}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(results.searchUrl, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}