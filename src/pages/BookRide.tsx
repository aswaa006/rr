import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Navigation from "@/components/Navigation";
import FloatingCTA from "@/components/FloatingCTA";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import { MapPin, Wallet } from "lucide-react";

const BookRide = () => {
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
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

  const calculateFare = () => {
    return 30;
  };

  const canProceed = pickup && drop && pickup !== drop && selectedTime;

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
                onChange={(e) => setSelectedTime(e.target.value)}
                required
              />
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

            <Button 
              variant="hero" 
              size="xl" 
              className="w-full text-base sm:text-lg" 
              disabled={!canProceed}
              onClick={() => {
                if (!canProceed) return;
                const details = {
                  pickup,
                  drop,
                  selectedTime,
                  fare: calculateFare(),
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