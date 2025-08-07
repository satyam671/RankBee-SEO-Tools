import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-green-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                <svg viewBox="0 0 24 24" className="w-7 h-7 text-white">
                  {/* Main bee body (abdomen) */}
                  <ellipse cx="12" cy="16" rx="3.2" ry="4.5" fill="#444444" stroke="#333" strokeWidth="0.3"/>
                  
                  {/* Yellow stripes on abdomen */}
                  <ellipse cx="12" cy="14" rx="2.8" ry="1" fill="#FFD700"/>
                  <ellipse cx="12" cy="16.5" rx="2.8" ry="1" fill="#FFD700"/>
                  
                  {/* Thorax (middle section) */}
                  <ellipse cx="12" cy="10" rx="2.5" ry="2.5" fill="#444444" stroke="#333" strokeWidth="0.3"/>
                  
                  {/* Head */}
                  <circle cx="12" cy="6.5" r="2" fill="#444444" stroke="#333" strokeWidth="0.3"/>
                  
                  {/* Antennae */}
                  <path d="M10.5 5 Q9 3.5 8.5 2.5" stroke="#333" strokeWidth="0.8" fill="none" strokeLinecap="round"/>
                  <path d="M13.5 5 Q15 3.5 15.5 2.5" stroke="#333" strokeWidth="0.8" fill="none" strokeLinecap="round"/>
                  <circle cx="8.5" cy="2.5" r="0.4" fill="#333"/>
                  <circle cx="15.5" cy="2.5" r="0.4" fill="#333"/>
                  
                  {/* Wings - left wing */}
                  <ellipse cx="9" cy="9" rx="3.5" ry="2.2" fill="rgba(255,255,255,0.9)" stroke="#333" strokeWidth="0.2" transform="rotate(-15 9 9)"/>
                  <ellipse cx="8.5" cy="11" rx="2.8" ry="1.8" fill="rgba(255,255,255,0.8)" stroke="#333" strokeWidth="0.2" transform="rotate(-10 8.5 11)"/>
                  
                  {/* Wings - right wing */}
                  <ellipse cx="15" cy="9" rx="3.5" ry="2.2" fill="rgba(255,255,255,0.9)" stroke="#333" strokeWidth="0.2" transform="rotate(15 15 9)"/>
                  <ellipse cx="15.5" cy="11" rx="2.8" ry="1.8" fill="rgba(255,255,255,0.8)" stroke="#333" strokeWidth="0.2" transform="rotate(10 15.5 11)"/>
                  
                  {/* Wing details (veins) */}
                  <path d="M7 8 Q9 9 9 11" stroke="#333" strokeWidth="0.2" fill="none"/>
                  <path d="M17 8 Q15 9 15 11" stroke="#333" strokeWidth="0.2" fill="none"/>
                  
                  {/* Stinger */}
                  <path d="M12 20 L12 21.5" stroke="#333" strokeWidth="0.8" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="flex flex-col justify-center h-12">
                <h5 className="text-xl font-bold text-gray-900 leading-none mb-1">RankBee</h5>
                <p className="text-sm text-gray-600 font-medium leading-none mt-[4px] mb-[4px]">Professional SEO Tools</p>
              </div>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Professional SEO tools to help you rank higher, analyze better, and grow faster. Everything you need for successful digital marketing.
            </p>
          </div>
          
          <div>
            <h6 className="font-semibold text-gray-900 mb-4">Quick Links</h6>
            <ul className="space-y-3 text-sm">
              <li>
                <a 
                  href="#tools" 
                  className="text-gray-600 hover:text-green-600 transition-colors cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    const toolsSection = document.getElementById('tools');
                    if (toolsSection) {
                      toolsSection.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      window.location.href = '/#tools';
                    }
                  }}
                >
                  SEO Tools
                </a>
              </li>
              <li>
                <Link href="/blogs" className="text-gray-600 hover:text-green-600 transition-colors">
                  SEO Guides
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 hover:text-green-600 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-green-600 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h6 className="font-semibold text-gray-900 mb-4">Legal</h6>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-green-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>        
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-green-600 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-green-600 transition-colors">
                  Support
                </Link>
              </li>
              <li>
                <button 
                  onClick={() => window.location.href = 'mailto:satyamsahu671@gmail.com?subject=RankBee Support'}
                  className="text-gray-600 hover:text-green-600 transition-colors text-left"
                >
                  Email Us
                </button>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-green-100 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500 mb-4 md:mb-0">
              © 2025 RankBee. All rights reserved. Professional SEO tools to help you rank higher, analyze better, and grow faster.
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>Made with ❤️ for SEO professionals</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
