import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ExternalLink, 
  Link as LinkIcon, 
  Globe, 
  Calendar, 
  BarChart3, 
  TrendingUp,
  Target,
  Shield,
  Clock,
  Users
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import type { ReferrerData } from "@shared/schema";

interface TopReferrersResult {
  url: string;
  referrers: ReferrerData[];
  summary: {
    totalReferrers: number;
    averageDA: number;
    totalBacklinks: number;
    highAuthorityDomains: number;
    dofollowLinks: number;
    nofollowLinks: number;
    uniqueDomains: number;
  };
  timestamp: string;
}

const formatNumber = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

const formatDate = (date: Date | null): string => {
  if (!date) return 'Unknown';
  return new Intl.DateTimeFormat('en-US', { 
    year: 'numeric', 
    month: 'short' 
  }).format(new Date(date));
};

const getDomainAuthorityColor = (da: number): string => {
  if (da >= 80) return 'bg-green-100 text-green-800 border-green-200';
  if (da >= 60) return 'bg-blue-100 text-blue-800 border-blue-200';
  if (da >= 40) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  if (da >= 20) return 'bg-orange-100 text-orange-800 border-orange-200';
  return 'bg-red-100 text-red-800 border-red-200';
};

const getLinkTypeColor = (linkType: string): string => {
  return linkType === 'dofollow' 
    ? 'bg-green-100 text-green-800 border-green-200'
    : 'bg-gray-100 text-gray-800 border-gray-200';
};

export default function TopReferrers() {
  const [url, setUrl] = useState("");
  const [results, setResults] = useState<TopReferrersResult | null>(null);

  const analyzeReferrers = useMutation({
    mutationFn: async (data: { url: string }) => {
      const response = await apiRequest("POST", "/api/tools/top-referrers", data);
      return response.json() as Promise<TopReferrersResult>;
    },
    onSuccess: (data: TopReferrersResult) => {
      setResults(data);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedUrl = url.trim();
    if (!trimmedUrl) return;
    
    // Basic URL validation
    try {
      // Add protocol if missing
      let validatedUrl = trimmedUrl;
      if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
        validatedUrl = 'https://' + trimmedUrl;
      }
      
      // Validate URL format
      new URL(validatedUrl);
      
      setResults(null);
      analyzeReferrers.mutate({ url: validatedUrl });
    } catch (error) {
      // URL is invalid, but let the server handle it
      setResults(null);
      analyzeReferrers.mutate({ url: trimmedUrl });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Top Referrers Analysis
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Discover which websites are linking to your domain with comprehensive referrer analysis, 
            including domain authority, backlink counts, and link quality metrics.
          </p>
        </div>

        {/* Input Form */}
        <Card className="max-w-2xl mx-auto mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5 text-indigo-600" />
              Analyze Website Referrers
            </CardTitle>
            <CardDescription>
              Enter a website URL to discover its top referring domains and backlink profile
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex-1"
                  required
                />
                <Button 
                  type="submit" 
                  disabled={analyzeReferrers.isPending}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  {analyzeReferrers.isPending ? "Analyzing..." : "Analyze"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Loading State */}
        {analyzeReferrers.isPending && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-72" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-20" />
                  ))}
                </div>
              </CardContent>
            </Card>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
          </div>
        )}

        {/* Error State */}
        {analyzeReferrers.isError && (
          <Alert variant="destructive" className="max-w-2xl mx-auto">
            <AlertDescription>
              {analyzeReferrers.error?.message || "Failed to analyze referrers. Please check the URL and try again."}
            </AlertDescription>
          </Alert>
        )}

        {/* Results */}
        {results && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <ExternalLink className="h-5 w-5 text-indigo-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Total Referrers
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {results.summary.totalReferrers}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-600" />
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
                    <LinkIcon className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Total Backlinks
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {formatNumber(results.summary.totalBacklinks)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        High Authority
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {results.summary.highAuthorityDomains}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Referrers List */}
            <Card>
              <CardHeader>
                <CardTitle>Top Referrers ({results.referrers.length})</CardTitle>
                <CardDescription>
                  Comprehensive list of websites linking to your domain with detailed metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {results.referrers.map((referrer, index) => (
                    <div key={`${referrer.domain}-${index}`} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge variant="secondary" className="text-xs">
                              #{index + 1}
                            </Badge>
                            <h3 className="font-semibold text-lg text-gray-900 dark:text-white truncate">
                              {referrer.domain}
                            </h3>
                            <Badge 
                              variant="outline" 
                              className={`${getDomainAuthorityColor(referrer.domainAuthority)} text-sm px-3 py-1`}
                            >
                              DA {referrer.domainAuthority}
                            </Badge>
                          </div>
                          
                          {referrer.pageTitle && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                              {referrer.pageTitle}
                            </p>
                          )}
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500 dark:text-gray-400">Backlinks</p>
                              <p className="font-medium text-lg">{formatNumber(referrer.backlinks)}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 dark:text-gray-400">Link Type</p>
                              <Badge 
                                variant="outline" 
                                className={`${getLinkTypeColor(referrer.linkType)} text-sm`}
                              >
                                {referrer.linkType}
                              </Badge>
                            </div>
                            <div>
                              <p className="text-gray-500 dark:text-gray-400">First Seen</p>
                              <p className="font-medium flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(referrer.firstSeenDate)}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500 dark:text-gray-400">Visit Site</p>
                              <a 
                                href={referrer.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-medium"
                              >
                                <ExternalLink className="h-3 w-3" />
                                Open
                              </a>
                            </div>
                          </div>
                          
                          {referrer.anchorText && (
                            <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                              <p className="text-xs text-gray-500 dark:text-gray-400">Anchor Text:</p>
                              <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                                "{referrer.anchorText}"
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Analytics Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Link Quality Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Dofollow Links
                      </span>
                      <Badge variant="secondary">
                        {results.summary.dofollowLinks}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Nofollow Links
                      </span>
                      <Badge variant="secondary">
                        {results.summary.nofollowLinks}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        High Authority Domains (DA 70+)
                      </span>
                      <Badge variant="secondary">
                        {results.summary.highAuthorityDomains}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Unique Referring Domains
                      </span>
                      <Badge variant="secondary">
                        {results.summary.uniqueDomains}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Authority Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Excellent Authority (DA 80+)
                      </span>
                      <Badge variant="secondary">
                        {results.referrers.filter(r => r.domainAuthority >= 80).length}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Good Authority (DA 60-79)
                      </span>
                      <Badge variant="secondary">
                        {results.referrers.filter(r => r.domainAuthority >= 60 && r.domainAuthority < 80).length}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Medium Authority (DA 40-59)
                      </span>
                      <Badge variant="secondary">
                        {results.referrers.filter(r => r.domainAuthority >= 40 && r.domainAuthority < 60).length}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Low Authority (DA 1-39)
                      </span>
                      <Badge variant="secondary">
                        {results.referrers.filter(r => r.domainAuthority < 40).length}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}