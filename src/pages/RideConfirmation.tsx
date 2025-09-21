import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import { Link } from "react-router-dom";
import { CheckCircle, MapPin, Clock, User, Phone } from "lucide-react";

const RideConfirmation = () => {
  const rideId = "RX" + Math.random().toString(36).substr(2, 6).toUpperCase();
  let booking: any = null;
  let receipt: any = null;
  try {
    booking = JSON.parse(localStorage.getItem("bookingDetails") || "null");
    receipt = JSON.parse(localStorage.getItem("paymentReceipt") || "null");
  } catch {}
  
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto max-w-2xl px-4 py-8 sm:py-12">
        <div className="fade-in text-center mb-6 sm:mb-8">
          <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-success" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 text-success">Ride Confirmed!</h1>
          <p className="text-base sm:text-xl text-muted-foreground">
            Your ride is confirmed! A Hero will be assigned shortly.
          </p>
        </div>

        <Card className="slide-up shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Ride Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Ride ID</p>
                <p className="font-mono font-bold text-lg">{rideId}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Paid</p>
                <p className="font-bold text-lg text-success">₹{receipt?.fare ?? 30}</p>
              </div>
            </div>
            
            <div className="space-y-3 pt-4 border-t">
              <div className="flex justify-between gap-4 text-sm sm:text-base">
                <span className="text-muted-foreground">Pickup:</span>
                <span className="font-medium">{booking?.pickup || "-"}</span>
              </div>
              <div className="flex justify-between gap-4 text-sm sm:text-base">
                <span className="text-muted-foreground">Drop:</span>
                <span className="font-medium">{booking?.drop || "-"}</span>
              </div>
              <div className="flex justify-between gap-4 text-sm sm:text-base">
                <span className="text-muted-foreground">Booking Type:</span>
                {booking?.preBooking && receipt?.fare === 25 ? (
                  <span className="font-medium text-success">Pre-booked (Saved ₹5)</span>
                ) : (
                  <span className="font-medium">Standard</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="slide-up shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-secondary" />
              Your Hero (Assigned)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary to-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">AK</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">Arjun Kumar</h3>
                <p className="text-muted-foreground">Final Year, Computer Science</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-yellow-500">★★★★★</span>
                  <span className="text-sm text-muted-foreground">(4.9 rating)</span>
                </div>
                <div className="flex items-center gap-2 mt-2 text-sm">
                  <Phone className="w-4 h-4" />
                  <span>Hero Phone: +91 90000 11111</span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="hidden sm:inline-flex">
                <Phone className="w-4 h-4 mr-2" />
                Call
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="slide-up shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Your Contact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4" />
              <span>User Phone: +91 90000 22222</span>
            </div>
          </CardContent>
        </Card>

        <Card className="slide-up border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-5 h-5 text-primary" />
              <span className="font-medium">Estimated Arrival</span>
            </div>
            <p className="text-2xl font-bold text-primary mb-2">5-7 minutes</p>
            <p className="text-sm text-muted-foreground">
              Your Hero is on the way to pickup location. You'll receive updates via SMS.
            </p>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8">
          <Link to="/" className="sm:flex-1">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Back to Home
            </Button>
          </Link>
          <Link to="/book-ride" className="sm:flex-1">
            <Button variant="hero" size="lg" className="w-full sm:w-auto">
              Book Another Ride
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RideConfirmation;