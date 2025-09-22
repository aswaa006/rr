import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "./AuthModal";

const FloatingCTA = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [authModal, setAuthModal] = useState({ isOpen: false, userType: "student" as "student" | "hero" });
  const [rippleStyle, setRippleStyle] = useState<React.CSSProperties | null>(null);

  const handleBookRideClick = (e: React.MouseEvent) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setRippleStyle({ top: y, left: x, width: rect.width, height: rect.height });
    setTimeout(() => setRippleStyle(null), 600);

    if (!user) {
      setAuthModal({ isOpen: true, userType: "student" });
    } else {
      navigate("/book-ride");
    }
  };

  return (
    <>
      <div className="floating-cta fixed bottom-14 right-14 z-50">
        <Button
          variant="cta"
          size="xl"
          onClick={handleBookRideClick}
          className="relative rounded-full overflow-hidden px-10 py-5 font-bold text-black shadow-2xl
            animate-gradient-breathing shadow-glow hover:shadow-glow-hover
            transition-shadow duration-500 ease-in-out select-none"
          aria-label="Book Ride Now"
        >
          Book Ride Now
          {rippleStyle && (
            <span
              className="ripple absolute bg-yellow-400 bg-opacity-40 rounded-full animate-ripple"
              style={{
                top: rippleStyle.top,
                left: rippleStyle.left,
                width: rippleStyle.width,
                height: rippleStyle.height,
                pointerEvents: "none",
              }}
            />
          )}
        </Button>
      </div>

      <AuthModal
        isOpen={authModal.isOpen}
        onClose={() => setAuthModal({ ...authModal, isOpen: false })}
        userType={authModal.userType}
      />

      <style>{`
        @keyframes ripple {
          0% {
            transform: scale(0);
            opacity: 0.6;
          }
          100% {
            transform: scale(2.5);
            opacity: 0;
          }
        }
        .animate-ripple {
          animation: ripple 0.6s ease-out;
        }
        @keyframes gradientMove {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        @keyframes breathe {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.06);
          }
        }
        .animate-gradient-breathing {
          background: linear-gradient(270deg, black, orange, yellow, orange, black);
          background-size: 300% 300%;
          animation: gradientMove 12s ease infinite, breathe 3s ease-in-out infinite;
        }
        .shadow-glow {
          box-shadow:
            0 0 10px 5px rgba(255, 165, 0, 0.9),
            0 0 20px 15px rgba(255, 223, 0, 0.7);
        }
        .shadow-glow-hover {
          box-shadow:
            0 0 20px 10px rgba(255, 165, 0, 1),
            0 0 40px 25px rgba(255, 223, 0, 0.9);
        }
      `}</style>
    </>
  );
};

export default FloatingCTA;
