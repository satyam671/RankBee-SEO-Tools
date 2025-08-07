import { useAuth } from "@/lib/auth";
import { useEffect } from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import SEOHead from "@/components/seo/SEOHead";
import BacklinkAnalyzer from "@/components/seo-tools/backlink-analyzer";
import { Link } from "lucide-react";

export default function BacklinkAnalyzerPage() {
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
        title="Free Backlink Analyzer - Check Website Backlinks & Link Profile | RankBee"
        description="Analyze backlinks for any website with our free backlink checker. Discover link building opportunities, check competitor backlinks, and analyze your link profile for better SEO."
        keywords="backlink analyzer, free backlink checker, link analyzer, backlink tool, link building tool, competitor backlinks, link profile analysis, SEO backlinks, website links checker"
        canonicalUrl={typeof window !== 'undefined' ? window.location.href : 'https://rankbee.app/tools/backlink-analyzer'}
        ogTitle="Free Backlink Analyzer - Discover Website Link Profiles"
        ogDescription="Analyze backlinks and understand link building strategies. Free tool to check website backlinks, discover competitor links, and improve your SEO performance."
      />
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center">
              <Link className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Backlink Analyzer
              </h1>
              <p className="text-gray-600">Discover and analyze backlinks to understand your link profile and competitor strategies.</p>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <BacklinkAnalyzer />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}