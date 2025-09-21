import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Navigation from "@/components/Navigation";
import FloatingCTA from "@/components/FloatingCTA";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Star, ThumbsUp } from "lucide-react";

const Feedback = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rating: 0,
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating before submitting.",
        variant: "destructive",
      });
      return;
    }
    
    setSubmitted(true);
    toast({
      title: "Feedback Submitted!",
      description: "Thank you for helping us improve Campus X.",
    });
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const StarRating = () => {
    return (
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleInputChange("rating", star)}
            className={`text-2xl transition-colors ${
              star <= formData.rating ? "text-yellow-500" : "text-gray-300"
            } hover:text-yellow-500`}
          >
            <Star className={`w-8 h-8 ${star <= formData.rating ? "fill-current" : ""}`} />
          </button>
        ))}
      </div>
    );
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <FloatingCTA />
        
        <div className="container mx-auto max-w-2xl px-4 py-12">
          <div className="fade-in text-center">
            <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <ThumbsUp className="w-12 h-12 text-success" />
            </div>
            <h1 className="text-4xl font-bold mb-4 text-success">Thank You!</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Your feedback has been submitted successfully. We appreciate you taking 
              the time to help us improve Campus X.
            </p>
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mb-8">
              <h3 className="font-semibold mb-2">Your Feedback Summary</h3>
              <div className="text-left space-y-2">
                <p><span className="font-medium">Rating:</span> {formData.rating}/5 stars</p>
                <p><span className="font-medium">Name:</span> {formData.name}</p>
                <p><span className="font-medium">Email:</span> {formData.email}</p>
              </div>
            </div>
            <Button variant="hero" size="lg" onClick={() => setSubmitted(false)}>
              Submit Another Feedback
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <FloatingCTA />
      
      <div className="container mx-auto max-w-2xl px-4 py-12">
        <div className="fade-in text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Share Your Feedback</h1>
          <p className="text-xl text-muted-foreground">
            Help us improve your Campus X experience
          </p>
        </div>

        <Card className="slide-up shadow-lg">
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

              <div className="space-y-3">
                <Label>Overall Rating</Label>
                <div className="flex items-center gap-4">
                  <StarRating />
                  <span className="text-sm text-muted-foreground">
                    {formData.rating > 0 ? `${formData.rating}/5 stars` : "Select rating"}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Your Feedback</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  placeholder="Tell us about your experience with Campus X. What did you like? What can we improve?"
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

              <Button 
                type="submit" 
                variant="hero" 
                size="xl" 
                className="w-full"
                disabled={!formData.name || !formData.email || !formData.message}
              >
                Submit Feedback
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Feedback;