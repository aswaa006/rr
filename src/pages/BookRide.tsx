import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Navigation from "@/components/Navigation";
import FloatingCTA from "@/components/FloatingCTA";
import Footer from "@/components/Footer";
import { Link, useNavigate } from "react-router-dom";
import { MapPin, Clock, Wallet, AlertCircle } from "lucide-react";

const BookRide = () => {
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [preBooking, setPreBooking] = useState(false);
  const navigate = useNavigate();

  const locations = [
    "Main Gate",
    "Library",
    "Hostel A",
    "Hostel B", 
    "Admin Block",
    "Canteen",
    "Sports Complex",
    "Academic Block",
    "Parking Area"
  ];

  // Check if selected time is at least 2 hours from now
  const isPreBookingEligible = () => {
    if (!selectedTime) return false;
    const now = new Date();
    const selectedDateTime = new Date(`${new Date().toDateString()} ${selectedTime}`);
    const timeDiff = selectedDateTime.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    return hoursDiff >= 2;
  };

  const calculateFare = () => {
    return (preBooking && isPreBookingEligible()) ? 25 : 30;
  };

  const canProceed = pickup && drop && pickup !== drop && selectedTime;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <FloatingCTA />
      
      <div className="container mx-auto max-w-2xl px-4 py-8 sm:py-12">
        <div className="fade-in text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4">Book Your Ride</h1>
          <p className="text-base sm:text-xl text-muted-foreground">Quick and easy campus transportation</p>
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
              <Label htmlFor="pickup">Pickup Location</Label>
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
              <Label htmlFor="drop">Drop Location</Label>
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
              <Label htmlFor="time">Preferred Time</Label>
              <Input
                id="time"
                type="time"
                value={selectedTime}
                onChange={(e) => {
                  setSelectedTime(e.target.value);
                  // Reset pre-booking if time is not eligible
                  if (!isPreBookingEligible()) {
                    setPreBooking(false);
                  }
                }}
                required
              />
            </div>

            {selectedTime && !isPreBookingEligible() && (
              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg border">
                <AlertCircle className="w-4 h-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Pre-booking is available only 2 hours in advance. Select a later time to save ₹5.
                </p>
              </div>
            )}

            {selectedTime && isPreBookingEligible() && (
              <div className="flex items-center justify-between p-4 bg-success/5 rounded-lg border-2 border-success/20 gap-3">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-success" />
                  <div>
                    <Label htmlFor="prebooking" className="text-base font-medium">
                      Pre-Book & Save ₹5
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Book 2+ hours ahead for discount
                    </p>
                  </div>
                </div>
                <div className="shrink-0">
                  <Switch
                    id="prebooking"
                    checked={preBooking}
                    onCheckedChange={setPreBooking}
                  />
                </div>
              </div>
            )}

            {canProceed && (
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Wallet className="w-5 h-5 text-primary" />
                      <span className="font-medium">Total Fare</span>
                    </div>
                    <div className="text-right">
                      {preBooking && isPreBookingEligible() && (
                        <div className="text-sm text-muted-foreground line-through">₹30</div>
                      )}
                      <div className="text-2xl font-bold text-primary">
                        ₹{calculateFare()}
                      </div>
                      {preBooking && isPreBookingEligible() && (
                        <div className="text-sm text-success font-medium">You save ₹5!</div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Button 
              variant="hero" 
              size="xl" 
              className="w-full" 
              disabled={!canProceed}
              onClick={() => {
                if (!canProceed) return;
                const eligible = isPreBookingEligible();
                const fare = preBooking && eligible ? 25 : 30;
                const details = {
                  pickup,
                  drop,
                  selectedTime,
                  preBooking,
                  eligible,
                  fare,
                };
                try {
                  localStorage.setItem("bookingDetails", JSON.stringify(details));
                } catch {}
                navigate("/payment");
              }}
            >
              Proceed to Payment
            </Button>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default BookRide;