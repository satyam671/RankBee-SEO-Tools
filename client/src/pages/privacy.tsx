import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-gray-600">Last updated: January 15, 2025</p>
        </div>

        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-semibold mb-4">Our Privacy Commitment</h2>
              <p className="mb-6">
                At RankBee, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our SEO tools and services.
              </p>

              <h3 className="text-xl font-semibold mb-3">Information We Collect</h3>
              <h4 className="text-lg font-medium mb-2">Information You Provide</h4>
              <ul className="list-disc pl-6 mb-4">
                <li>Account information (name, email) when you register</li>
                <li>URLs and keywords you analyze using our tools</li>
                <li>Contact information when you reach out to us</li>
              </ul>

              <h4 className="text-lg font-medium mb-2">Automatically Collected Information</h4>
              <ul className="list-disc pl-6 mb-6">
                <li>Basic usage analytics to improve our services</li>
                <li>Technical information (IP address, browser type) for security</li>
                <li>Error logs to help us fix technical issues</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">How We Use Your Information</h3>
              <ul className="list-disc pl-6 mb-6">
                <li>Provide and improve our SEO analysis tools</li>
                <li>Send you important updates about our services</li>
                <li>Respond to your support requests</li>
                <li>Ensure the security and proper functioning of our platform</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">Information Sharing</h3>
              <p className="mb-4">We do not sell, trade, or rent your personal information to third parties. We may share information only in these limited circumstances:</p>
              <ul className="list-disc pl-6 mb-6">
                <li>With your explicit consent</li>
                <li>To comply with legal obligations</li>
                <li>To protect our rights and prevent fraud</li>
                <li>With service providers who assist our operations (under strict confidentiality)</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">Data Security</h3>
              <p className="mb-6">
                We implement industry-standard security measures to protect your information, including encryption, secure connections (HTTPS), and regular security audits. However, no method of transmission over the internet is 100% secure.
              </p>

              <h3 className="text-xl font-semibold mb-3">Your Rights</h3>
              <p className="mb-4">You have the right to:</p>
              <ul className="list-disc pl-6 mb-6">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Delete your account and data</li>
                <li>Object to processing of your information</li>
                <li>Data portability</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">Cookies and Tracking</h3>
              <p className="mb-6">
                We use minimal cookies essential for our service functionality. We do not use tracking cookies for advertising purposes. You can control cookie settings in your browser.
              </p>

              <h3 className="text-xl font-semibold mb-3">Third-Party Links</h3>
              <p className="mb-6">
                Our service may contain links to third-party websites. We are not responsible for their privacy practices. We encourage you to read their privacy policies.
              </p>

              <h3 className="text-xl font-semibold mb-3">Children's Privacy</h3>
              <p className="mb-6">
                Our service is not intended for children under 13. We do not knowingly collect personal information from children under 13.
              </p>

              <h3 className="text-xl font-semibold mb-3">International Data Transfers</h3>
              <p className="mb-6">
                Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for such transfers.
              </p>

              <h3 className="text-xl font-semibold mb-3">Changes to This Policy</h3>
              <p className="mb-6">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on our website and updating the "Last updated" date.
              </p>

              <h3 className="text-xl font-semibold mb-3">Contact Us</h3>
              <p className="mb-4">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <ul className="list-none mb-6">
                <li>Email: privacy@rankbee.com</li>
                <li>Contact Form: <a href="/contact" className="text-green-600 hover:text-green-700">rankbee.com/contact</a></li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}