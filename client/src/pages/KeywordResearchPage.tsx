import { useAuth } from "@/lib/auth";
import { useEffect } from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import SEOHead from "@/components/seo/SEOHead";
import KeywordResearch from "@/components/seo-tools/keyword-research";
import { Search } from "lucide-react";

export default function KeywordResearchPage() {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated()) {
      window.location.href = '/auth';
    }
  }, [isAuthenticated]);

  if (!isAuthenticated()) {
    return null;
  }

  const keywordToolStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Free Keyword Research Tool",
    "description": "Generate 50+ keyword suggestions with search volume estimates, competition analysis, and SEO difficulty scores. Free professional keyword research tool by RankBee.",
    "url": typeof window !== 'undefined' ? window.location.href : 'https://rankbee.app/tools/keyword-research',
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Free Keyword Research Tool - Find High-Volume Keywords | RankBee"
        description="Discover profitable keywords with our free keyword research tool. Get 50+ keyword suggestions, search volume data, competition analysis, and SEO difficulty scores. Perfect for content creators and SEO professionals."
        keywords="keyword research tool, free keyword finder, keyword generator, search volume tool, keyword difficulty checker, SEO keywords, long tail keywords, keyword analysis, content optimization, digital marketing keywords"
        canonicalUrl={typeof window !== 'undefined' ? window.location.href : 'https://rankbee.app/tools/keyword-research'}
        ogTitle="Free Keyword Research Tool - Generate 50+ Keyword Ideas Instantly"
        ogDescription="Find high-volume, low-competition keywords for your content strategy. Free professional keyword research tool with search volume estimates and difficulty scores."
        structuredData={keywordToolStructuredData}
      />
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
              <Search className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Keyword Research
              </h1>
              <p className="text-gray-600">Generate 50+ keyword suggestions with search volume estimates and competition analysis.</p>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <KeywordResearch />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}