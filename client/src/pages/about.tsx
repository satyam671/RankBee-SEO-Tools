import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Target,
  Users,
  Globe,
  Award,
  TrendingUp,
  Shield,
  Zap,
  CheckCircle
} from "lucide-react";
import insightsIllustration from "@assets/4_1754303727632.png";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="hero-gradient text-white section-padding">
        <div className="container-width text-center">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            About RankBee
          </h1>
          <p className="text-xl lg:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
            Empowering businesses worldwide with professional-grade SEO tools that are completely free and privacy-focused.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section-padding">
        <div className="container-width">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                At RankBee, we believe that powerful SEO tools shouldn't be locked behind expensive paywalls. Our mission is to democratize access to professional-grade SEO analysis tools, making them available to everyone from solo entrepreneurs to large enterprises.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                We're committed to providing accurate, real-time SEO data while maintaining the highest standards of user privacy and data security.
              </p>
            </div>
            <div className="text-center">
              <img 
                src={insightsIllustration} 
                alt="SEO insights and innovation" 
                className="w-full max-w-sm mx-auto h-auto mb-6"
              />
              <h3 className="text-xl font-semibold text-gray-900">Democratizing SEO</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-width">
          <h2 className="text-3xl font-bold text-center mb-12">Our Core Values</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="feature-icon mx-auto">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Privacy First</h3>
              <p className="text-gray-600">
                Your data stays yours. We don't track, store, or sell your personal information or search queries.
              </p>
            </div>
            
            <div className="text-center">
              <div className="feature-icon mx-auto">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Real-Time Results</h3>
              <p className="text-gray-600">
                Get instant insights with our powerful web scraping technology and real-time analysis engines.
              </p>
            </div>
            
            <div className="text-center">
              <div className="feature-icon mx-auto">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Professional Quality</h3>
              <p className="text-gray-600">
                Enterprise-grade tools with the accuracy and reliability you'd expect from paid alternatives.
              </p>
            </div>
            
            <div className="text-center">
              <div className="feature-icon mx-auto">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Community Driven</h3>
              <p className="text-gray-600">
                Built by SEO professionals for the SEO community, continuously improved based on user feedback.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="section-padding">
        <div className="container-width">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Our Story</h2>
            <div className="text-lg text-gray-600 space-y-6 leading-relaxed">
              <p>
                RankBee was born from frustration. As SEO professionals, we found ourselves constantly switching between expensive tools, each with their own limitations and steep learning curves. The monthly subscription costs were adding up, especially for small businesses and independent consultants.
              </p>
              <p>
                We realized that the core SEO data and analysis capabilities could be provided for free using modern web technologies and smart algorithmic approaches. Why should businesses pay hundreds of dollars monthly for basic keyword research and domain analysis?
              </p>
              <p>
                That's when we decided to build RankBee - a comprehensive SEO toolkit that rivals expensive alternatives but remains completely free and privacy-focused. Our platform uses advanced web scraping, machine learning, and algorithmic analysis to provide accurate, real-time SEO insights.
              </p>
              <p>
                Today, RankBee serves thousands of users worldwide, from individual bloggers to Fortune 500 companies, all united by the goal of improving their search engine visibility without breaking the bank.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-green-50/30">
        <div className="container-width">
          <h2 className="text-3xl font-bold text-center mb-12">RankBee by the Numbers</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">50,000+</div>
              <h4 className="text-lg font-semibold mb-2">Active Users</h4>
              <p className="text-gray-600 text-sm">SEO professionals trust RankBee</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">1M+</div>
              <h4 className="text-lg font-semibold mb-2">Analyses Completed</h4>
              <p className="text-gray-600 text-sm">Keywords, domains, and content analyzed</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">15+</div>
              <h4 className="text-lg font-semibold mb-2">SEO Tools</h4>
              <p className="text-gray-600 text-sm">Comprehensive toolkit for all needs</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-600 mb-2">100%</div>
              <h4 className="text-lg font-semibold mb-2">Free Forever</h4>
              <p className="text-gray-600 text-sm">No hidden costs or premium tiers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-padding">
        <div className="container-width">
          <h2 className="text-3xl font-bold text-center mb-12">Built by SEO Experts</h2>
          
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Our team consists of experienced SEO professionals, data scientists, and software engineers who understand the challenges of modern search engine optimization. We combine deep industry knowledge with cutting-edge technology to create tools that actually solve real problems.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">SEO Strategy</h3>
                <p className="text-gray-600 text-sm">15+ years combined experience in SEO and digital marketing</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Technology</h3>
                <p className="text-gray-600 text-sm">Expert developers with deep knowledge of web technologies</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-10 w-10 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Community</h3>
                <p className="text-gray-600 text-sm">Active members of the SEO community, speaking at conferences</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-width">
          <h2 className="text-3xl font-bold text-center mb-12">Our Technology</h2>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-semibold mb-6">Real-Time Web Scraping</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Advanced Scraping Engine</h4>
                    <p className="text-gray-600">Custom-built scraping infrastructure that adapts to modern websites</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Algorithmic Analysis</h4>
                    <p className="text-gray-600">Smart algorithms that provide accurate SEO insights without external APIs</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Privacy Protection</h4>
                    <p className="text-gray-600">Zero tracking, no data storage, complete user privacy</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center">
              <Globe className="h-32 w-32 text-green-500 mx-auto mb-6" />
              <p className="text-gray-600">
                Our technology stack is built for scale, reliability, and user privacy. We process millions of requests while maintaining lightning-fast response times.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding hero-gradient text-white">
        <div className="container-width text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Boost Your SEO?</h2>
          <p className="text-xl mb-8 text-white/90">
            Join thousands of SEO professionals who trust RankBee for their optimization needs
          </p>
          <div className="flex justify-center space-x-4">
            <a href="/" className="mint-button inline-flex items-center">
              Try Our Tools
            </a>
            <a href="/contact" className="mint-button-outline inline-flex items-center">
              Contact Us
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}