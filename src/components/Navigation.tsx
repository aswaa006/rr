import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import AuthModal from "./AuthModal";
import UserAccountMenu from "./UserAccountMenu";

const Navigation = () => {
  const location = useLocation();
  const [authModal, setAuthModal] = useState({ isOpen: false, userType: "student" as "student" | "hero" });
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // This will be replaced with actual auth state from Supabase
  const [user, setUser] = useState<{ name: string; type: "student" | "hero" } | null>(null);

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/feedback", label: "Feedback" },
    { path: "/contact", label: "Contact" },
  ];

  const handleAuthOpen = (userType: "student" | "hero") => {
    setAuthModal({ isOpen: true, userType });
  };

  const handleLogout = () => {
    setUser(null);
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
          <Link to="/book-ride">
            <Button variant="hero" size="lg" className="text-sm font-semibold">
              Book Ride Now
            </Button>
          </Link>
          <Link to="/become-hero">
            <Button variant="secondary" size="default" className="text-sm">
              Become a Hero
            </Button>
          </Link>
          
          {user ? (
            <>
              {user.type === "hero" && (
                <Link to="/driver-login">
                  <Button variant="secondary" size="default" className="text-sm">
                    Driver Dashboard
                  </Button>
                </Link>
              )}
              <UserAccountMenu 
                userType={user.type} 
                userName={user.name} 
                onLogout={handleLogout}
              />
            </>
          ) : (
            <>
              <Button 
                variant="secondary" 
                size="default" 
                className="text-sm"
                onClick={() => handleAuthOpen("student")}
              >
                Student Login
              </Button>
              <Link to="/driver-login">
                <Button 
                  variant="outline" 
                  size="default" 
                  className="text-sm"
                >
                  Hero Login
                </Button>
              </Link>
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
                <Link to="/book-ride" onClick={() => setMobileOpen(false)}>
                  <Button variant="hero" size="lg" className="w-full">
                    Book Ride Now
                  </Button>
                </Link>
                <Link to="/become-hero" onClick={() => setMobileOpen(false)}>
                  <Button variant="secondary" size="lg" className="w-full">
                    Become a Hero
                  </Button>
                </Link>
                {user ? (
                  <>
                    {user.type === "hero" && (
                      <Link to="/driver-login" onClick={() => setMobileOpen(false)}>
                        <Button variant="secondary" size="lg" className="w-full">
                          Driver Dashboard
                        </Button>
                      </Link>
                    )}
                    <div className="pt-2">
                      <UserAccountMenu 
                        userType={user.type} 
                        userName={user.name} 
                        onLogout={() => { handleLogout(); setMobileOpen(false); }}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <Button 
                      variant="secondary" 
                      size="lg" 
                      className="w-full"
                      onClick={() => { setMobileOpen(false); handleAuthOpen("student"); }}
                    >
                      Student Login
                    </Button>
                    <Link to="/driver-login" onClick={() => setMobileOpen(false)}>
                      <Button 
                        variant="outline" 
                        size="lg" 
                        className="w-full"
                      >
                        Hero Login
                      </Button>
                    </Link>
                  </>
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