import Navigation from "@/components/Navigation";
import FloatingCTA from "@/components/FloatingCTA";
import SafetySection from "@/components/SafetySection";
import Footer from "@/components/Footer";
import AuthTest from "@/components/AuthTest";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { MapPin, Users, Wallet } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import AuthModal from "@/components/AuthModal";
import Bike from "@/components/ui/bike";


const Index = () => {
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
    <div className="min-h-screen bg-background">
      <Navigation />
      <FloatingCTA />
      
      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 lg:py-20 px-4 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
            <div className="fade-in order-2 lg:order-1">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-4 sm:mb-6">
                Your Ride, Your Campus, Your Price – 
                <span className="text-primary block sm:inline"> Just ₹30</span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-6 sm:mb-8 leading-relaxed">
                Hop on with our Heroes and travel anywhere inside campus easily. 
                Safe, affordable, and always available.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button 
                  variant="hero" 
                  size="xl" 
                  className="w-full sm:w-auto text-base sm:text-lg"
                  onClick={handleBookRideClick}
                >
                  Book Ride Now!
                </Button>
                <Link to="/become-hero" className="w-full sm:w-auto">
                  <Button variant="secondary" size="xl" className="w-full text-base sm:text-lg">
                    Become a Hero
                  </Button>
                </Link>
              </div>
            </div>
            <div className="slide-up order-1 lg:order-2">
              <img 
                src={heroImage} 
                alt="Campus bike taxi service with friendly student drivers"
                className="rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl w-full h-auto max-w-md mx-auto lg:max-w-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-12 sm:py-16 lg:py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 sm:mb-16 fade-in">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">Why Choose Campus X?</h2>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground">Simple, safe, and student-friendly transportation</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <Card className="slide-up border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wallet className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Affordable Rides</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-base leading-relaxed">
                  Fixed ₹30 fare anywhere inside campus. No surge pricing, no hidden costs. 
                  Budget-friendly rides for every student.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="slide-up border-2 hover:border-secondary/50 transition-all duration-300 hover:shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-secondary" />
                </div>
                <CardTitle className="text-2xl">Student Heroes</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-base leading-relaxed">
                  Friendly riders from your college community. Trusted, reliable, 
                  and always ready to help fellow students.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="slide-up border-2 hover:border-success/50 transition-all duration-300 hover:shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-success" />
                </div>
                <CardTitle className="text-2xl">Pre-Book & Save</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-base leading-relaxed">
                  Book ahead and save ₹5 instantly. Plan your rides and 
                  enjoy guaranteed availability at discounted rates.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="fade-in">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">Ready to Start Your Journey?</h2>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-6 sm:mb-8">
              Join thousands of students who trust Campus X for their daily commute
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Button 
                variant="hero" 
                size="xl" 
                className="w-full sm:w-auto text-base sm:text-lg"
                onClick={handleBookRideClick}
              >
                Book Your First Ride
              </Button>
              <Link to="/become-hero" className="w-full sm:w-auto">
                <Button variant="secondary" size="xl" className="w-full text-base sm:text-lg">
                  Become a Hero
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Debug Auth Test - Remove this after testing */}
      
      
      <SafetySection />
      <Footer />
      
      <AuthModal 
        isOpen={authModal.isOpen}
        onClose={() => setAuthModal({ ...authModal, isOpen: false })}
        userType={authModal.userType}
      />
    </div>
  );
};

export default Index;
