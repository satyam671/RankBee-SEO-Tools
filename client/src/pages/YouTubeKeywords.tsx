import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  TrendingUp, 
  Target, 
  DollarSign, 
  BarChart3, 
  Play, 
  Globe,
  Clock,
  Video,
  Users
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Header from "@/components/layout/header";

interface YouTubeKeywordData {
  keyword: string;
  volume: number;
  competition: number;
  cpc: number;
  trend: number;
  firstPositionUrl?: string;
  firstPositionTitle?: string;
  difficulty: number;
  clicks: number;
}

interface YouTubeKeywordsResult {
  keyword: string;
  country: string;
  platform: string;
  keywords: YouTubeKeywordData[];
  summary: {
    totalKeywords: number;
    averageVolume: number;
    averageCompetition: number;
    averageCPC: number;
    highVolumeKeywords: number;
    lowCompetitionKeywords: number;
    tutorialKeywords: number;
  };
  timestamp: string;
}

const formatNumber = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

const getVolumeColor = (volume: number): string => {
  if (volume >= 50000) return 'bg-green-100 text-green-800 border-green-200';
  if (volume >= 20000) return 'bg-blue-100 text-blue-800 border-blue-200';
  if (volume >= 5000) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  return 'bg-gray-100 text-gray-800 border-gray-200';
};

const getCompetitionColor = (competition: number): string => {
  if (competition >= 80) return 'bg-red-100 text-red-800 border-red-200';
  if (competition >= 60) return 'bg-orange-100 text-orange-800 border-orange-200';
  if (competition >= 40) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  return 'bg-green-100 text-green-800 border-green-200';
};

const getDifficultyColor = (difficulty: number): string => {
  if (difficulty >= 80) return 'bg-red-100 text-red-800 border-red-200';
  if (difficulty >= 60) return 'bg-orange-100 text-orange-800 border-orange-200';
  if (difficulty >= 40) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  return 'bg-green-100 text-green-800 border-green-200';
};

const countries = [
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'it', label: 'Italy' },
  { value: 'es', label: 'Spain' },
  { value: 'jp', label: 'Japan' },
  { value: 'au', label: 'Australia' },
  { value: 'in', label: 'India' },
  { value: 'br', label: 'Brazil' },
  { value: 'mx', label: 'Mexico' }
];

export default function YouTubeKeywords() {
  const [keyword, setKeyword] = useState("");
  const [country, setCountry] = useState("us");
  const [results, setResults] = useState<YouTubeKeywordsResult | null>(null);

  const analyzeKeywords = useMutation({
    mutationFn: async (data: { keyword: string; country: string }) => {
      const response = await apiRequest("POST", "/api/tools/youtube-keywords", data);
      return response.json() as Promise<YouTubeKeywordsResult>;
    },
    onSuccess: (data: YouTubeKeywordsResult) => {
      setResults(data);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedKeyword = keyword.trim();
    if (!trimmedKeyword) return;
    
    setResults(null);
    analyzeKeywords.mutate({ keyword: trimmedKeyword, country });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            YouTube Keyword Research Tool
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Discover trending YouTube keywords with real-time data. Find high-traffic, 
            low-competition keywords to optimize your video content and grow your channel.
          </p>
        </div>

        {/* Input Form */}
        <Card className="max-w-2xl mx-auto mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5 text-red-600" />
              Research YouTube Keywords
            </CardTitle>
            <CardDescription>
              Enter a keyword and select a country to discover related YouTube search terms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Enter keyword (e.g., cooking tutorial)"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="flex-1"
                  required
                />
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button 
                type="submit" 
                disabled={analyzeKeywords.isPending}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                {analyzeKeywords.isPending ? "Analyzing..." : "Research Keywords"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Loading State */}
        {analyzeKeywords.isPending && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-72" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-20" />
                  ))}
                </div>
              </CardContent>
            </Card>
            <div className="space-y-4">
              {[...Array(10)].map((_, i) => (
                <Skeleton key={i} className="h-20" />
              ))}
            </div>
          </div>
        )}

        {/* Error State */}
        {analyzeKeywords.isError && (
          <Alert variant="destructive" className="max-w-2xl mx-auto">
            <AlertDescription>
              {analyzeKeywords.error?.message || "Failed to analyze YouTube keywords. Please try again."}
            </AlertDescription>
          </Alert>
        )}

        {/* Results */}
        {results && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <Search className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Total Keywords
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {results.summary.totalKeywords}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Avg Volume
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {formatNumber(results.summary.averageVolume)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Low Competition
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {results.summary.lowCompetitionKeywords}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-purple-600" />
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
                    <TrendingUp className="h-5 w-5 text-indigo-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        High Volume
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {results.summary.highVolumeKeywords}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <Video className="h-5 w-5 text-orange-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Tutorial Keywords
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {results.summary.tutorialKeywords}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Keywords List */}
            <Card>
              <CardHeader>
                <CardTitle>YouTube Keywords for "{results.keyword}"</CardTitle>
                <CardDescription>
                  {results.keywords.length} keywords found • Country: {countries.find(c => c.value === results.country)?.label}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {results.keywords.map((keywordData, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                            {keywordData.keyword}
                          </h3>
                          {keywordData.firstPositionTitle && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              Top video: {keywordData.firstPositionTitle}
                            </p>
                          )}
                          {keywordData.firstPositionUrl && (
                            <a 
                              href={keywordData.firstPositionUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:underline"
                            >
                              View on YouTube →
                            </a>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div className="space-y-1">
                          <p className="text-xs text-gray-500 dark:text-gray-400">Monthly Volume</p>
                          <Badge variant="outline" className={getVolumeColor(keywordData.volume)}>
                            {formatNumber(keywordData.volume)}
                          </Badge>
                        </div>
                        
                        <div className="space-y-1">
                          <p className="text-xs text-gray-500 dark:text-gray-400">Competition</p>
                          <Badge variant="outline" className={getCompetitionColor(keywordData.competition)}>
                            {keywordData.competition}%
                          </Badge>
                        </div>
                        
                        <div className="space-y-1">
                          <p className="text-xs text-gray-500 dark:text-gray-400">Difficulty</p>
                          <Badge variant="outline" className={getDifficultyColor(keywordData.difficulty)}>
                            {keywordData.difficulty}%
                          </Badge>
                        </div>
                        
                        <div className="space-y-1">
                          <p className="text-xs text-gray-500 dark:text-gray-400">CPC</p>
                          <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
                            ${keywordData.cpc.toFixed(2)}
                          </Badge>
                        </div>
                        
                        <div className="space-y-1">
                          <p className="text-xs text-gray-500 dark:text-gray-400">Est. Clicks</p>
                          <Badge variant="outline" className="bg-indigo-100 text-indigo-800 border-indigo-200">
                            {formatNumber(keywordData.clicks)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}