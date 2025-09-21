import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthModal from "./AuthModal";
import UserAccountMenu from "./UserAccountMenu";
import { useAuth } from "@/contexts/AuthContext";
import { loginWithGoogle, logout } from "@/firebase";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [authModal, setAuthModal] = useState({ isOpen: false, userType: "student" as "student" | "hero" });
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const { user, login, logout: authLogout } = useAuth();

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/feedback", label: "Feedback" },
    { path: "/contact", label: "Contact" },
  ];

  const handleBookRideClick = async () => {
    if (!user) {
      // User not logged in, show login modal
      setAuthModal({ isOpen: true, userType: "student" });
    } else {
      // User is logged in, navigate to book ride
      navigate("/book-ride");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle("user");
      // The loginWithGoogle function will handle navigation
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = async () => {
    await logout();
    authLogout();
  };

  return (
    <nav className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">X</span>
          </div>
          <span className="font-bold text-xl">Campus X</span>
        </Link>

        <div className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <Button
                variant={location.pathname === item.path ? "default" : "ghost"}
                className="text-sm"
              >
                {item.label}
              </Button>
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center space-x-3">
          <Button 
            variant="hero" 
            size="lg" 
            className="text-sm font-semibold"
            onClick={handleBookRideClick}
          >
            Book Ride Now
          </Button>
          <Link to="/become-hero">
            <Button variant="secondary" size="default" className="text-sm">
              Become a Hero
            </Button>
          </Link>
          
          {user && (
            <>
              <span className="text-sm text-muted-foreground">
                Welcome, {user.name?.split(' ')[0]}
              </span>
              <Button 
                variant="outline" 
                size="default" 
                className="text-sm"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85%] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>
                  <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">X</span>
                    </div>
                    <span className="font-bold text-xl">Campus X</span>
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-2">
                {navItems.map((item) => (
                  <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)}>
                    <Button
                      variant={location.pathname === item.path ? "default" : "ghost"}
                      className="w-full justify-start"
                    >
                      {item.label}
                    </Button>
                  </Link>
                ))}
              </div>
              <div className="mt-6 grid grid-cols-1 gap-3">
                <Button 
                  variant="hero" 
                  size="lg" 
                  className="w-full"
                  onClick={() => { setMobileOpen(false); handleBookRideClick(); }}
                >
                  Book Ride Now
                </Button>
                <Link to="/become-hero" onClick={() => setMobileOpen(false)}>
                  <Button variant="secondary" size="lg" className="w-full">
                    Become a Hero
                  </Button>
                </Link>
                {user && (
                  <div className="pt-2 text-center">
                    <p className="text-sm text-muted-foreground mb-2">
                      Welcome, {user.name?.split(' ')[0]}
                    </p>
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="w-full"
                      onClick={() => { setMobileOpen(false); handleLogout(); }}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      
      <AuthModal 
        isOpen={authModal.isOpen}
        onClose={() => setAuthModal({ ...authModal, isOpen: false })}
        userType={authModal.userType}
      />
    </nav>
  );
};

export default Navigation;