import { useAuth } from "@/lib/auth";
import { useEffect } from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import SEOHead from "@/components/seo/SEOHead";
import DomainAuthority from "@/components/seo-tools/domain-authority";
import { Shield } from "lucide-react";

export default function DomainAuthorityPage() {
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
        title="Free Domain Authority Checker - Check DA & PA Scores | RankBee"
        description="Check domain authority (DA) and page authority (PA) scores for any website instantly. Free domain authority checker with comprehensive SEO metrics and website credibility analysis."
        keywords="domain authority checker, DA checker, page authority, PA checker, domain authority score, website authority, SEO metrics, domain credibility, website strength analysis, authority score checker"
        canonicalUrl={typeof window !== 'undefined' ? window.location.href : 'https://rankbee.app/tools/domain-authority'}
        ogTitle="Free Domain Authority Checker - Measure Website SEO Strength"
        ogDescription="Instantly check domain authority and page authority scores. Free tool to measure website credibility and SEO strength for better search rankings."
      />
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Domain Authority
              </h1>
              <p className="text-gray-600">Check domain and page authority scores to measure website credibility and SEO strength.</p>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <DomainAuthority />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}