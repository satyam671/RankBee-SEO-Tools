import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Menu, User, LogOut, Search } from "lucide-react";
import { Link } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/auth/logout");
      return response.json();
    },
    onSettled: () => {
      logout();
      window.location.href = "/";
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <Link href="/">
            <div className="flex items-center space-x-3 cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-white">
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
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-900 leading-tight">RankBee</span>
                <span className="text-xs text-gray-600 font-medium">Professional SEO Tools</span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
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
              Tools
            </a>
            <Link href="/blogs" className="text-gray-600 hover:text-green-600 transition-colors">
              Features
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-green-600 transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-green-600 transition-colors">
              Contact
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>

          {/* Right Side - Search and Get Started */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Quick Search"
                className="pl-8 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-48 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                onChange={(e) => {
                  const searchTerm = e.target.value.toLowerCase().trim();
                  // Scroll to tools section and filter
                  const toolsSection = document.getElementById('tools');
                  if (toolsSection && searchTerm) {
                    setTimeout(() => {
                      toolsSection.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                    
                    // Filter tool cards
                    const toolCards = document.querySelectorAll('[data-tool-card]');
                    toolCards.forEach((card) => {
                      const element = card as HTMLElement;
                      const toolTitle = element.getAttribute('data-tool-title')?.toLowerCase() || '';
                      const toolDescription = element.getAttribute('data-tool-description')?.toLowerCase() || '';
                      const toolCategory = element.querySelector('[data-tool-category]')?.textContent?.toLowerCase() || '';
                      
                      if (toolTitle.includes(searchTerm) || toolDescription.includes(searchTerm) || toolCategory.includes(searchTerm)) {
                        element.style.display = 'block';
                        element.style.opacity = '1';
                        element.style.transform = 'scale(1)';
                      } else {
                        element.style.display = 'none';
                      }
                    });
                  } else if (!searchTerm) {
                    // Show all tools when search is cleared
                    const toolCards = document.querySelectorAll('[data-tool-card]');
                    toolCards.forEach((card) => {
                      const element = card as HTMLElement;
                      element.style.display = 'block';
                      element.style.opacity = '1';
                      element.style.transform = 'scale(1)';
                    });
                  }
                }}
              />
              <Search className="h-4 w-4 absolute left-2.5 top-2.5 text-gray-400" />
            </div>
            
            {isAuthenticated() ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 hover:bg-green-50">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="font-medium">{user?.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth">
                <Button className="mint-button">
                  Get Started
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-3">
              <a 
                href="#tools" 
                className="text-gray-600 hover:text-green-600 transition-colors cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  setIsMobileMenuOpen(false);
                  const toolsSection = document.getElementById('tools');
                  if (toolsSection) {
                    toolsSection.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    window.location.href = '/#tools';
                  }
                }}
              >
                Tools
              </a>
              <Link href="/blogs" className="text-gray-600 hover:text-green-600 transition-colors">
                SEO Guides
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-green-600 transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-green-600 transition-colors">
                Contact
              </Link>
              
              <div className="pt-2 border-t border-gray-200">
                {isAuthenticated() ? (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Signed in as {user?.name}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLogout}
                      className="w-full justify-start"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <Link href="/auth">
                    <Button className="w-full material-button-primary">
                      Sign In
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
