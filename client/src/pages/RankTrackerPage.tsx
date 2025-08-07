import { useAuth } from "@/lib/auth";
import { useEffect } from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import SEOHead from "@/components/seo/SEOHead";
import RankTracker from "@/components/seo-tools/rank-tracker";
import { TrendingUp } from "lucide-react";

export default function RankTrackerPage() {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated()) {
      window.location.href = '/auth';
    }
  }, [isAuthenticated]);

  if (!isAuthenticated()) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Free SERP Rank Tracker - Track Keyword Rankings | RankBee"
        description="Track your keyword rankings across Google, Bing, Yahoo, and DuckDuckGo. Free SERP rank tracker with accurate position monitoring and ranking history analysis."
        keywords="rank tracker, SERP tracker, keyword ranking tool, search engine position tracker, keyword monitor, ranking checker, SERP position tracker, SEO rank tracking"
        canonicalUrl={typeof window !== 'undefined' ? window.location.href : 'https://rankbee.app/tools/rank-tracker'}
        ogTitle="Free SERP Rank Tracker - Monitor Keyword Positions"
        ogDescription="Track your website's keyword rankings across all major search engines. Free rank tracking tool with accurate position monitoring and historical data."
      />
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Rank Tracker
              </h1>
              <p className="text-gray-600">Track your keyword rankings across Google, Bing, and other search engines.</p>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <RankTracker />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}