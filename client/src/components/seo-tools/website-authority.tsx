import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Loader2, 
  TrendingUp, 
  Globe, 
  AlertCircle,
  Award,
  Target
} from 'lucide-react';
import { getAuthHeaders } from '@/lib/auth';

interface WebsiteFormData {
  url: string;
}

interface WebsiteAuthorityResult {
  domain: string;
  url: string;
  domain_authority: number;
  page_authority: number;
  metadata: {
    title: string;
    description: string;
    keywords: string[];
    openGraph: Record<string, string>;
    twitterCard: Record<string, string>;
    canonicalUrl?: string;
    robots?: string;
    lang?: string;
  };
}

export default function WebsiteAuthority() {
  const [results, setResults] = useState<WebsiteAuthorityResult | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm<WebsiteFormData>({
    defaultValues: {
      url: '',
    },
  });

  const authorityMutation = useMutation({
    mutationFn: async (data: WebsiteFormData) => {
      const authHeaders = getAuthHeaders();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (authHeaders && typeof authHeaders === 'object') {
        Object.assign(headers, authHeaders);
      }
      
      const response = await fetch('/api/tools/website-authority', {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to analyze website authority');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setResults(data);
    },
  });

  const onSubmit = (data: WebsiteFormData) => {
    authorityMutation.mutate(data);
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600 dark:text-green-400';
    if (score >= 40) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 70) return 'Excellent';
    if (score >= 40) return 'Good';
    return 'Needs Improvement';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Website Authority (DA/PA) Analyzer
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Real-time analysis of Domain Authority and Page Authority using web scraping
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="url">Website URL</Label>
              <div className="flex gap-4">
                <Input
                  id="url"
                  placeholder="https://example.com"
                  className="flex-1"
                  {...register('url', { 
                    required: 'URL is required',
                    pattern: {
                      value: /^https?:\/\/.+/,
                      message: 'Please enter a valid URL'
                    }
                  })}
                  data-testid="input-website-url"
                />
                <Button
                  type="submit"
                  className="material-button-primary"
                  disabled={authorityMutation.isPending}
                  data-testid="button-analyze-authority"
                >
                  {authorityMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Target className="h-4 w-4 mr-2" />
                      Analyze Authority
                    </>
                  )}
                </Button>
              </div>
              {errors.url && (
                <p className="text-sm text-red-600 mt-1">{errors.url.message}</p>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Loading State */}
      {authorityMutation.isPending && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="loading-skeleton h-32 rounded" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="loading-skeleton h-24 rounded" />
                <div className="loading-skeleton h-24 rounded" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {authorityMutation.isError && (
        <Card className="border-red-200 dark:border-red-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertCircle className="h-4 w-4" />
              <p>Error: {authorityMutation.error?.message || 'Failed to analyze website authority'}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {results && (
        <div className="space-y-6">
          {/* Authority Scores */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Authority Scores
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {results.domain} • {results.url}
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Domain Authority */}
                <div className="space-y-3" data-testid="domain-authority-score">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Domain Authority (DA)</span>
                    <Badge variant="outline" className={getScoreColor(results.domain_authority)}>
                      {getScoreLabel(results.domain_authority)}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-2xl font-bold ${getScoreColor(results.domain_authority)}`}>
                        {results.domain_authority}/100
                      </span>
                    </div>
                    <Progress 
                      value={results.domain_authority} 
                      className="h-3"
                      data-testid="progress-domain-authority"
                    />
                  </div>
                </div>

                {/* Page Authority */}
                <div className="space-y-3" data-testid="page-authority-score">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Page Authority (PA)</span>
                    <Badge variant="outline" className={getScoreColor(results.page_authority)}>
                      {getScoreLabel(results.page_authority)}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-2xl font-bold ${getScoreColor(results.page_authority)}`}>
                        {results.page_authority}/100
                      </span>
                    </div>
                    <Progress 
                      value={results.page_authority} 
                      className="h-3"
                      data-testid="progress-page-authority"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Page Metadata */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Page Metadata
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {results.metadata.title && (
                <div>
                  <Label className="text-sm font-medium">Title</Label>
                  <p className="text-sm text-muted-foreground mt-1" data-testid="metadata-title">
                    {results.metadata.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Length: {results.metadata.title.length} characters
                  </p>
                </div>
              )}

              {results.metadata.description && (
                <div>
                  <Label className="text-sm font-medium">Description</Label>
                  <p className="text-sm text-muted-foreground mt-1" data-testid="metadata-description">
                    {results.metadata.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Length: {results.metadata.description.length} characters
                  </p>
                </div>
              )}

              {results.metadata.keywords && results.metadata.keywords.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">Keywords</Label>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {results.metadata.keywords.slice(0, 10).map((keyword, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                    {results.metadata.keywords.length > 10 && (
                      <Badge variant="outline" className="text-xs">
                        +{results.metadata.keywords.length - 10} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {results.metadata.canonicalUrl && (
                <div>
                  <Label className="text-sm font-medium">Canonical URL</Label>
                  <p className="text-sm text-muted-foreground mt-1 break-all">
                    {results.metadata.canonicalUrl}
                  </p>
                </div>
              )}

              {results.metadata.robots && (
                <div>
                  <Label className="text-sm font-medium">Robots Meta</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {results.metadata.robots}
                  </p>
                </div>
              )}

              {results.metadata.lang && (
                <div>
                  <Label className="text-sm font-medium">Language</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {results.metadata.lang}
                  </p>
                </div>
              )}

              {Object.keys(results.metadata.openGraph).length > 0 && (
                <div>
                  <Label className="text-sm font-medium">Open Graph ({Object.keys(results.metadata.openGraph).length} tags)</Label>
                  <div className="grid grid-cols-1 gap-2 mt-2">
                    {Object.entries(results.metadata.openGraph).slice(0, 5).map(([key, value]) => (
                      <div key={key} className="text-xs">
                        <span className="font-mono text-muted-foreground">{key}:</span>
                        <span className="ml-2">{value}</span>
                      </div>
                    ))}
                    {Object.keys(results.metadata.openGraph).length > 5 && (
                      <p className="text-xs text-muted-foreground">
                        +{Object.keys(results.metadata.openGraph).length - 5} more Open Graph tags
                      </p>
                    )}
                  </div>
                </div>
              )}

              {Object.keys(results.metadata.twitterCard).length > 0 && (
                <div>
                  <Label className="text-sm font-medium">Twitter Card ({Object.keys(results.metadata.twitterCard).length} tags)</Label>
                  <div className="grid grid-cols-1 gap-2 mt-2">
                    {Object.entries(results.metadata.twitterCard).slice(0, 5).map(([key, value]) => (
                      <div key={key} className="text-xs">
                        <span className="font-mono text-muted-foreground">{key}:</span>
                        <span className="ml-2">{value}</span>
                      </div>
                    ))}
                    {Object.keys(results.metadata.twitterCard).length > 5 && (
                      <p className="text-xs text-muted-foreground">
                        +{Object.keys(results.metadata.twitterCard).length - 5} more Twitter tags
                      </p>
                    )}
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