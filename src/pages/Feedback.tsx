import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Navigation from "@/components/Navigation";
import FloatingCTA from "@/components/FloatingCTA";
import { TransitionPage, FadeIn, SlideIn, HoverScale, HoverShadow } from "@/components/animations";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Star, ThumbsUp } from "lucide-react";
import { submitFeedback } from "@/services/supabaseService";

const Feedback = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    driverBehaviorRating: 0,
    serviceRating: 0,
    websiteAccessibilityRating: 0,
    suggestions: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.driverBehaviorRating === 0 || formData.serviceRating === 0 || formData.websiteAccessibilityRating === 0) {
      toast({
        title: "Rating Required",
        description: "Please provide ratings for all categories before submitting.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Get current user ID from localStorage or auth
      const userData = localStorage.getItem("user");
      let userId = null;
      if (userData) {
        try {
          userId = JSON.parse(userData).id;
        } catch (error) {
          console.error("Error parsing user data:", error);
          localStorage.removeItem("user");
        }
      }
      
      const result = await submitFeedback({
        userId: userId || 'anonymous',
        name: formData.name,
        email: formData.email,
        rating: Math.round((formData.driverBehaviorRating + formData.serviceRating + formData.websiteAccessibilityRating) / 3),
        message: formData.suggestions
      });
      
      if (result.success) {
        setSubmitted(true);
        toast({
          title: "Feedback Submitted!",
          description: "Thank you for helping us improve PUGO.",
        });
      } else {
        toast({
          title: "Submission Failed",
          description: result.error || "Please try again later.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Feedback submission error:", error);
      toast({
        title: "Submission Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const StarRating = ({ category, rating, onRatingChange }: { category: string, rating: number, onRatingChange: (rating: number) => void }) => {
    return (
      <div className="space-y-2">
        <Label className="text-sm font-medium">{category}</Label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onRatingChange(star)}
              className={`text-2xl transition-colors ${
                star <= rating ? "text-yellow-500" : "text-gray-300"
              } hover:text-yellow-500`}
            >
              <Star className={`w-6 h-6 ${star <= rating ? "fill-current" : ""}`} />
            </button>
          ))}
        </div>
        <span className="text-xs text-muted-foreground">
          {rating > 0 ? `${rating}/5 stars` : "Select rating"}
        </span>
      </div>
    );
  };

  if (submitted) {
    return (
      <TransitionPage>
      <div className="min-h-screen bg-background">
        <Navigation />
        <FloatingCTA />
        
        <div className="container mx-auto max-w-2xl px-4 py-12">
          <FadeIn>
          <div className="text-center">
            <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <ThumbsUp className="w-12 h-12 text-success" />
            </div>
            <h1 className="text-4xl font-bold mb-4 text-success">Thank You!</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Your feedback has been submitted successfully. We appreciate you taking 
              the time to help us improve PUGO.
            </p>
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mb-8">
              <h3 className="font-semibold mb-2">Your Feedback Summary</h3>
              <div className="text-left space-y-2">
                <p><span className="font-medium">Driver Behavior:</span> {formData.driverBehaviorRating}/5 stars</p>
                <p><span className="font-medium">Service Rating:</span> {formData.serviceRating}/5 stars</p>
                <p><span className="font-medium">Website Accessibility:</span> {formData.websiteAccessibilityRating}/5 stars</p>
                <p><span className="font-medium">Name:</span> {formData.name}</p>
                <p><span className="font-medium">Email:</span> {formData.email}</p>
              </div>
            </div>
            <HoverScale><HoverShadow>
            <Button variant="hero" size="lg" onClick={() => setSubmitted(false)}>
              Submit Another Feedback
            </Button>
            </HoverShadow></HoverScale>
          </div>
          </FadeIn>
        </div>
      </div>
      </TransitionPage>
    );
  }

  return (
    <TransitionPage>
    <div className="min-h-screen bg-background">
      <Navigation />
      <FloatingCTA />
      
      <div className="container mx-auto max-w-2xl px-4 py-12">
        <FadeIn>
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Share Your Feedback</h1>
          <p className="text-xl text-muted-foreground">
            Help us improve your PUGO experience
          </p>
        </div>
        </FadeIn>

        <SlideIn direction="up">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              Your Experience Matters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Your name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-6">
                <StarRating 
                  category="Driver Behavior" 
                  rating={formData.driverBehaviorRating} 
                  onRatingChange={(rating) => handleInputChange("driverBehaviorRating", rating)} 
                />
                
                <StarRating 
                  category="Service Rating" 
                  rating={formData.serviceRating} 
                  onRatingChange={(rating) => handleInputChange("serviceRating", rating)} 
                />
                
                <StarRating 
                  category="Website Accessibility" 
                  rating={formData.websiteAccessibilityRating} 
                  onRatingChange={(rating) => handleInputChange("websiteAccessibilityRating", rating)} 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="suggestions">Suggestions</Label>
                <Textarea
                  id="suggestions"
                  value={formData.suggestions}
                  onChange={(e) => handleInputChange("suggestions", e.target.value)}
                  placeholder="Tell us about your experience with PUGO. What did you like? What can we improve?"
                  rows={5}
                  required
                />
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">We'd love to hear about:</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Your ride experience</li>
                  <li>• Hero service quality</li>
                  <li>• App usability</li>
                  <li>• Suggestions for improvement</li>
                </ul>
              </div>

              <HoverScale><HoverShadow>
              <Button 
                type="submit" 
                variant="hero" 
                size="xl" 
                className="w-full"
                disabled={!formData.name || !formData.email || !formData.suggestions || formData.driverBehaviorRating === 0 || formData.serviceRating === 0 || formData.websiteAccessibilityRating === 0 || isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Feedback"}
              </Button>
              </HoverShadow></HoverScale>
            </form>
          </CardContent>
        </Card>
        </SlideIn>
      </div>
    </div>
    </TransitionPage>
  );
};

export default Feedback;