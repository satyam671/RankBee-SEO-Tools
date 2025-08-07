import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";
import { getAuthHeaders } from "@/lib/auth";

interface KeywordDensityResult {
  density: Record<string, { count: number; density: number }>;
  wordCount: number;
}

interface KeywordFormData {
  url?: string;
  content?: string;
}

export default function KeywordDensity() {
  const [results, setResults] = useState<KeywordDensityResult | null>(null);
  const [activeTab, setActiveTab] = useState("url");
  const { register, handleSubmit, reset } = useForm<KeywordFormData>();

  const densityMutation = useMutation({
    mutationFn: async (data: KeywordFormData) => {
      const response = await fetch('/api/tools/keyword-density', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to analyze keyword density');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setResults(data);
    },
  });

  const onSubmit = (data: KeywordFormData) => {
    const submitData = activeTab === "url" 
      ? { url: data.url } 
      : { content: data.content };
    densityMutation.mutate(submitData);
  };

  const getDensityColor = (density: number) => {
    if (density > 3) return 'text-red-600';
    if (density > 1.5) return 'text-yellow-600';
    return 'text-green-600';
  };

  const topKeywords = results 
    ? Object.entries(results.density)
        .sort(([,a], [,b]) => b.density - a.density)
        .slice(0, 20)
    : [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Keyword Density Analyzer</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="url">Analyze URL</TabsTrigger>
              <TabsTrigger value="content">Analyze Text</TabsTrigger>
            </TabsList>
            
            <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
              <TabsContent value="url" className="space-y-4">
                <div>
                  <Label htmlFor="url">Page URL</Label>
                  <Input
                    id="url"
                    placeholder="https://example.com/page"
                    {...register('url')}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="content" className="space-y-4">
                <div>
                  <Label htmlFor="content">Content to Analyze</Label>
                  <Textarea
                    id="content"
                    placeholder="Paste your content here..."
                    rows={6}
                    {...register('content')}
                  />
                </div>
              </TabsContent>
              
              <div className="mt-4">
                <Button
                  type="submit"
                  className="material-button-primary"
                  disabled={densityMutation.isPending}
                >
                  {densityMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    'Analyze Content'
                  )}
                </Button>
              </div>
            </form>
          </Tabs>
        </CardContent>
      </Card>

      {/* Results */}
      {densityMutation.isPending ? (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="loading-skeleton h-16 rounded" />
              <div className="space-y-3">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="loading-skeleton h-12 rounded" />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : results ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Content Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {results.wordCount}
                  </div>
                  <div className="text-sm text-gray-600">Total Words</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {Object.keys(results.density).length}
                  </div>
                  <div className="text-sm text-gray-600">Unique Keywords</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {topKeywords.length > 0 ? topKeywords[0][1].density.toFixed(1) + '%' : '0%'}
                  </div>
                  <div className="text-sm text-gray-600">Top Density</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Keyword Density Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              {topKeywords.length > 0 ? (
                <div className="space-y-4">
                  {topKeywords.map(([keyword, data], index) => (
                    <div key={keyword} className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium">{keyword}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">
                              {data.count} times
                            </span>
                            <span className={`font-semibold ${getDensityColor(data.density)}`}>
                              {data.density.toFixed(2)}%
                            </span>
                          </div>
                        </div>
                        <Progress value={Math.min(data.density * 20, 100)} className="w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  No keywords found in the content
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Optimization Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span>0.5-2.5%: Optimal keyword density range</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                  <span>2.5-3.5%: Moderate density - consider reducing</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span>Above 3.5%: High density - likely keyword stuffing</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-gray-500 py-8">
              Enter a URL or paste content to analyze keyword density
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
