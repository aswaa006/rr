import { useState, useEffect } from "react";
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
import { useHeroAuth } from "@/contexts/HeroAuthContext";
import { User, Phone, Car, Clock, Shield, Loader2 } from "lucide-react";
import { submitDriverRegistration, DriverRegistrationData, initializeStorage } from "@/services/supabaseService";

const HeroRegistration = () => {
  const [formData, setFormData] = useState({
    name: "",
    collegeId: "",
    phone: "",
    vehicleType: "",
    vehicleNumber: "",
    licenseFrontFile: null as File | null,
    licenseBackFile: null as File | null,
    idCardFile: null as File | null,
    vehiclePhotoFile: null as File | null,
    agreed: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [storageInitialized, setStorageInitialized] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);
  const { toast } = useToast();

  // Initialize storage on component mount
  useEffect(() => {
    const initStorage = async (retryCount = 0) => {
      try {
        console.log(`Starting storage initialization (attempt ${retryCount + 1})...`);
        setStorageError(null);
        
        const success = await initializeStorage();
        setStorageInitialized(success);
        
        if (!success) {
          console.error("Storage initialization failed");
          setStorageError("Failed to initialize file storage");
          
          // Retry up to 3 times
          if (retryCount < 2) {
            console.log(`Retrying storage initialization in 2 seconds... (${retryCount + 1}/3)`);
            setTimeout(() => initStorage(retryCount + 1), 2000);
            return;
          }
          
          toast({
            title: "Storage Error",
            description: "Failed to initialize file storage after multiple attempts. Please check the console for details and refresh the page.",
            variant: "destructive",
          });
        } else {
          console.log("Storage initialized successfully");
          setStorageError(null);
        }
      } catch (error) {
        console.error("Storage initialization error:", error);
        setStorageInitialized(false);
        setStorageError("An unexpected error occurred during storage initialization");
        
        // Retry on error too
        if (retryCount < 2) {
          console.log(`Retrying storage initialization after error in 2 seconds... (${retryCount + 1}/3)`);
          setTimeout(() => initStorage(retryCount + 1), 2000);
          return;
        }
        
        toast({
          title: "Storage Error",
          description: "An unexpected error occurred during storage initialization. Please refresh the page.",
          variant: "destructive",
        });
      }
    };

    // Add a small delay to ensure Supabase is fully loaded
    const timer = setTimeout(() => initStorage(0), 1000);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreed) {
      toast({
        title: "Agreement Required",
        description: "Please agree to the terms and conditions.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitDriverRegistration(formData as DriverRegistrationData);
      
      if (result.success) {
        setSubmitted(true);
        toast({
          title: "Application Submitted!",
          description: "We'll review your application and get back to you soon.",
        });
      } else {
        toast({
          title: "Submission Failed",
          description: result.error || "Please try again later.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Submission Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    field: string,
    value: string | boolean | File | null
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
            <h1 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 text-success">
              Application Submitted!
            </h1>
            <p className="text-base sm:text-xl text-muted-foreground mb-6 sm:mb-8">
              Thank you for your interest in becoming a PUGO Hero. We will
              review your application and contact you within 24-48 hours.
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
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4">
            Become a Campus Hero
          </h1>
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
                <Label htmlFor="collegeId" className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  College ID Number
                </Label>
                <Input
                  id="collegeId"
                  value={formData.collegeId}
                  onChange={(e) => handleInputChange("collegeId", e.target.value)}
                  placeholder="Enter your college ID number"
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
                <Label htmlFor="licenseFrontFile" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Driving License - Front (PDF)
                </Label>
                <Input
                  id="licenseFrontFile"
                  type="file"
                  accept=".pdf"
                  onChange={(e) =>
                    handleInputChange("licenseFrontFile", e.target.files?.[0] ?? null)
                  }
                  required
                />
                {formData.licenseFrontFile && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.licenseFrontFile.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="licenseBackFile" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Driving License - Back (PDF)
                </Label>
                <Input
                  id="licenseBackFile"
                  type="file"
                  accept=".pdf"
                  onChange={(e) =>
                    handleInputChange("licenseBackFile", e.target.files?.[0] ?? null)
                  }
                  required
                />
                {formData.licenseBackFile && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.licenseBackFile.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="idCardFile" className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  ID Card Upload (PDF/Image)
                </Label>
                <Input
                  id="idCardFile"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) =>
                    handleInputChange("idCardFile", e.target.files?.[0] ?? null)
                  }
                  required
                />
                {formData.idCardFile && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.idCardFile.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="vehiclePhotoFile" className="flex items-center gap-2">
                  <Car className="w-4 h-4" />
                  Vehicle Photo
                </Label>
                <Input
                  id="vehiclePhotoFile"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleInputChange("vehiclePhotoFile", e.target.files?.[0] ?? null)
                  }
                  required
                />
                {formData.vehiclePhotoFile && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.vehiclePhotoFile.name}
                  </p>
                )}
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
                  onCheckedChange={(checked) =>
                    handleInputChange("agreed", checked as boolean)
                  }
                />
                <Label htmlFor="agree" className="text-sm">
                  I agree to the terms and conditions and commit to providing safe,
                  reliable rides
                </Label>
              </div>

              {storageError && !storageInitialized && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-4">
                  <p className="text-destructive text-sm mb-2">{storageError}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setStorageError(null);
                      setStorageInitialized(false);
                      // Retry initialization
                      setTimeout(() => {
                        initializeStorage().then(success => {
                          setStorageInitialized(success);
                          if (!success) {
                            setStorageError("Retry failed. Please refresh the page.");
                          }
                        });
                      }, 500);
                    }}
                    className="text-destructive border-destructive hover:bg-destructive hover:text-white"
                  >
                    Retry Storage Initialization
                  </Button>
                </div>
              )}

              <Button
                type="submit"
                variant="hero"
                size="xl"
                className="w-full"
                disabled={
                  !formData.name ||
                  !formData.collegeId ||
                  !formData.phone ||
                  !formData.vehicleType ||
                  !formData.vehicleNumber ||
                  !formData.licenseFrontFile ||
                  !formData.licenseBackFile ||
                  !formData.idCardFile ||
                  !formData.vehiclePhotoFile ||
                  isSubmitting ||
                  !storageInitialized
                }
              >
                {!storageInitialized ? (
                  storageError ? "Storage Error - Click Retry Above" : "Initializing Storage..."
                ) : isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Application"
                )}
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
