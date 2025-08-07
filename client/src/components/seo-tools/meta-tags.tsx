import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Copy, CheckCircle, XCircle } from "lucide-react";
import { getAuthHeaders } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

interface MetaTagsResult {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonical?: string;
  robots?: string;
}

interface MetaFormData {
  url: string;
}

export default function MetaTags() {
  const [results, setResults] = useState<MetaTagsResult | null>(null);
  const { toast } = useToast();
  const { register, handleSubmit } = useForm<MetaFormData>({
    defaultValues: {
      url: '',
    },
  });

  const metaMutation = useMutation({
    mutationFn: async (data: MetaFormData) => {
      const response = await fetch('/api/tools/meta-tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to extract meta tags');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setResults(data);
    },
  });

  const onSubmit = (data: MetaFormData) => {
    metaMutation.mutate(data);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Text copied to clipboard",
    });
  };

  const getOptimizationStatus = (tag: string, value?: string) => {
    if (!value) return { status: 'missing', message: 'Missing' };
    
    switch (tag) {
      case 'title':
        if (value.length < 30) return { status: 'warning', message: 'Too short' };
        if (value.length > 60) return { status: 'warning', message: 'Too long' };
        return { status: 'good', message: 'Good length' };
      
      case 'description':
        if (value.length < 120) return { status: 'warning', message: 'Too short' };
        if (value.length > 160) return { status: 'warning', message: 'Too long' };
        return { status: 'good', message: 'Good length' };
      
      default:
        return { status: 'good', message: 'Present' };
    }
  };

  const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
      case 'good':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <XCircle className="h-4 w-4 text-yellow-500" />;
      case 'missing':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Meta Tags Extractor</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="url">Page URL</Label>
              <div className="flex gap-4">
                <Input
                  id="url"
                  placeholder="https://example.com"
                  className="flex-1"
                  {...register('url', { required: true })}
                />
                <Button
                  type="submit"
                  className="material-button-primary"
                  disabled={metaMutation.isPending}
                >
                  {metaMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Extracting...
                    </>
                  ) : (
                    'Extract Meta Tags'
                  )}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Results */}
      {metaMutation.isPending ? (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="loading-skeleton h-16 rounded" />
              ))}
            </div>
          </CardContent>
        </Card>
      ) : results ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Meta Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Title */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center space-x-2">
                    <Label className="font-medium">Title Tag</Label>
                    <StatusIcon status={getOptimizationStatus('title', results.title).status} />
                    <Badge variant="outline" className="text-xs">
                      {getOptimizationStatus('title', results.title).message}
                    </Badge>
                  </div>
                  {results.title && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(results.title!)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                  {results.title || 'No title tag found'}
                </p>
                {results.title && (
                  <p className="text-xs text-gray-500 mt-1">
                    Length: {results.title.length} characters
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center space-x-2">
                    <Label className="font-medium">Meta Description</Label>
                    <StatusIcon status={getOptimizationStatus('description', results.description).status} />
                    <Badge variant="outline" className="text-xs">
                      {getOptimizationStatus('description', results.description).message}
                    </Badge>
                  </div>
                  {results.description && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(results.description!)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                  {results.description || 'No meta description found'}
                </p>
                {results.description && (
                  <p className="text-xs text-gray-500 mt-1">
                    Length: {results.description.length} characters
                  </p>
                )}
              </div>

              {/* Keywords */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <Label className="font-medium">Meta Keywords</Label>
                  {results.keywords && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(results.keywords!)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                  {results.keywords || 'No meta keywords found'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Open Graph Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* OG Title */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <Label className="font-medium">OG Title</Label>
                  {results.ogTitle && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(results.ogTitle!)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                  {results.ogTitle || 'No OG title found'}
                </p>
              </div>

              {/* OG Description */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <Label className="font-medium">OG Description</Label>
                  {results.ogDescription && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(results.ogDescription!)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                  {results.ogDescription || 'No OG description found'}
                </p>
              </div>

              {/* OG Image */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <Label className="font-medium">OG Image</Label>
                  {results.ogImage && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(results.ogImage!)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                  {results.ogImage || 'No OG image found'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Technical Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Canonical */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <Label className="font-medium">Canonical URL</Label>
                  {results.canonical && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(results.canonical!)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                  {results.canonical || 'No canonical URL found'}
                </p>
              </div>

              {/* Robots */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <Label className="font-medium">Robots Meta</Label>
                  {results.robots && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(results.robots!)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                  {results.robots || 'No robots meta found'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-gray-500 py-8">
              Enter a URL to extract and analyze meta tags
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
