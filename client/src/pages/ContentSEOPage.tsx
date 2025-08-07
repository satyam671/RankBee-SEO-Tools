import { useAuth } from "@/lib/auth";
import { useEffect } from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ContentSEO from "@/components/seo-tools/content-seo";
import { BarChart3 } from "lucide-react";

export default function ContentSEOPage() {
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
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Content SEO Analyzer
              </h1>
              <p className="text-gray-600">Analyze your content for SEO optimization with keyword density, readability, and structure scoring.</p>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <ContentSEO />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}