import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import AuthModal from "./AuthModal";

const FloatingCTA = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [authModal, setAuthModal] = useState({ isOpen: false, userType: "student" as "student" | "hero" });

  const handleBookRideClick = () => {
    if (!user) {
      // User not logged in, show login modal
      setAuthModal({ isOpen: true, userType: "student" });
    } else {
      // User is logged in, navigate to book ride
      navigate("/book-ride");
    }
  };

  return (
    <>
      <div className="floating-cta">
        <Button 
          variant="cta" 
          size="xl" 
          className="rounded-full shadow-2xl"
          onClick={handleBookRideClick}
        >
          Book Ride Now
        </Button>
      </div>
      
      <AuthModal 
        isOpen={authModal.isOpen}
        onClose={() => setAuthModal({ ...authModal, isOpen: false })}
        userType={authModal.userType}
      />
    </>
  );
};

export default FloatingCTA;