import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-gray-600">Last updated: January 15, 2025</p>
        </div>

        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-semibold mb-4">Agreement to Terms</h2>
              <p className="mb-6">
                By accessing and using RankBee's SEO tools and services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using our services.
              </p>

              <h3 className="text-xl font-semibold mb-3">Description of Service</h3>
              <p className="mb-6">
                RankBee provides free SEO analysis tools including keyword research, domain authority checking, backlink analysis, meta tag extraction, rank tracking, and related services. Our tools use web scraping and algorithmic analysis to provide SEO insights.
              </p>

              <h3 className="text-xl font-semibold mb-3">Acceptable Use</h3>
              <h4 className="text-lg font-medium mb-2">You may use our service to:</h4>
              <ul className="list-disc pl-6 mb-4">
                <li>Analyze websites and keywords for legitimate SEO purposes</li>
                <li>Research competitors within reasonable limits</li>
                <li>Generate reports and insights for business use</li>
                <li>Access our educational content and resources</li>
              </ul>

              <h4 className="text-lg font-medium mb-2">You may not use our service to:</h4>
              <ul className="list-disc pl-6 mb-6">
                <li>Violate any applicable laws or regulations</li>
                <li>Spam, abuse, or overload our systems</li>
                <li>Attempt to reverse engineer or copy our technology</li>
                <li>Use automated scripts or bots beyond normal usage</li>
                <li>Resell or redistribute our services</li>
                <li>Analyze illegal or harmful websites</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">User Accounts</h3>
              <p className="mb-4">While many of our tools work without registration, some features may require an account. When creating an account:</p>
              <ul className="list-disc pl-6 mb-6">
                <li>You must provide accurate and complete information</li>
                <li>You are responsible for maintaining account security</li>
                <li>You must notify us of any unauthorized access</li>
                <li>You may not share your account credentials</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">Free Service and Limitations</h3>
              <p className="mb-6">
                RankBee is provided free of charge. We reserve the right to implement reasonable usage limits to ensure fair access for all users. We may also introduce premium features in the future while maintaining our core free offerings.
              </p>

              <h3 className="text-xl font-semibold mb-3">Data and Privacy</h3>
              <p className="mb-6">
                Our Privacy Policy, which is incorporated by reference, explains how we handle your data. You retain ownership of any data you submit, and we will not use it for purposes other than providing our services.
              </p>

              <h3 className="text-xl font-semibold mb-3">Intellectual Property</h3>
              <p className="mb-6">
                RankBee's technology, design, and content are protected by intellectual property laws. You may not copy, reproduce, or distribute our services without permission. The SEO data and insights provided are for your use in accordance with these terms.
              </p>

              <h3 className="text-xl font-semibold mb-3">Disclaimers and Limitations</h3>
              <h4 className="text-lg font-medium mb-2">Service Availability</h4>
              <p className="mb-4">
                We strive for high availability but do not guarantee uninterrupted service. We may perform maintenance, updates, or temporary suspensions as needed.
              </p>

              <h4 className="text-lg font-medium mb-2">Data Accuracy</h4>
              <p className="mb-4">
                While we work to provide accurate SEO data, we cannot guarantee the completeness or accuracy of all information. SEO data can vary and should be used as guidance rather than absolute truth.
              </p>

              <h4 className="text-lg font-medium mb-2">Limitation of Liability</h4>
              <p className="mb-6">
                RankBee is provided "as is" without warranties. We are not liable for any damages arising from your use of our services, including but not limited to lost profits, data loss, or business interruption.
              </p>

              <h3 className="text-xl font-semibold mb-3">Third-Party Content</h3>
              <p className="mb-6">
                Our tools may analyze third-party websites and content. We are not responsible for the accuracy, legality, or content of external sites. Users should respect the rights and terms of websites they analyze.
              </p>

              <h3 className="text-xl font-semibold mb-3">Termination</h3>
              <p className="mb-6">
                We reserve the right to terminate or suspend access to our services at our discretion, particularly for violations of these terms. You may stop using our services at any time.
              </p>

              <h3 className="text-xl font-semibold mb-3">Changes to Terms</h3>
              <p className="mb-6">
                We may update these Terms of Service from time to time. Material changes will be communicated through our website. Continued use of our services after changes constitutes acceptance of the new terms.
              </p>

              <h3 className="text-xl font-semibold mb-3">Governing Law</h3>
              <p className="mb-6">
                These terms are governed by and construed in accordance with applicable laws. Any disputes will be resolved through appropriate legal channels.
              </p>

              <h3 className="text-xl font-semibold mb-3">Contact Information</h3>
              <p className="mb-4">
                For questions about these Terms of Service, please contact us:
              </p>
              <ul className="list-none mb-6">
                <li>Email: legal@rankbee.com</li>
                <li>Contact Form: <a href="/contact" className="text-green-600 hover:text-green-700">rankbee.com/contact</a></li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">Severability</h3>
              <p className="mb-4">
                If any provision of these terms is found to be unenforceable, the remaining provisions will continue in full force and effect.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}