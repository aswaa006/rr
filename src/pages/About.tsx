import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import FloatingCTA from "@/components/FloatingCTA";
import { Link, useNavigate } from "react-router-dom";
import { Users, Target, Heart, Award } from "lucide-react";
import Bike from "@/components/ui/bike";
import { TransitionPage, FadeIn, SlideIn, HoverScale, HoverShadow } from "@/components/animations";
import CountUp from "@/components/animations/CountUp";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import AuthModal from "@/components/AuthModal";

const About = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [authModal, setAuthModal] = useState({ isOpen: false, userType: "student" as "student" | "hero" });

  const handleStartRidingClick = () => {
    if (!user) {
      // User not logged in, show login modal
      setAuthModal({ isOpen: true, userType: "student" });
    } else {
      // User is logged in, navigate to book ride
      navigate("/book-ride");
    }
  };

  const handleBecomeHeroClick = () => {
    // Navigate to hero login page
    navigate("/hero-login");
  };
  return (
    <TransitionPage>
    <div className="min-h-screen bg-background">
      <Navigation />
      <FloatingCTA />

      {/* Hero Section */}
      <section className="py-16 sm:py-20 px-4 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="container mx-auto max-w-4xl text-center">
          <FadeIn>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 sm:mb-6">
              About <span className="text-primary">PUGO</span>
            </h1>
            <p className="text-base sm:text-xl text-muted-foreground leading-relaxed">
              A student-led initiative revolutionizing campus transportation through 
              community, affordability, and trust.
            </p>
          </FadeIn>
          {/* Bike animation centered here */}
          <div style={{ margin: "32px 0" }}>
            <Bike />
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-12 sm:py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <SlideIn direction="up">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Our Mission</h2>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6">
                PUGO was born from a simple observation: students needed affordable, 
                reliable transportation within campus. Traditional solutions were either 
                too expensive or inconvenient.
              </p>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                We bridge this gap by connecting students who need rides with fellow 
                students who can provide them, creating a sustainable ecosystem that 
                benefits everyone in our community.
              </p>
            </SlideIn>
            
            <SlideIn direction="up" delay={0.08}>
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  <div>
                    <div className="text-4xl font-bold text-primary">₹<CountUp to={30} duration={1.1} /></div>
                    <p className="text-muted-foreground">Fixed fare anywhere</p>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-secondary"><CountUp to={500} duration={1.1} />+</div>
                    <p className="text-muted-foreground">Happy riders</p>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-success"><CountUp to={100} duration={1.1} />+</div>
                    <p className="text-muted-foreground">Student Heroes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            </SlideIn>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12 sm:py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <FadeIn>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4">Our Values</h2>
            <p className="text-base sm:text-xl text-muted-foreground">
              The principles that drive everything we do
            </p>
          </div>
          </FadeIn>
          
          <div className="grid md:grid-cols-3 gap-8">
            <SlideIn direction="up"><HoverScale><HoverShadow>
            <Card className="border-2 hover:border-primary/50 transition-all duration-300">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Community First</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground leading-relaxed">
                  We believe in the power of student community. Every ride strengthens 
                  the bonds between fellow students and creates lasting friendships.
                </p>
              </CardContent>
            </Card>
            </HoverShadow></HoverScale></SlideIn>

            <SlideIn direction="up" delay={0.06}><HoverScale><HoverShadow>
            <Card className="border-2 hover:border-secondary/50 transition-all duration-300">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-secondary" />
                </div>
                <CardTitle className="text-xl">Trust & Safety</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground leading-relaxed">
                  Safety is non-negotiable. All our Heroes are verified students, 
                  and every ride is tracked for complete peace of mind.
                </p>
              </CardContent>
            </Card>
            </HoverShadow></HoverScale></SlideIn>

            <SlideIn direction="up" delay={0.12}><HoverScale><HoverShadow>
            <Card className="border-2 hover:border-success/50 transition-all duration-300">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-success" />
                </div>
                <CardTitle className="text-xl">Excellence</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground leading-relaxed">
                  We strive for excellence in every interaction. From our Heroes' 
                  service to our platform's reliability, quality is our commitment.
                </p>
              </CardContent>
            </Card>
            </HoverShadow></HoverScale></SlideIn>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-12 sm:py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <FadeIn>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4">The Story Behind PUGO</h2>
            <p className="text-base sm:text-xl text-muted-foreground">
              Founded by students, for students
            </p>
          </div>
          </FadeIn>
          
          <SlideIn direction="up">
          <Card className="shadow-lg">
            <CardContent className="p-6 sm:p-8">
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6">
                PUGO started when a group of computer science students realized 
                that getting around campus was a daily struggle for many. Late for 
                classes, missing important events, or simply tired from long walks 
                between distant buildings.
              </p>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6">
                What began as a simple WhatsApp group for sharing rides quickly grew 
                into something bigger. We saw the potential to create a platform that 
                not only solved transportation problems but also built community and 
                provided earning opportunities for student drivers.
              </p>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                Today, PUGO is more than just a ride-sharing service. It's a 
                testament to what students can achieve when they come together to 
                solve real problems with innovative solutions.
              </p>
            </CardContent>
          </Card>
          </SlideIn>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 px-4 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="container mx-auto max-w-4xl text-center">
          <FadeIn>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6">Join Our Mission</h2>
            <p className="text-base sm:text-xl text-muted-foreground mb-6 sm:mb-8">
              Be part of the PUGO community and help us make campus transportation 
              better for everyone
            </p>
            {/* Fixed mobile responsive button styles here */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <HoverScale><HoverShadow>
              <Button variant="hero" size="xl" className="w-full" onClick={handleStartRidingClick}>
                Start Riding
              </Button>
              </HoverShadow></HoverScale>
              <HoverScale><HoverShadow>
              <Button variant="secondary" size="xl" className="w-full" onClick={handleBecomeHeroClick}>
                Become a Hero
              </Button>
              </HoverShadow></HoverScale>
            </div>
          </FadeIn>
        </div>
      </section>
      
      <AuthModal 
        isOpen={authModal.isOpen}
        onClose={() => setAuthModal({ ...authModal, isOpen: false })}
        userType={authModal.userType}
      />
    </div>
    </TransitionPage>
  );
};

export default About;
