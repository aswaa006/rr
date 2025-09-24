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
      setAuthModal({ isOpen: true, userType: "student" });
    } else {
      navigate("/book-ride");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle("user");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = async () => {
    await logout();
    authLogout();
  };

  return (
    <>
      {/* Animated Gradient + Glassmorphism CSS + Active Underline + Hover Bloom */}
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
          min-height: 76px;                /* More breadth for desktop */
          box-shadow: 0 8px 32px 0 rgba(31,38,135,0.14);
          border-radius: 20px;
          margin-top: 16px;
          margin-bottom: 24px;
          padding-left: 28px;
          padding-right: 28px;
          max-width: 1420px;              /* Increased width for desktop */
          transition: box-shadow 0.3s;
          position: relative;
        }
        @media (max-width: 900px) {
          .animated-navbar {
            border-radius: 12px;
            margin: 0;
            max-width: 100vw;
            padding-left: 16px;
            padding-right: 16px;
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
        }
        .navbar-btn {
          position: relative;
          background: transparent;
          border: none;
          outline: none;
          transition: color 0.2s, transform 0.25s ease, box-shadow 0.25s ease;
          cursor: pointer;
          padding: 0.5rem 1.25rem;
          border-radius: 9999px; /* fully rounded */
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
      `}</style>

      <div className="glass-background w-full flex justify-center">
        <nav className="sticky top-0 z-40 w-full animated-navbar">
          <div className="h-20 flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">X</span>
              </div>
              <span className="font-bold text-2xl">Campus X</span>
            </Link>

            <div className="hidden md:flex items-center space-x-2 navbar-btn-group">
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

            <div className="hidden md:flex items-center space-x-4">
              <Button
                variant="hero"
                size="lg"
                className="text-md font-semibold px-6 py-2 rounded-full"
                onClick={handleBookRideClick}
              >
                Book Ride Now
              </Button>
              <Link to="/become-hero">
                <Button variant="secondary" size="default" className="text-md px-5 py-2 rounded-full">
                  Become a Hero
                </Button>
              </Link>
              {user && (
                <>
                  <span className="text-md text-muted-foreground">Welcome, {user.name?.split(" ")[0]}</span>
                  <Button
                    variant="outline"
                    size="default"
                    className="text-md px-5 py-2 rounded-full"
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
                      onClick={() => {
                        setMobileOpen(false);
                        handleBookRideClick();
                      }}
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
