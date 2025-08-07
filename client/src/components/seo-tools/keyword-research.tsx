import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Download, Save, Target } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { getAuthHeaders } from "@/lib/auth";

interface KeywordSuggestion {
  keyword: string;
  searchVolume: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  cpc: number;
  competition: number;
}

interface KeywordFormData {
  keyword: string;
  location: string;
  language: string;
}

const difficultyColors = {
  Easy: 'bg-green-100 text-green-800',
  Medium: 'bg-yellow-100 text-yellow-800',
  Hard: 'bg-red-100 text-red-800',
};

export default function KeywordResearch() {
  const [results, setResults] = useState<KeywordSuggestion[]>([]);
  const { register, handleSubmit, setValue, watch } = useForm<KeywordFormData>({
    defaultValues: {
      keyword: '',
      location: 'United States',
      language: 'English',
    },
  });

  const keywordMutation = useMutation({
    mutationFn: async (data: KeywordFormData) => {
      const response = await fetch('/api/tools/keyword-research', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate keywords');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setResults(data.suggestions);
    },
  });

  const onSubmit = (data: KeywordFormData) => {
    keywordMutation.mutate(data);
  };

  const exportToCsv = () => {
    const csvContent = [
      ['Keyword', 'Search Volume', 'Difficulty', 'CPC', 'Competition'],
      ...results.map(r => [r.keyword, r.searchVolume, r.difficulty, r.cpc, r.competition])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'keyword-research.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Input Section */}
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Search Parameters</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="keyword">Seed Keyword</Label>
                <Input
                  id="keyword"
                  placeholder="e.g., digital marketing"
                  {...register('keyword', { required: true })}
                />
              </div>
              
              <div>
                <Label htmlFor="location">Location</Label>
                <Select onValueChange={(value) => setValue('location', value)} defaultValue="United States">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 overflow-y-auto">
                    <SelectItem value="United States">United States</SelectItem>
                    <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                    <SelectItem value="Canada">Canada</SelectItem>
                    <SelectItem value="Australia">Australia</SelectItem>
                    <SelectItem value="Germany">Germany</SelectItem>
                    <SelectItem value="France">France</SelectItem>
                    <SelectItem value="Spain">Spain</SelectItem>
                    <SelectItem value="Italy">Italy</SelectItem>
                    <SelectItem value="Brazil">Brazil</SelectItem>
                    <SelectItem value="Japan">Japan</SelectItem>
                    <SelectItem value="India">India</SelectItem>
                    <SelectItem value="Mexico">Mexico</SelectItem>
                    <SelectItem value="Netherlands">Netherlands</SelectItem>
                    <SelectItem value="Sweden">Sweden</SelectItem>
                    <SelectItem value="Norway">Norway</SelectItem>
                    <SelectItem value="Denmark">Denmark</SelectItem>
                    <SelectItem value="Finland">Finland</SelectItem>
                    <SelectItem value="Poland">Poland</SelectItem>
                    <SelectItem value="Russia">Russia</SelectItem>
                    <SelectItem value="China">China</SelectItem>
                    <SelectItem value="South Korea">South Korea</SelectItem>
                    <SelectItem value="Singapore">Singapore</SelectItem>
                    <SelectItem value="Malaysia">Malaysia</SelectItem>
                    <SelectItem value="Thailand">Thailand</SelectItem>
                    <SelectItem value="Indonesia">Indonesia</SelectItem>
                    <SelectItem value="Philippines">Philippines</SelectItem>
                    <SelectItem value="Vietnam">Vietnam</SelectItem>
                    <SelectItem value="Turkey">Turkey</SelectItem>
                    <SelectItem value="South Africa">South Africa</SelectItem>
                    <SelectItem value="UAE">UAE</SelectItem>
                    <SelectItem value="Saudi Arabia">Saudi Arabia</SelectItem>
                    <SelectItem value="Israel">Israel</SelectItem>
                    <SelectItem value="Egypt">Egypt</SelectItem>
                    <SelectItem value="Nigeria">Nigeria</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="language">Language</Label>
                <Select onValueChange={(value) => setValue('language', value)} defaultValue="English">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 overflow-y-auto">
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Spanish">Spanish</SelectItem>
                    <SelectItem value="French">French</SelectItem>
                    <SelectItem value="German">German</SelectItem>
                    <SelectItem value="Italian">Italian</SelectItem>
                    <SelectItem value="Portuguese">Portuguese</SelectItem>
                    <SelectItem value="Russian">Russian</SelectItem>
                    <SelectItem value="Japanese">Japanese</SelectItem>
                    <SelectItem value="Korean">Korean</SelectItem>
                    <SelectItem value="Chinese">Chinese</SelectItem>
                    <SelectItem value="Arabic">Arabic</SelectItem>
                    <SelectItem value="Hindi">Hindi</SelectItem>
                    <SelectItem value="Dutch">Dutch</SelectItem>
                    <SelectItem value="Swedish">Swedish</SelectItem>
                    <SelectItem value="Norwegian">Norwegian</SelectItem>
                    <SelectItem value="Danish">Danish</SelectItem>
                    <SelectItem value="Finnish">Finnish</SelectItem>
                    <SelectItem value="Polish">Polish</SelectItem>
                    <SelectItem value="Turkish">Turkish</SelectItem>
                    <SelectItem value="Thai">Thai</SelectItem>
                    <SelectItem value="Vietnamese">Vietnamese</SelectItem>
                    <SelectItem value="Indonesian">Indonesian</SelectItem>
                    <SelectItem value="Malay">Malay</SelectItem>
                    <SelectItem value="Hebrew">Hebrew</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button
                type="submit"
                className="w-full material-button-primary"
                disabled={keywordMutation.isPending}
              >
                {keywordMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Keywords'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        {/* Pro Tip for Keyword Research */}
        <Card className="mt-4 bg-green-50 border-green-200">
          <CardContent className="pt-4">
            <div className="flex items-start space-x-3">
              <div className="bg-green-100 rounded-lg p-2">
                <Target className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-green-800 text-sm mb-1">Pro Tip:</h4>
                <p className="text-sm text-green-700">
                  Start with broad keywords and use location targeting for better results. Focus on long-tail keywords with lower competition for quicker wins.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results Section */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Keyword Suggestions</CardTitle>
              {results.length > 0 && (
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={exportToCsv}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                  <Button variant="outline" size="sm">
                    <Save className="h-4 w-4 mr-2" />
                    Save List
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {keywordMutation.isPending ? (
              <div className="space-y-3">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="loading-skeleton h-16 rounded" />
                ))}
              </div>
            ) : results.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 font-medium">Keyword</th>
                      <th className="text-left py-3 font-medium">Volume</th>
                      <th className="text-left py-3 font-medium">Difficulty</th>
                      <th className="text-left py-3 font-medium">CPC</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {results.map((result, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="py-3 font-medium">{result.keyword}</td>
                        <td className="py-3">{result.searchVolume.toLocaleString()}</td>
                        <td className="py-3">
                          <Badge className={difficultyColors[result.difficulty]}>
                            {result.difficulty}
                          </Badge>
                        </td>
                        <td className="py-3">${result.cpc.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                Enter a seed keyword and click "Generate Keywords" to see suggestions
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
