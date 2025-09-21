import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Instagram, Twitter, Youtube, Mail, Phone } from "lucide-react";

const Footer = () => {
  const socialLinks = [
    {
      name: "Instagram",
      icon: Instagram,
      url: "https://instagram.com/campusx",
      color: "hover:text-pink-500"
    },
    {
      name: "X (Twitter)",
      icon: Twitter,
      url: "https://twitter.com/campusx",
      color: "hover:text-blue-400"
    },
    {
      name: "YouTube",
      icon: Youtube,
      url: "https://youtube.com/campusx",
      color: "hover:text-red-500"
    }
  ];

  return (
    <footer className="bg-card border-t mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">X</span>
              </div>
              <span className="font-bold text-xl">Campus X</span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-md">
              Your trusted campus transportation solution. Safe, affordable, and reliable rides 
              with fellow students across campus.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 bg-muted rounded-full flex items-center justify-center transition-all duration-200 hover:bg-primary ${social.color} hover:scale-110`}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link to="/book-ride" className="hover:text-primary transition-colors">
                  Book a Ride
                </Link>
              </li>
              <li>
                <Link to="/become-hero" className="hover:text-primary transition-colors">
                  Become a Hero
                </Link>
              </li>
              <li>
                <Link to="/driver-login" className="hover:text-primary transition-colors">
                  Driver Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link to="/about" className="hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/feedback" className="hover:text-primary transition-colors">
                  Feedback
                </Link>
              </li>
              <li>
                <a href="mailto:support@campusx.com" className="hover:text-primary transition-colors flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  Help Center
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0 text-center md:text-left">
          {/* Removed © text as requested */}
          <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Safety Guidelines</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
