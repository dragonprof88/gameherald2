import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  Twitter, 
  Facebook, 
  Instagram, 
  Youtube, 
  MessageSquare 
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary-950 text-muted-foreground pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/">
              <a className="flex items-center mb-4">
                <span className="text-xl font-bold font-sans text-white">GAME<span className="text-primary">PULSE</span></span>
              </a>
            </Link>
            <p className="mb-4">
              Your source for the latest gaming news, reviews, and industry insights.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                <Twitter size={20} />
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                <Facebook size={20} />
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                <Instagram size={20} />
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                <Youtube size={20} />
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                <MessageSquare size={20} />
              </Button>
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-bold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li><Link href="/"><a className="hover:text-primary transition-colors">Home</a></Link></li>
              <li><Link href="/news"><a className="hover:text-primary transition-colors">News</a></Link></li>
              <li><Link href="/reviews"><a className="hover:text-primary transition-colors">Reviews</a></Link></li>
              <li><a href="#" className="hover:text-primary transition-colors">Videos</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Forums</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-bold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><Link href="/news?category=pc"><a className="hover:text-primary transition-colors">PC Gaming</a></Link></li>
              <li><Link href="/news?category=console"><a className="hover:text-primary transition-colors">PlayStation</a></Link></li>
              <li><Link href="/news?category=console"><a className="hover:text-primary transition-colors">Xbox</a></Link></li>
              <li><Link href="/news?category=console"><a className="hover:text-primary transition-colors">Nintendo</a></Link></li>
              <li><Link href="/news?category=mobile"><a className="hover:text-primary transition-colors">Mobile Gaming</a></Link></li>
              <li><Link href="/news?category=esports"><a className="hover:text-primary transition-colors">Esports</a></Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-bold mb-4">About Us</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-primary transition-colors">About GamePulse</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Our Team</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Advertise</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-primary-900 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>&copy; {new Date().getFullYear()} GamePulse. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-sm hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="text-sm hover:text-primary transition-colors">Terms of Service</a>
              <a href="#" className="text-sm hover:text-primary transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
