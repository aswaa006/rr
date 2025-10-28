import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Navigation from "@/components/Navigation";
import FloatingCTA from "@/components/FloatingCTA";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import { MapPin, Wallet, Users, Clock, AlertCircle, CheckCircle } from "lucide-react";
import { checkAvailability, bookRide } from "@/services/rideService";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "@/components/AuthModal";
import { useToast } from "@/hooks/use-toast";

const BookRide = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [authModal, setAuthModal] = useState({ isOpen: false, userType: "student" as "student" | "hero" });
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [gender, setGender] = useState("");
  const [driverPreference, setDriverPreference] = useState("");
  const [availableDrivers, setAvailableDrivers] = useState(0);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [availabilityChecked, setAvailabilityChecked] = useState(false);
  const [noDriversAvailable, setNoDriversAvailable] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<any>(null);
  const [isBooking, setIsBooking] = useState(false);
  const navigate = useNavigate();

  // Check if user is logged in
  useEffect(() => {
    if (!user) {
      setAuthModal({ isOpen: true, userType: "student" });
    }
  }, [user]);

  // All specified location spots
  const locations = [
    "Gate 1",
    "Gate 2", 
    "Ponlait",
    "Science Block",
    "Green Energy Technology",
    "Library",
    "Admin Block",
    "Girls Hostel",
    "Boys Hostel",
    "Rajiv Gandhi Stadium",
    "Thiruvalluvar Stadium",
    "Open Air Theatre",
    "SJ Campus",
    "UMISARC",
    "Mass Media"
  ];

  const calculateFare = () => {
    return 30;
  };

  // Check driver availability
  const checkDriverAvailability = async () => {
    if (!pickup || !drop) {
      toast({
        title: "Missing Information",
        description: "Please fill in both pickup and drop locations.",
        variant: "destructive",
      });
      return;
    }

    setIsCheckingAvailability(true);
    setAvailabilityChecked(false);
    setNoDriversAvailable(false);
    setSelectedDriver(null);

    try {
      const availability = await checkAvailability({
        pickup,
        drop,
        time: selectedTime,
        gender: gender,
        driverPreference: driverPreference
      });

      if (availability.available && availability.drivers.length > 0) {
        setAvailableDrivers(availability.drivers.length);
        setSelectedDriver(availability.drivers[0]); // Select first available driver
        setAvailabilityChecked(true);
        toast({
          title: "Drivers Available!",
          description: `Found ${availability.drivers.length} driver(s) near you.`,
        });
      } else {
        setNoDriversAvailable(true);
        toast({
          title: "No Drivers Available",
          description: "Sorry, no drivers are available in your area right now. Please try again later.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error checking availability:', error);
      toast({
        title: "Error",
        description: "Failed to check driver availability. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  const canProceed = pickup && drop && pickup !== drop && selectedTime && gender && availabilityChecked && !noDriversAvailable;

  const handleProceedToPayment = async () => {
    if (!selectedDriver) {
      toast({
        title: "No Driver Selected",
        description: "Please check driver availability first.",
        variant: "destructive",
      });
      return;
    }

    setIsBooking(true);
    
    try {
      const rideData = {
        pickup,
        drop,
        time: selectedTime,
        gender,
        driverPreference: driverPreference || "Any",
        fare: calculateFare(),
        driverId: selectedDriver.id,
        driverName: selectedDriver.name,
        driverPhone: selectedDriver.phone,
        driverRating: selectedDriver.rating
      };

      const booking = await bookRide(rideData);
      
      // Store booking details for payment and confirmation pages
      localStorage.setItem("bookingDetails", JSON.stringify({
        ...rideData,
        bookingId: booking.id,
        status: booking.status,
        estimatedTime: booking.estimatedTime
      }));

      toast({
        title: "Ride Booked!",
        description: "Your ride has been booked successfully. Proceeding to payment.",
      });

      navigate("/payment");
    } catch (error) {
      console.error('Error booking ride:', error);
      toast({
        title: "Booking Failed",
        description: "Failed to book your ride. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <FloatingCTA />
      
      <div className="container mx-auto max-w-2xl px-4 py-6 sm:py-8 lg:py-12">
        <div className="fade-in text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">Book Your Ride</h1>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground">Quick and easy campus transportation</p>
        </div>

        <Card className="slide-up shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Ride Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="pickup">From</Label>
              <Select value={pickup} onValueChange={setPickup}>
                <SelectTrigger id="pickup">
                  <SelectValue placeholder="Select pickup location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="drop">To</Label>
              <Select value={drop} onValueChange={setDrop}>
                <SelectTrigger id="drop">
                  <SelectValue placeholder="Select drop location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem 
                      key={location} 
                      value={location}
                      disabled={location === pickup}
                    >
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Gender</Label>
              <RadioGroup value={gender} onValueChange={setGender}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="M" id="male" />
                  <Label htmlFor="male">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="F" id="female" />
                  <Label htmlFor="female">Female</Label>
                </div>
              </RadioGroup>
            </div>

            {gender === "F" && (
              <div className="space-y-2">
                <Label>Driver Preference</Label>
                <RadioGroup value={driverPreference} onValueChange={setDriverPreference}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="M" id="driver-male" />
                    <Label htmlFor="driver-male">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="F" id="driver-female" />
                    <Label htmlFor="driver-female">Female</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Any" id="driver-any" />
                    <Label htmlFor="driver-any">Any</Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="time">Preferred Time</Label>
              <Input
                id="time"
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                required
              />
            </div>

            {/* Driver Availability Check */}
            <div className="space-y-4">
              <Button
                type="button"
                variant="outline"
                onClick={checkDriverAvailability}
                disabled={!pickup || !drop || !gender || isCheckingAvailability}
                className="w-full"
              >
                {isCheckingAvailability ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Checking Availability...
                  </>
                ) : (
                  <>
                    <Users className="w-4 h-4 mr-2" />
                    Check Availability of Drivers
                  </>
                )}
              </Button>

              {availabilityChecked && (
                <div className="space-y-2">
                  {noDriversAvailable ? (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        No drivers available, try other choice or try again after some time.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        {availableDrivers} driver{availableDrivers !== 1 ? 's' : ''} available
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </div>

            {canProceed && (
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Wallet className="w-5 h-5 text-primary" />
                      <span className="font-medium">Total Fare</span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        ₹{calculateFare()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {!noDriversAvailable && availabilityChecked && (
              <div className="space-y-4">
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Order is placed. {availableDrivers} driver{availableDrivers !== 1 ? 's' : ''} available.
                  </AlertDescription>
                </Alert>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="flex-1"
                    onClick={() => {
                      // Cancel order - reset form
                      setPickup("");
                      setDrop("");
                      setSelectedTime("");
                      setGender("");
                      setDriverPreference("");
                      setAvailabilityChecked(false);
                      setNoDriversAvailable(false);
                      setAvailableDrivers(0);
                    }}
                  >
                    Cancel Order
                  </Button>
                  <Button 
                    variant="hero" 
                    size="lg" 
                    className="flex-1"
                    onClick={handleProceedToPayment}
                    disabled={isBooking}
                  >
                    {isBooking ? (
                      <>
                        <Clock className="w-4 h-4 mr-2 animate-spin" />
                        Booking...
                      </>
                    ) : (
                      "Proceed for Payment"
                    )}
                  </Button>
                </div>
              </div>
            )}

            {!availabilityChecked && (
              <Button 
                variant="hero" 
                size="xl" 
                className="w-full text-base sm:text-lg" 
                disabled={!pickup || !drop || !gender}
                onClick={checkDriverAvailability}
              >
                Check Driver Availability First
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
      <Footer />
      <AuthModal 
        isOpen={authModal.isOpen}
        onClose={() => setAuthModal({ ...authModal, isOpen: false })}
        userType={authModal.userType}
      />
    </div>
  );
};

export default BookRide;