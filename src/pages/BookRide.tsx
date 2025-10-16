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
import { getDriverDetails } from "@/services/rideService";

const BookRide = () => {
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [gender, setGender] = useState("");
  const [driverPreference, setDriverPreference] = useState("");
  const [availableDrivers, setAvailableDrivers] = useState(0);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [availabilityChecked, setAvailabilityChecked] = useState(false);
  const [noDriversAvailable, setNoDriversAvailable] = useState(false);
  const navigate = useNavigate();

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
    setIsCheckingAvailability(true);
    setNoDriversAvailable(false);
    
    try {
      const drivers = await getDriverDetails();
      const onlineDrivers = drivers.filter(driver => driver.isOnline);
      
      // Filter by driver preference if specified
      let availableCount = onlineDrivers.length;
      if (driverPreference && driverPreference !== "Any") {
        availableCount = onlineDrivers.filter(driver => 
          driver.gender === driverPreference || driverPreference === "Any"
        ).length;
      }
      
      setAvailableDrivers(availableCount);
      setAvailabilityChecked(true);
      
      if (availableCount === 0) {
        setNoDriversAvailable(true);
      }
    } catch (error) {
      console.error('Error checking driver availability:', error);
      setNoDriversAvailable(true);
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  const canProceed = pickup && drop && pickup !== drop && selectedTime && gender && availabilityChecked && !noDriversAvailable;

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
                    onClick={() => {
                      const details = {
                        pickup,
                        drop,
                        selectedTime,
                        gender,
                        driverPreference: driverPreference || "Any",
                        fare: calculateFare(),
                        availableDrivers
                      };
                      try {
                        localStorage.setItem("bookingDetails", JSON.stringify(details));
                      } catch {}
                      navigate("/payment");
                    }}
                  >
                    Proceed for Payment
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
    </div>
  );
};

export default BookRide;