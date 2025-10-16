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
import { MapPin, Clock, AlertCircle, CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const PreBookRide = () => {
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

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

  // Check if selected time is at least 1 hour from now
  const isPreBookingEligible = () => {
    if (!selectedDate || !selectedTime) return false;
    const now = new Date();
    const selectedDateTime = new Date(`${selectedDate}T${selectedTime}`);
    const timeDiff = selectedDateTime.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    return hoursDiff >= 1;
  };

  const canProceed = pickup && drop && pickup !== drop && selectedDate && selectedTime && isPreBookingEligible();

  const handlePreBook = async () => {
    if (!canProceed || !user) return;
    
    try {
      const response = await fetch('http://localhost:4000/api/prebook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: user.name,
          pickup,
          drop,
          date: selectedDate,
          time: selectedTime,
          scheduledDateTime: new Date(`${selectedDate}T${selectedTime}`).toISOString()
        }),
      });

      if (response.ok) {
        alert('Ride pre-booked successfully! You will be contacted before your scheduled time.');
        navigate('/');
      } else {
        alert('Failed to pre-book ride. Please try again.');
      }
    } catch (error) {
      console.error('Error pre-booking ride:', error);
      alert('Failed to pre-book ride. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <FloatingCTA />
      
      <div className="container mx-auto max-w-2xl px-4 py-6 sm:py-8 lg:py-12">
        <div className="fade-in text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">Pre-Book Your Ride</h1>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground">Schedule your ride in advance</p>
        </div>

        <Card className="slide-up shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Pre-Booking Details
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
              <Label htmlFor="date">Preferred Date</Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
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

            {selectedDate && selectedTime && !isPreBookingEligible() && (
              <div className="flex items-center gap-2 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                <AlertCircle className="w-4 h-4 text-destructive" />
                <p className="text-sm text-destructive">
                  Pre-booking is available only 1 hour in advance. Please select a later time.
                </p>
              </div>
            )}

            {selectedDate && selectedTime && isPreBookingEligible() && (
              <div className="flex items-center gap-2 p-3 bg-success/10 rounded-lg border border-success/20">
                <CheckCircle className="w-4 h-4 text-success" />
                <p className="text-sm text-success">
                  Great! Your pre-booking is eligible. You'll be contacted before your scheduled time.
                </p>
              </div>
            )}

            <Button 
              variant="hero" 
              size="xl" 
              className="w-full text-base sm:text-lg" 
              disabled={!canProceed}
              onClick={handlePreBook}
            >
              Pre-Book Ride
            </Button>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default PreBookRide;
