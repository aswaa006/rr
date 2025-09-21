import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import Navigation from "@/components/Navigation";
import FloatingCTA from "@/components/FloatingCTA";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { User, Phone, Car, Clock, Shield } from "lucide-react";

const HeroRegistration = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    vehicleType: "",
    vehicleNumber: "",
    collegeId: "",
    agreed: false
  });
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreed) {
      toast({
        title: "Agreement Required",
        description: "Please agree to the terms and conditions.",
        variant: "destructive",
      });
      return;
    }
    
    setSubmitted(true);
    toast({
      title: "Application Submitted!",
      description: "We'll review your application and get back to you soon.",
    });
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <FloatingCTA />
        
        <div className="container mx-auto max-w-2xl px-4 py-8 sm:py-12">
          <div className="fade-in text-center">
            <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-12 h-12 text-success" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 text-success">Application Submitted!</h1>
            <p className="text-base sm:text-xl text-muted-foreground mb-6 sm:mb-8">
              Thank you for your interest in becoming a Campus X Hero. We will review your application and contact you within 24-48 hours.
            </p>
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mb-8">
              <h3 className="font-semibold mb-2">What's Next?</h3>
              <ul className="text-left space-y-2 text-muted-foreground">
                <li>• Document verification</li>
                <li>• Vehicle inspection</li>
                <li>• Brief orientation session</li>
                <li>• Start earning as a Hero!</li>
              </ul>
            </div>
            <Button variant="hero" size="lg" onClick={() => setSubmitted(false)}>
              Submit Another Application
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <FloatingCTA />
      
      <div className="container mx-auto max-w-2xl px-4 py-8 sm:py-12">
        <div className="fade-in text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4">Become a Campus Hero</h1>
          <p className="text-base sm:text-xl text-muted-foreground">
            Join our community of student drivers and start earning today
          </p>
        </div>

        <Card className="slide-up shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Hero Registration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+91 9876543210"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vehicleType" className="flex items-center gap-2">
                  <Car className="w-4 h-4" />
                  Vehicle Type
                </Label>
                <Input
                  id="vehicleType"
                  value={formData.vehicleType}
                  onChange={(e) => handleInputChange("vehicleType", e.target.value)}
                  placeholder="e.g., Bike, Scooter"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vehicle" className="flex items-center gap-2">
                  <Car className="w-4 h-4" />
                  Vehicle Number
                </Label>
                <Input
                  id="vehicle"
                  value={formData.vehicleNumber}
                  onChange={(e) => handleInputChange("vehicleNumber", e.target.value)}
                  placeholder="HR-26-AX-1234"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="collegeId" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  College ID
                </Label>
                <Input
                  id="collegeId"
                  value={formData.collegeId}
                  onChange={(e) => handleInputChange("collegeId", e.target.value)}
                  placeholder="Enter your College ID"
                  required
                />
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Benefits of Being a Hero:</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Earn ₹20-25 per ride</li>
                  <li>• Flexible working hours</li>
                  <li>• Meet fellow students</li>
                  <li>• Contribute to campus community</li>
                </ul>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="agree"
                  checked={formData.agreed}
                  onCheckedChange={(checked) => handleInputChange("agreed", checked as boolean)}
                />
                <Label htmlFor="agree" className="text-sm">
                  I agree to the terms and conditions and commit to providing safe, reliable rides
                </Label>
              </div>

              <Button 
                type="submit" 
                variant="hero" 
                size="xl" 
                className="w-full"
                disabled={!formData.name || !formData.phone || !formData.vehicleType || !formData.vehicleNumber || !formData.collegeId}
              >
                Submit Application
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default HeroRegistration;