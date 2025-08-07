import { useAuth } from "@/lib/auth";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ToolCard from "@/components/ui/tool-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SEOHead from "@/components/seo/SEOHead";
import { useEffect } from "react";
import { 
  Search, 
  Shield, 
  Link, 
  BarChart3, 
  Code, 
  TrendingUp,
  Zap,
  Lock,
  Award,
  Users,
  Globe,
  Target,
  ArrowRight,
  CheckCircle,
  Star,
  BarChart,
  Activity,
  Smartphone,
  DollarSign,
  ExternalLink,
  ShoppingCart,
  Play
} from "lucide-react";
import heroImage from "@assets/hero-image_1754290659810.jpg";
import globalAnalyticsIllustration from "@assets/2_1754303715256.png";
import analyticsChartIllustration from "@assets/3_1754303720873.png";
import insightsIllustration from "@assets/4_1754303727632.png";
import searchAnalysisIllustration from "@assets/5_1754303732896.png";
import contentOptimizationIllustration from "@assets/6_1754303737309.png";

const tools = [
  {
    id: 'keyword-research',
    title: 'Keyword Research',
    description: 'Generate 50+ keyword suggestions with search volume estimates and competition analysis.',
    icon: Search,
    color: 'bg-emerald-500',
    category: 'Most Popular',
    tip: 'Start with broad keywords and use location targeting for better results'
  },
  {
    id: 'domain-authority',
    title: 'Domain Authority',
    description: 'Check domain and page authority scores to measure website credibility and SEO strength.',
    icon: Shield,
    color: 'bg-green-500',
    category: 'Essential',
    tip: 'Higher domain authority (70+) indicates stronger SEO potential'
  },
  {
    id: 'backlink-analyzer',
    title: 'Backlink Analyzer',
    description: 'Discover and analyze backlinks to understand your link profile and competitor strategies.',
    icon: Link,
    color: 'bg-teal-500',
    category: 'Advanced',
    tip: 'Focus on dofollow links from high-authority domains for best results'
  },
  {
    id: 'keyword-density',
    title: 'Keyword Density',
    description: 'Calculate keyword frequency and density percentages to optimize your content.',
    icon: BarChart3,
    color: 'bg-cyan-500',
    category: 'Content',
    tip: 'Aim for 0.5-2.5% keyword density to avoid over-optimization'
  },
  {
    id: 'meta-tags',
    title: 'Meta Tags Extractor',
    description: 'Extract and analyze meta titles, descriptions, and Open Graph tags from any webpage.',
    icon: Code,
    color: 'bg-blue-500',
    category: 'Technical',
    tip: 'Keep meta descriptions between 120-160 characters for optimal display'
  },
  {
    id: 'rank-tracker',
    title: 'Rank Tracker',
    description: 'Track your keyword rankings across Google, Bing, and other search engines.',
    icon: TrendingUp,
    color: 'bg-indigo-500',
    category: 'Monitoring',
    tip: 'Monitor rankings weekly to track SEO progress and strategy effectiveness'
  },
  {
    id: 'content-seo',
    title: 'Content SEO Analyzer',
    description: 'Analyze your content for SEO optimization with keyword density, readability, and structure scoring.',
    icon: BarChart3,
    color: 'bg-purple-500',
    category: 'Content',
    tip: 'Optimize content for target keywords while maintaining natural readability'
  },
  {
    id: 'competition-checker',
    title: 'Competition Checker',
    description: 'Analyze competitor websites, keywords, and SEO metrics including DA, PA, backlinks, and rankings.',
    icon: Target,
    color: 'bg-orange-500',
    category: 'Advanced',
    tip: 'Use competitor analysis to find keyword gaps and opportunities'
  },
  {
    id: 'top-search-queries',
    title: 'Top Search Queries',
    description: 'Discover keywords your website ranks for with search volume, CPC, difficulty, and click estimates.',
    icon: TrendingUp,
    color: 'bg-red-500',
    category: 'Most Popular',
    tip: 'Analyze your top-performing keywords to optimize content strategy'
  },
  {
    id: 'top-referrers',
    title: 'Top Referrers',
    description: 'Find websites linking to your domain with DA, domain age, backlink count, and link type analysis.',
    icon: ExternalLink,
    color: 'bg-indigo-500',
    category: 'Advanced',
    tip: 'Discover your top referral sources to build more quality backlinks'
  },
  {
    id: 'amazon-keywords',
    title: 'Amazon Keywords',
    description: 'Research high-converting Amazon keywords with volume, competition, CPC, and difficulty metrics.',
    icon: ShoppingCart,
    color: 'bg-orange-600',
    category: 'E-commerce',
    tip: 'Focus on long-tail keywords with lower competition for better product rankings'
  },
  {
    id: 'youtube-keywords',
    title: 'YouTube Keywords',
    description: 'Discover trending YouTube keywords with search volume, competition analysis, and content ideas.',
    icon: Play,
    color: 'bg-red-600',
    category: 'Video Marketing',
    tip: 'Use tutorial and how-to keywords for better YouTube video optimization'
  }
];

export default function Home() {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // SEO Meta Tags for better search engine optimization
    document.title = "RankBee - Free SEO Tools for Website Analysis & Keyword Research";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Free SEO tools suite including keyword research, domain authority checker, backlink analyzer, rank tracker & more. Boost your search rankings with professional SEO analysis tools.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Free SEO tools suite including keyword research, domain authority checker, backlink analyzer, rank tracker & more. Boost your search rankings with professional SEO analysis tools.';
      document.head.appendChild(meta);
    }

    // Keywords meta tag for SEO optimization
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', 'SEO tools, keyword research, domain authority, backlink analyzer, rank tracker, website analysis, search engine optimization, free SEO tools, SERP analysis, competitor analysis');
    } else {
      const keywords = document.createElement('meta');
      keywords.name = 'keywords';
      keywords.content = 'SEO tools, keyword research, domain authority, backlink analyzer, rank tracker, website analysis, search engine optimization, free SEO tools, SERP analysis, competitor analysis';
      document.head.appendChild(keywords);
    }

    // Open Graph tags for social media sharing
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', 'RankBee - Professional SEO Tools Suite');
    } else {
      const og = document.createElement('meta');
      og.setAttribute('property', 'og:title');
      og.content = 'RankBee - Professional SEO Tools Suite';
      document.head.appendChild(og);
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', 'Comprehensive free SEO tools for keyword research, domain analysis, backlink checking, and website optimization. Improve your search rankings today.');
    } else {
      const ogDesc = document.createElement('meta');
      ogDesc.setAttribute('property', 'og:description');
      ogDesc.content = 'Comprehensive free SEO tools for keyword research, domain analysis, backlink checking, and website optimization. Improve your search rankings today.';
      document.head.appendChild(ogDesc);
    }
  }, []);

  const handleToolClick = (toolId: string) => {
    if (!isAuthenticated()) {
      // Open auth page in new window
      window.open('/auth', '_blank', 'noopener,noreferrer');
      return;
    }
    
    // Handle specific tool routing - all open in new windows
    switch (toolId) {
      case 'competition-checker':
        window.open('/tools/competition-checker', '_blank', 'noopener,noreferrer');
        break;
      case 'top-search-queries':
        window.open('/tools/top-search-queries', '_blank', 'noopener,noreferrer');
        break;
      case 'top-referrers':
        window.open('/tools/top-referrers', '_blank', 'noopener,noreferrer');
        break;
      case 'amazon-keywords':
        window.open('/tools/amazon-keywords', '_blank', 'noopener,noreferrer');
        break;
      case 'youtube-keywords':
        window.open('/tools/youtube-keywords', '_blank', 'noopener,noreferrer');
        break;
      default:
        // For modal tools, create dedicated pages and open in new window
        const toolUrl = `/tools/${toolId}`;
        window.open(toolUrl, '_blank', 'noopener,noreferrer');
        break;
    }
  };



  const homeStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "RankBee - Professional SEO Tools",
    "description": "Free comprehensive SEO toolkit including keyword research, domain authority checker, backlink analyzer, rank tracker, and 10+ professional SEO tools",
    "url": typeof window !== 'undefined' ? window.location.origin : 'https://rankbee.app',
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": typeof window !== 'undefined' ? `${window.location.origin}/tools/keyword-research?query={search_term_string}` : 'https://rankbee.app/tools/keyword-research?query={search_term_string}'
      },
      "query-input": "required name=search_term_string"
    },
    "sameAs": [
      "https://twitter.com/RankBeeTools",
      "https://linkedin.com/company/rankbee"
    ]
  };

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="RankBee - Free SEO Tools | Keyword Research, Domain Authority, Backlink Analyzer"
        description="Comprehensive free SEO toolkit with keyword research, domain authority checker, backlink analyzer, rank tracker, competition checker, and 10+ professional SEO tools. Boost your search rankings with real-time data analysis."
        keywords="free SEO tools, keyword research tool, domain authority checker, backlink analyzer, rank tracker, competition checker, SEO optimization, search engine optimization, website analysis, SERP tracker, SEO audit, meta tags checker, digital marketing tools, organic traffic, search rankings, SEO analytics"
        canonicalUrl={typeof window !== 'undefined' ? window.location.origin : 'https://rankbee.app'}
        ogTitle="RankBee - Professional SEO Tools | Free Keyword Research & Website Analysis"
        ogDescription="Boost your search rankings with our comprehensive SEO toolkit. Free keyword research, domain authority analysis, backlink checking, and rank tracking tools."
        structuredData={homeStructuredData}
      />
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gray-50 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              {/* Free SEO Tools Badge */}
              <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-6">
                <TrendingUp className="h-4 w-4 mr-2" />
                Free SEO Tools
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                Rank Higher with{" "}
                <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  RankBee
                </span>
              </h1>
              
              <p className="text-lg lg:text-xl mb-8 text-gray-600 leading-relaxed">
                Comprehensive SEO toolkit with keyword research, domain analysis, 
                backlink checking, and more. Boost your search rankings with our 
                professional-grade tools.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-medium"
                  onClick={(e) => {
                    e.preventDefault();
                    const toolsSection = document.getElementById('tools');
                    if (toolsSection) {
                      toolsSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  <Search className="mr-2 h-4 w-4" />
                  Start Analyzing
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src={heroImage} 
                alt="SEO Analytics Dashboard" 
                className="w-full h-auto rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Core Benefits Section */}
      <section className="section-padding bg-green-50/30">
        <div className="container-width">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="feature-icon">
                <Lock className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Privacy-First Processing</h3>
              <p className="text-gray-600">Your data stays secure with our privacy-focused approach. No tracking, no data selling.</p>
            </div>
            <div className="text-center">
              <div className="feature-icon">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">10+ SEO Tools</h3>
              <p className="text-gray-600">Complete toolkit covering keyword research, technical SEO, and competitive analysis.</p>
            </div>
            <div className="text-center">
              <div className="feature-icon">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">100% Free to Use</h3>
              <p className="text-gray-600">No hidden fees, no subscription required. Professional-grade tools at zero cost.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why SEO Matters */}
      <section className="section-padding">
        <div className="container-width">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">Why SEO Matters</h2>
              <h3 className="text-2xl lg:text-3xl text-gray-600 mb-4">Transform Your Website's Performance with RankBee</h3>
              <p className="text-xl text-gray-600">
                Join millions of website owners who've increased their organic traffic and search rankings using our comprehensive SEO toolkit. No technical expertise required.
              </p>
            </div>
            <div className="text-center">
              <img 
                src={contentOptimizationIllustration} 
                alt="Content optimization and SEO management" 
                className="w-full max-w-md mx-auto h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="section-padding bg-gradient-to-b from-green-50/30 to-white">
        <div className="container-width">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="stats-card">
              <div className="text-4xl font-bold text-green-600 mb-2">+53%</div>
              <h4 className="text-lg font-semibold mb-2">Increase Organic Traffic</h4>
              <p className="text-gray-600 text-sm">Drive 53% more traffic with proper SEO optimization</p>
            </div>
            <div className="stats-card">
              <div className="text-4xl font-bold text-blue-600 mb-2">Page 1</div>
              <h4 className="text-lg font-semibold mb-2">Higher SERP Rankings</h4>
              <p className="text-gray-600 text-sm">Rank on the first page for your target keywords</p>
            </div>
            <div className="stats-card">
              <div className="text-4xl font-bold text-purple-600 mb-2">98%</div>
              <h4 className="text-lg font-semibold mb-2">Better User Experience</h4>
              <p className="text-gray-600 text-sm">Improve site speed and mobile responsiveness</p>
            </div>
            <div className="stats-card">
              <div className="text-4xl font-bold text-emerald-600 mb-2">300%</div>
              <h4 className="text-lg font-semibold mb-2">Measurable ROI</h4>
              <p className="text-gray-600 text-sm">Track conversions and revenue growth</p>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Analytics Section */}
      <section className="section-padding">
        <div className="container-width">
          <div className="mint-card max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-3xl font-bold mb-4">Advanced SEO Analytics</h3>
                <p className="text-xl text-gray-600 mb-6">
                  Get real-time insights with our powerful web scraping technology
                </p>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                    <span className="text-gray-700">Real-time web scraping and analysis</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                    <span className="text-gray-700">50+ keyword suggestions per search</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                    <span className="text-gray-700">Comprehensive domain authority metrics</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                    <span className="text-gray-700">Free alternative to expensive SEO tools</span>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <img 
                  src={globalAnalyticsIllustration} 
                  alt="Global SEO analytics and insights" 
                  className="w-full max-w-lg mx-auto h-auto rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RankBee Advantages */}
      <section className="section-padding bg-green-50/30">
        <div className="container-width">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">RankBee Advantages</h2>
            <h3 className="text-2xl text-gray-600 mb-6">Why Choose RankBee Over Expensive Alternatives?</h3>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Get professional-grade SEO insights without the hefty price tag. Our platform delivers the same data quality as premium tools like Ahrefs and SEMrush.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <div className="grid gap-4">
                <div className="flex items-center space-x-3 p-4 bg-white rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">No API limits or subscription required</span>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-white rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Advanced filtering and location targeting</span>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-white rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Real-time competitive analysis</span>
                </div>
              </div>
            </div>
            <div className="text-center">
              <img 
                src={analyticsChartIllustration} 
                alt="SEO analytics and performance tracking" 
                className="w-full max-w-sm mx-auto h-auto"
              />
            </div>
          </div>
          
          {/* Pro Tip Section - Landscape Layout */}
          <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6">
            <div className="grid lg:grid-cols-4 gap-6 items-center">
              <div className="lg:col-span-1 text-center">
                <div className="bg-green-100 rounded-lg p-4 inline-block">
                  <Target className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <div className="lg:col-span-3">
                <h4 className="font-semibold text-green-800 text-lg mb-2">Pro Tip:</h4>
                <p className="text-gray-700 text-base">
                  Start with keyword research to identify high-traffic, low-competition opportunities. Then use our domain analysis tools to understand your competition and improve your strategy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="section-padding" id="tools">
        <div className="container-width">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
            <div className="text-center lg:text-left">
              <h2 className="text-4xl font-bold mb-4">Complete SEO Toolkit</h2>
              <p className="text-xl text-gray-600">
                Everything you need to optimize your website and track your rankings
              </p>
            </div>
            <div className="text-center">
              <img 
                src={searchAnalysisIllustration} 
                alt="SEO tools and search analysis" 
                className="w-full max-w-sm mx-auto h-auto"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.map((tool) => (
              <div 
                key={tool.id} 
                className="mint-card cursor-pointer" 
                onClick={() => handleToolClick(tool.id)}
                data-tool-card
                data-tool-title={tool.title}
                data-tool-description={tool.description}
              >
                <div className="flex items-start mb-4">
                  <div className={`w-12 h-12 ${tool.color} rounded-xl flex items-center justify-center mr-4 flex-shrink-0`}>
                    <tool.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 mb-1">{tool.title}</h4>
                    <p className="text-sm text-gray-500 mb-3">{tool.category}</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">{tool.description}</p>
                <div className="flex items-center text-green-600 font-medium">
                  <span>Try Now</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEO Knowledge Hub */}
      <section className="section-padding bg-gray-50">
        <div className="container-width">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-bold mb-4">Master SEO with Expert Guides</h2>
              <p className="text-xl text-gray-600">
                Learn from our comprehensive tutorials and stay updated with the latest SEO trends
              </p>
            </div>
            <div className="text-center">
              <img 
                src={insightsIllustration} 
                alt="SEO knowledge and insights" 
                className="w-full max-w-sm mx-auto h-auto"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="mint-card cursor-pointer" onClick={() => window.location.href = '/blogs'}>
              <div className="flex items-start mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                  <Search className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">Keyword Research Guide</h4>
                  <p className="text-sm text-gray-500">12 min read</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                Master the art of finding profitable keywords with our comprehensive guide. Learn advanced techniques and strategies.
              </p>
              <div className="flex items-center text-green-600 font-medium">
                <span>Read Guide</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </div>

            <div className="mint-card cursor-pointer" onClick={() => window.location.href = '/blogs'}>
              <div className="flex items-start mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">Domain Authority Guide</h4>
                  <p className="text-sm text-gray-500">10 min read</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                Learn how to improve your domain authority and build trust with search engines using proven strategies.
              </p>
              <div className="flex items-center text-green-600 font-medium">
                <span>Read Guide</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </div>

            <div className="mint-card cursor-pointer" onClick={() => window.location.href = '/blogs'}>
              <div className="flex items-start mb-4">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                  <Code className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">Technical SEO Guide</h4>
                  <p className="text-sm text-gray-500">15 min read</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                Master meta tags optimization for better search rankings. Learn best practices for technical SEO.
              </p>
              <div className="flex items-center text-green-600 font-medium">
                <span>Read Guide</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </div>
          </div>

          <div className="text-center">
            <Button 
              className="mint-button-outline"
              onClick={() => window.location.href = '/blogs'}
            >
              View All Guides <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding hero-gradient text-white">
        <div className="container-width text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">Ready to Dominate Search Results?</h2>
          <p className="text-xl mb-8">Join 50,000+ websites already using RankBee to improve their SEO performance</p>
          
          <div className="flex justify-center space-x-8 mb-8 text-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-6 w-6" />
              <span>100% Free Forever</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-6 w-6" />
              <span>No Registration Required</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-6 w-6" />
              <span>Instant Results</span>
            </div>
          </div>

          <Button 
            className="mint-button text-lg"
            onClick={(e) => {
              e.preventDefault();
              const toolsSection = document.getElementById('tools');
              if (toolsSection) {
                toolsSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            Start Your SEO Analysis <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-gray-50">
        <div className="container-width text-center">
          <h2 className="text-3xl font-bold mb-12">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4 italic">
                "RankBee helped us increase our organic traffic by 180% in just 3 months. The keyword research tool is incredibly accurate."
              </p>
              <div className="font-semibold">Sarah Johnson</div>
              <div className="text-sm text-gray-500">Marketing Director, TechStartup</div>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4 italic">
                "Finally, a free SEO tool that actually works! The domain authority checker saved us thousands on expensive subscriptions."
              </p>
              <div className="font-semibold">Mike Chen</div>
              <div className="text-sm text-gray-500">SEO Consultant</div>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4 italic">
                "The best part about RankBee is how easy it is to use. Even as a beginner, I was able to optimize my website effectively."
              </p>
              <div className="font-semibold">Emily Rodriguez</div>
              <div className="text-sm text-gray-500">Small Business Owner</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
