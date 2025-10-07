import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthModal from "./AuthModal";
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
      setAuthModal({ isOpen: true, userType: "student" });
    } else {
      navigate("/book-ride");
    }
  };


  const handleLogout = async () => {
    await logout();
    authLogout();
  };


  return (
    <>
      <style>{`
        @keyframes colorScroll {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        .animated-navbar {
          background: linear-gradient(
            90deg,
            #ff9800 0%,
            #ffe066 28%,
            #faf9f6 50%,
            #ffe066 75%,
            #ff9800 100%
          );
          background-size: 200% 100%;
          animation: colorScroll 12s linear infinite;
          min-height: 76px;
          box-shadow: 0 8px 32px 0 rgba(31,38,135,0.14);
          border-radius: 20px;
          margin-top: 16px;
          margin-bottom: 24px;
          padding-left: 28px;
          padding-right: 28px;
          max-width: 1420px;
          transition: box-shadow 0.3s;
          position: relative;
        }
        @media (max-width: 1024px) {
          .animated-navbar {
            border-radius: 12px;
            margin: 8px;
            max-width: calc(100vw - 16px);
            padding-left: 16px;
            padding-right: 16px;
            min-height: 64px;
          }
        }
        @media (max-width: 640px) {
          .animated-navbar {
            border-radius: 8px;
            margin: 4px;
            max-width: calc(100vw - 8px);
            padding-left: 12px;
            padding-right: 12px;
            min-height: 56px;
          }
        }
        .glass-background {
          background: rgba(255,255,255,0.18);
          border-radius: 24px;
          box-shadow: 0 8px 32px 0 rgba(31,38,135,0.16);
          backdrop-filter: blur(8px);
          border: 1.5px solid rgba(255,255,255,0.22);
          padding-top: 0;
          padding-bottom: 0;
        }
        .navbar-btn-group {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .navbar-btn {
          position: relative;
          background: transparent;
          border: none;
          outline: none;
          transition: color 0.2s, transform 0.25s ease, box-shadow 0.25s ease;
          cursor: pointer;
          padding: 0.5rem 1.25rem;
          border-radius: 9999px;
          font-weight: 500;
          user-select: none;
        }
        .navbar-btn.active::after {
          content: "";
          position: absolute;
          left: 24px;
          bottom: 8px;
          width: calc(100% - 48px);
          height: 3px;
          background: linear-gradient(90deg, #ff9800, #fff, #ffe066);
          box-shadow: 0 0 16px #ff9800a0;
          opacity: 0.8;
          border-radius: 2px;
          animation: underline-animate 0.4s;
          pointer-events: none;
        }
        .navbar-btn:hover {
          transform: scale(1.15);
          box-shadow: 0 0 12px #ff9800cc;
          color: #ff6f00;
          z-index: 10;
        }
        @keyframes underline-animate {
          0% {
            width: 0;
            opacity: 0.1;
          }
          100% {
            width: calc(100% - 48px);
            opacity: 0.8;
          }
        }
        @media (max-width: 1023px) {
          .navbar-btn-group {
            display: none !important;
          }
          .desktop-actions {
            display: none !important;
          }
        }
        @media (min-width: 1024px) {
          .mobile-logo-title {
            display: none !important;
          }
        }
      `}</style>
      <div className="glass-background w-full flex justify-center">
        <nav className="sticky top-0 z-40 w-full animated-navbar">
          <div className="h-14 sm:h-20 grid grid-cols-12 items-center">
            {/* Desktop logo + title (left) */}
            <Link 
              to="/" 
              className="hidden lg:flex items-center space-x-2 col-span-2"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm sm:text-lg">X</span>
              </div>
              <span className="font-bold text-lg sm:text-2xl">PUGO</span>
            </Link>
            {/* Center nav buttons (desktop only) */}
            <div className="navbar-btn-group col-span-6">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path} tabIndex={-1}>
                  <button
                    className={`navbar-btn text-md ${
                      location.pathname === item.path ? "active" : ""
                    }`}
                    type="button"
                  >
                    {item.label}
                  </button>
                </Link>
              ))}
            </div>
            {/* Desktop right actions */}
            <div className="desktop-actions hidden lg:flex items-center space-x-2 xl:space-x-4 col-span-4 justify-end">
              <Button
                variant="hero"
                size="lg"
                className="text-sm xl:text-md font-semibold px-4 xl:px-6 py-2 rounded-full"
                onClick={handleBookRideClick}
              >
                <span className="hidden xl:inline">Book Ride Now</span>
                <span className="xl:hidden">Book Ride</span>
              </Button>
              <Button 
                variant="secondary" 
                size="default" 
                className="text-sm xl:text-md px-3 xl:px-5 py-2 rounded-full"
                onClick={() => navigate("/hero-login")}
              >
                <span className="hidden xl:inline">Hero Login</span>
                <span className="xl:hidden">Hero Login</span>
              </Button>
              {user && (
                <>
                  <span className="text-sm xl:text-md text-muted-foreground hidden xl:inline">Welcome, {user.name?.split(" ")[0]}</span>
                  <Button
                    variant="outline"
                    size="default"
                    className="text-sm xl:text-md px-3 xl:px-5 py-2 rounded-full"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 xl:mr-2" />
                    <span className="hidden xl:inline">Sign Out</span>
                  </Button>
                </>
              )}
            </div>


            {/* Mobile: logo+title centered, hamburger right */}
            <div className="mobile-logo-title lg:hidden col-span-8 flex items-center justify-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">X</span>
                </div>
                <span className="font-bold text-xl">PUGO</span>
              </Link>
            </div>
            <div className="lg:hidden col-span-4 flex justify-end">
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <button
                    type="button"
                    aria-label="Open main menu"
                    aria-haspopup="true"
                    aria-controls="mobile-menu"
                    aria-expanded={mobileOpen}
                    onClick={() => setMobileOpen((v) => !v)}
                    className="relative h-10 w-10 inline-flex items-center justify-center rounded-md transition focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <span className="sr-only">Toggle menu</span>
                    <span
                      className={`block absolute h-[2px] w-6 bg-foreground transition-transform duration-300 ease-in-out ${
                        mobileOpen ? "translate-y-0 rotate-45" : "-translate-y-2"
                      }`}
                    />
                    <span
                      className={`block absolute h-[2px] w-6 bg-foreground transition-all duration-300 ease-in-out ${
                        mobileOpen ? "opacity-0" : "opacity-100"
                      }`}
                    />
                    <span
                      className={`block absolute h-[2px] w-6 bg-foreground transition-transform duration-300 ease-in-out ${
                        mobileOpen ? "translate-y-0 -rotate-45" : "translate-y-2"
                      }`}
                    />
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[90%] sm:w-[400px] max-w-[400px]" id="mobile-menu">
                  <SheetHeader>
                    <SheetTitle>
                      <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-lg">X</span>
                        </div>
                        <span className="font-bold text-xl">PUGO</span>
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
                      onClick={() => {
                        setMobileOpen(false);
                        handleBookRideClick();
                      }}
                    >
                      Book Ride Now
                    </Button>
                    <Button 
                      variant="secondary" 
                      size="lg" 
                      className="w-full"
                      onClick={() => {
                        setMobileOpen(false);
                        navigate("/hero-login");
                      }}
                    >
                      Hero Login
                    </Button>
                    {user && (
                      <div className="pt-2 text-center">
                        <p className="text-sm text-muted-foreground mb-2">Welcome, {user.name?.split(" ")[0]}</p>
                        <Button
                          variant="outline"
                          size="lg"
                          className="w-full"
                          onClick={() => {
                            setMobileOpen(false);
                            handleLogout();
                          }}
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
      </div>
    </>
  );
};


export default Navigation;
