import React from "react";
import { useForm, ValidationError } from "@formspree/react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import SEOHead from "@/components/seo/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Mail,
  MessageSquare,
  Users,
  HelpCircle,
  Send,
  CheckCircle
} from "lucide-react";

export default function ContactPage() {
  const [state, handleSubmit] = useForm("mnnzgkkp");

  if (state.succeeded) {
    return (
      <div className="min-h-screen bg-white">
        <SEOHead
          title="Contact RankBee - SEO Tools Support | Get Help with SEO Analysis"
          description="Get in touch with RankBee support team for help with SEO tools, partnership inquiries, technical support, and feedback. Fast response times and expert assistance available."
          keywords="RankBee contact, SEO tools support, SEO help, technical support, partnership inquiries, contact SEO experts, customer service, SEO assistance"
          canonicalUrl={typeof window !== 'undefined' ? window.location.href : 'https://rankbee.app/contact'}
        />
        <Header />
        
        <div className="section-padding">
          <div className="container-width">
            <div className="max-w-2xl mx-auto text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold mb-4">Message Sent Successfully!</h1>
              <p className="text-gray-600 mb-8">
                Thank you for reaching out. We'll get back to you within 24 hours.
              </p>
              <Button onClick={() => window.location.reload()} className="mint-button">
                Send Another Message
              </Button>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Contact RankBee - SEO Tools Support & Partnership Inquiries"
        description="Contact RankBee for SEO tools support, technical assistance, partnership opportunities, and feedback. Professional SEO consultation and customer service available."
        keywords="contact RankBee, SEO tools support, SEO customer service, partnership inquiries, technical support, feedback, SEO consultation, help with SEO tools"
        canonicalUrl={typeof window !== 'undefined' ? window.location.href : 'https://rankbee.app/contact'}
      />
      <Header />
      
      {/* Hero Section */}
      <section className="hero-gradient text-white section-padding">
        <div className="container-width text-center">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            Get in Touch
          </h1>
          <p className="text-xl lg:text-2xl mb-8 text-white/90">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="section-padding">
        <div className="container-width">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="mint-card">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        className="mt-1"
                        placeholder="Your full name"
                      />
                      <ValidationError 
                        prefix="Name" 
                        field="name"
                        errors={state.errors}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="mt-1"
                        placeholder="your@email.com"
                      />
                      <ValidationError 
                        prefix="Email" 
                        field="email"
                        errors={state.errors}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      className="mt-1"
                      placeholder="What's this about?"
                    />
                    <ValidationError 
                      prefix="Subject" 
                      field="subject"
                      errors={state.errors}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      className="mt-1 min-h-[120px]"
                      placeholder="Tell us how we can help you..."
                    />
                    <ValidationError 
                      prefix="Message" 
                      field="message"
                      errors={state.errors}
                    />
                  </div>
                  
                  <Button type="submit" disabled={state.submitting} className="mint-button w-full">
                    <Send className="mr-2 h-4 w-4" />
                    {state.submitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-6">Other Ways to Reach Us</h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Mail className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1">Email Support</h3>
                      <p className="text-gray-600 mb-3 text-sm leading-relaxed">
                        For general inquiries and support questions
                      </p>
                      <button 
                        onClick={() => window.location.href = 'mailto:satyamsahu671@gmail.com?subject=RankBee Support'} 
                        className="text-green-600 hover:text-green-700 font-medium text-sm transition-colors"
                      >
                        Send Email
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Users className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1">Partnership Inquiries</h3>
                      <p className="text-gray-600 mb-3 text-sm leading-relaxed">
                        Interested in partnering with RankBee?
                      </p>
                      <button 
                        onClick={() => window.location.href = 'mailto:satyamsahu671@gmail.com?subject=RankBee Partnership Inquiry'} 
                        className="text-green-600 hover:text-green-700 font-medium text-sm transition-colors"
                      >
                        Send Email
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1">Feedback & Suggestions</h3>
                      <p className="text-gray-600 mb-3 text-sm leading-relaxed">
                        Help us improve our tools and services
                      </p>
                      <button 
                        onClick={() => window.location.href = 'mailto:satyamsahu671@gmail.com?subject=RankBee Feedback'} 
                        className="text-green-600 hover:text-green-700 font-medium text-sm transition-colors"
                      >
                        Send Email
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ Section */}
              <Card className="mint-card">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <HelpCircle className="h-6 w-6 text-green-600" />
                    <h3 className="text-xl font-semibold">Frequently Asked Questions</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-1">Is RankBee really free?</h4>
                      <p className="text-gray-600 text-sm">
                        Yes! All our core SEO tools are completely free with no hidden costs or premium tiers.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-1">How accurate is your data?</h4>
                      <p className="text-gray-600 text-sm">
                        We use real-time web scraping and advanced algorithms to provide highly accurate SEO insights.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-1">Do you store my search data?</h4>
                      <p className="text-gray-600 text-sm">
                        We prioritize privacy and don't store your search queries or personal data unnecessarily.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-1">Can I use this for commercial purposes?</h4>
                      <p className="text-gray-600 text-sm">
                        Absolutely! Our tools are perfect for agencies, consultants, and businesses of all sizes.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Response Time */}
              <Card className="mint-card">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Response Times</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">General Inquiries</span>
                      <span className="font-medium">24-48 hours</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Technical Support</span>
                      <span className="font-medium">12-24 hours</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Bug Reports</span>
                      <span className="font-medium">4-12 hours</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Partnership Inquiries</span>
                      <span className="font-medium">2-5 business days</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}