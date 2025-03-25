import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Search, Moon, User, Menu } from "lucide-react";
import MobileMenu from "./mobile-menu";
import SearchBar from "../common/search-bar";

const Header = () => {
  const [location] = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/news", label: "News" },
    { href: "/reviews", label: "Reviews" },
    { href: "#", label: "Videos" },
    { href: "#", label: "Forums" }
  ];

  return (
    <header className="bg-primary-950 border-b border-primary-900 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            {/* Logo */}
            <Link href="/">
              <a className="flex items-center">
                <span className="text-2xl font-bold font-sans text-white">GAME<span className="text-primary">PULSE</span></span>
              </a>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex ml-8 space-x-6">
              {navLinks.map((link) => (
                <Link key={link.label} href={link.href}>
                  <a className={`font-medium transition-colors ${location === link.href ? 'text-primary' : 'text-white hover:text-primary'}`}>
                    {link.label}
                  </a>
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Search Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-muted-foreground hover:text-white hover:bg-primary-900"
              onClick={toggleSearch}
            >
              <Search size={20} />
            </Button>
            
            {/* Theme Toggle - Dark Mode Only for this mockup */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-accent hover:text-white hover:bg-primary-900"
            >
              <Moon size={20} />
            </Button>
            
            {/* User Menu */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-muted-foreground hover:text-white hover:bg-primary-900"
            >
              <User size={20} />
            </Button>
            
            {/* Mobile Menu Toggle */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden text-muted-foreground hover:text-white hover:bg-primary-900"
              onClick={toggleMobileMenu}
            >
              <Menu size={20} />
            </Button>
          </div>
        </div>
        
        {/* Search Bar - Hidden by default */}
        {isSearchOpen && <SearchBar onClose={() => setIsSearchOpen(false)} />}
      </div>
      
      {/* Mobile Menu - Hidden by default */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
        links={navLinks}
      />
    </header>
  );
};

export default Header;
