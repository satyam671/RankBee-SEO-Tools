import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, ExternalLink, Target, Link2, AlertCircle } from "lucide-react";
import { getAuthHeaders } from "@/lib/auth";

interface LinkDetail {
  url: string;
  type: 'internal' | 'external';
  rel: string[];
  anchorText: string;
}

interface BacklinkResult {
  totalLinks: number;
  internalLinks: LinkDetail[];
  externalLinks: LinkDetail[];
  domain: string;
  url: string;
}

interface BacklinkFormData {
  domain: string;
}

export default function BacklinkAnalyzer() {
  const [results, setResults] = useState<BacklinkResult | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm<BacklinkFormData>({
    defaultValues: {
      domain: '',
    },
  });

  const backlinkMutation = useMutation({
    mutationFn: async (data: BacklinkFormData) => {
      const response = await fetch('/api/tools/backlink-analyzer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to analyze backlinks');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setResults(data);
    },
  });

  const onSubmit = (data: BacklinkFormData) => {
    backlinkMutation.mutate(data);
  };

  const getLinkTypeColor = (type: 'internal' | 'external') => {
    return type === 'internal' 
      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
  };

  const isDofollow = (rel: string[]) => {
    return !rel.includes('nofollow');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            Backlink Analyzer
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Real-time analysis of internal and external links by scraping the webpage
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="domain">Website URL to Analyze</Label>
              <div className="flex gap-4">
                <Input
                  id="domain"
                  placeholder="https://example.com"
                  className="flex-1"
                  {...register('domain', { 
                    required: 'URL is required',
                    pattern: {
                      value: /^https?:\/\/.+/,
                      message: 'Please enter a valid URL'
                    }
                  })}
                />
                <Button
                  type="submit"
                  className="material-button-primary"
                  disabled={backlinkMutation.isPending}
                >
                  {backlinkMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Target className="h-4 w-4 mr-2" />
                      Analyze Links
                    </>
                  )}
                </Button>
              </div>
              {errors.domain && (
                <p className="text-sm text-red-600 mt-1">{errors.domain.message}</p>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Loading State */}
      {backlinkMutation.isPending && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="loading-skeleton h-16 rounded" />
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="loading-skeleton h-12 rounded" />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {backlinkMutation.isError && (
        <Card className="border-red-200 dark:border-red-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertCircle className="h-4 w-4" />
              <p>Error: {backlinkMutation.error?.message || 'Failed to analyze backlinks'}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {results && (
        <div className="space-y-6">
          {/* Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Link Overview</CardTitle>
              <p className="text-sm text-muted-foreground">
                {results.domain} • {results.url}
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {results.totalLinks.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Links</div>
                </div>
                
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {results.internalLinks.length.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Internal Links</div>
                </div>
                
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {results.externalLinks.length.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">External Links</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Internal Links */}
          {results.internalLinks.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Internal Links ({results.internalLinks.length})</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Links pointing to pages within the same domain
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {results.internalLinks.slice(0, 20).map((link, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-2">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getLinkTypeColor(link.type)}>
                              {link.type}
                            </Badge>
                            {isDofollow(link.rel) ? (
                              <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                Dofollow
                              </Badge>
                            ) : (
                              <Badge variant="secondary">
                                Nofollow
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm font-medium break-all">{link.url}</p>
                          {link.anchorText && (
                            <p className="text-sm text-muted-foreground mt-1">
                              "{link.anchorText}"
                            </p>
                          )}
                          {link.rel.length > 0 && (
                            <p className="text-xs text-muted-foreground mt-1">
                              rel: {link.rel.join(', ')}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(link.url, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {results.internalLinks.length > 20 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Showing first 20 of {results.internalLinks.length} internal links
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* External Links */}
          {results.externalLinks.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>External Links ({results.externalLinks.length})</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Links pointing to external domains
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {results.externalLinks.slice(0, 20).map((link, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-2">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getLinkTypeColor(link.type)}>
                              {link.type}
                            </Badge>
                            {isDofollow(link.rel) ? (
                              <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                Dofollow
                              </Badge>
                            ) : (
                              <Badge variant="secondary">
                                Nofollow
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm font-medium break-all">{link.url}</p>
                          {link.anchorText && (
                            <p className="text-sm text-muted-foreground mt-1">
                              "{link.anchorText}"
                            </p>
                          )}
                          {link.rel.length > 0 && (
                            <p className="text-xs text-muted-foreground mt-1">
                              rel: {link.rel.join(', ')}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(link.url, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {results.externalLinks.length > 20 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Showing first 20 of {results.externalLinks.length} external links
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* No Links Found */}
          {results.totalLinks === 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center text-muted-foreground">
                  <Link2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No links found on this page.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}