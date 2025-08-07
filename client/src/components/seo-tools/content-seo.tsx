import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, 
  Target, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle,
  BarChart3,
  Eye,
  Link,
  Hash
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ContentSEOAnalysis {
  score: number;
  issues: string[];
  recommendations: string[];
  metrics: {
    wordCount: number;
    keywordDensity: number;
    readabilityScore: number;
    headingStructure: { h1: number; h2: number; h3: number };
    internalLinks: number;
    externalLinks: number;
  };
}

export default function ContentSEOAnalyzer() {
  const [content, setContent] = useState("");
  const [targetKeyword, setTargetKeyword] = useState("");
  const [analysis, setAnalysis] = useState<ContentSEOAnalysis | null>(null);
  const { toast } = useToast();

  const analyzeMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/tools/content-seo", {
        content,
        targetKeyword
      });
      return response.json();
    },
    onSuccess: (data) => {
      setAnalysis(data);
      toast({
        title: "Content Analysis Complete",
        description: `SEO Score: ${data.score}/100`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze content",
        variant: "destructive",
      });
    },
  });

  const handleAnalyze = () => {
    if (!content.trim()) {
      toast({
        title: "Content Required",
        description: "Please enter content to analyze",
        variant: "destructive",
      });
      return;
    }
    if (!targetKeyword.trim()) {
      toast({
        title: "Target Keyword Required",
        description: "Please enter a target keyword",
        variant: "destructive",
      });
      return;
    }
    analyzeMutation.mutate();
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-50 border-green-200";
    if (score >= 60) return "bg-yellow-50 border-yellow-200";
    return "bg-red-50 border-red-200";
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <span>Content Input</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="target-keyword">Target Keyword</Label>
              <Input
                id="target-keyword"
                placeholder="e.g., SEO optimization"
                value={targetKeyword}
                onChange={(e) => setTargetKeyword(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="content">Content to Analyze</Label>
              <Textarea
                id="content"
                placeholder="Paste your blog post, article, or webpage content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="mt-1 min-h-[300px]"
              />
              <p className="text-sm text-gray-500 mt-1">
                Current word count: {content.split(/\s+/).filter(word => word.length > 0).length}
              </p>
            </div>
            
            <Button 
              onClick={handleAnalyze}
              disabled={analyzeMutation.isPending}
              className="w-full mint-button"
            >
              {analyzeMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Analyzing Content...
                </>
              ) : (
                <>
                  <Target className="mr-2 h-4 w-4" />
                  Analyze Content SEO
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {analysis && (
          <Card className={`${getScoreBgColor(analysis.score)} border-2`}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <span>SEO Score</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div className={`text-6xl font-bold ${getScoreColor(analysis.score)} mb-2`}>
                  {analysis.score}
                </div>
                <div className="text-gray-600">out of 100</div>
                <Progress value={analysis.score} className="mt-4" />
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Quick Stats</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span>Word Count:</span>
                      <span className="font-medium">{analysis.metrics.wordCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Keyword Density:</span>
                      <span className="font-medium">{analysis.metrics.keywordDensity}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Readability:</span>
                      <span className="font-medium">{analysis.metrics.readabilityScore}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Issues Found:</span>
                      <span className="font-medium text-red-600">{analysis.issues.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {analysis && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-red-700">
                <AlertCircle className="h-5 w-5" />
                <span>Issues Found ({analysis.issues.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analysis.issues.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                  <p>No critical issues found!</p>
                </div>
              ) : (
                <ul className="space-y-2">
                  {analysis.issues.map((issue, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-red-700">{issue}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-green-700">
                <CheckCircle className="h-5 w-5" />
                <span>Recommendations ({analysis.recommendations.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analysis.recommendations.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                  <p>Your content is well optimized!</p>
                </div>
              ) : (
                <ul className="space-y-2">
                  {analysis.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-green-700">{recommendation}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {analysis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <span>Detailed Metrics</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>Content Structure</span>
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Word Count:</span>
                    <Badge variant={analysis.metrics.wordCount >= 500 ? "default" : "destructive"}>
                      {analysis.metrics.wordCount}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>H1 Tags:</span>
                    <Badge variant={analysis.metrics.headingStructure.h1 === 1 ? "default" : "destructive"}>
                      {analysis.metrics.headingStructure.h1}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>H2 Tags:</span>
                    <Badge variant={analysis.metrics.headingStructure.h2 >= 2 ? "default" : "secondary"}>
                      {analysis.metrics.headingStructure.h2}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>H3 Tags:</span>
                    <Badge variant="secondary">
                      {analysis.metrics.headingStructure.h3}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold flex items-center space-x-2">
                  <Hash className="h-4 w-4" />
                  <span>Keyword Optimization</span>
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Keyword Density:</span>
                    <Badge variant={
                      analysis.metrics.keywordDensity >= 0.5 && analysis.metrics.keywordDensity <= 3 
                        ? "default" 
                        : "destructive"
                    }>
                      {analysis.metrics.keywordDensity}%
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Readability Score:</span>
                    <Badge variant={analysis.metrics.readabilityScore >= 60 ? "default" : "secondary"}>
                      {analysis.metrics.readabilityScore}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold flex items-center space-x-2">
                  <Link className="h-4 w-4" />
                  <span>Link Structure</span>
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Internal Links:</span>
                    <Badge variant={analysis.metrics.internalLinks >= 2 ? "default" : "secondary"}>
                      {analysis.metrics.internalLinks}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>External Links:</span>
                    <Badge variant="secondary">
                      {analysis.metrics.externalLinks}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}