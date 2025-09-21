import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Navigation from "@/components/Navigation";
import { Link, useNavigate } from "react-router-dom";
import { CreditCard, Wallet, Smartphone, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Payment = () => {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [booking, setBooking] = useState<{
    pickup: string;
    drop: string;
    selectedTime: string;
    preBooking: boolean;
    eligible: boolean;
    fare: number;
  } | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("bookingDetails");
      if (raw) {
        setBooking(JSON.parse(raw));
      }
    } catch {}
  }, []);

  const computedFare = useMemo(() => {
    if (!booking) return 30;
    // Recompute eligibility: only discount if 2+ hours in future and preBooking true
    const now = new Date();
    const selectedDateTime = new Date(`${new Date().toDateString()} ${booking.selectedTime}`);
    const hoursDiff = (selectedDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    const eligible = booking.preBooking && hoursDiff >= 2;
    return eligible ? 25 : 30;
  }, [booking]);

  const handlePayment = async () => {
    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      toast({
        title: "Payment Successful!",
        description: "Your ride has been booked successfully.",
      });
      // store receipt for confirmation page
      try {
        localStorage.setItem("paymentReceipt", JSON.stringify({ fare: computedFare }));
      } catch {}
      navigate("/ride-confirmation");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto max-w-2xl px-4 py-8 sm:py-12">
        <div className="fade-in text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4">Complete Payment</h1>
          <p className="text-base sm:text-xl text-muted-foreground">Secure checkout for your ride</p>
        </div>

        <div className="grid gap-6">
          {/* Ride Summary */}
          <Card className="slide-up">
            <CardHeader>
              <CardTitle>Ride Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between gap-4 text-sm sm:text-base">
                  <span className="text-muted-foreground">From:</span>
                  <span className="font-medium">{booking?.pickup || "-"}</span>
                </div>
                <div className="flex justify-between gap-4 text-sm sm:text-base">
                  <span className="text-muted-foreground">To:</span>
                  <span className="font-medium">{booking?.drop || "-"}</span>
                </div>
                {booking && (
                  <div className="flex justify-between gap-4 text-sm sm:text-base">
                    <span className="text-muted-foreground">Pre-booking Discount:</span>
                    {computedFare === 25 ? (
                      <span className="text-success font-medium">-₹5</span>
                    ) : (
                      <span className="text-muted-foreground">Not applied</span>
                    )}
                  </div>
                )}
                <div className="border-t pt-3 flex justify-between items-center">
                  <span className="text-lg font-medium">Total:</span>
                  <span className="text-2xl font-bold text-primary">₹{computedFare}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card className="slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent/50">
                  <RadioGroupItem value="card" id="card" />
                  <CreditCard className="w-5 h-5 text-primary" />
                  <Label htmlFor="card" className="flex-1 cursor-pointer">
                    Credit/Debit Card
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent/50">
                  <RadioGroupItem value="upi" id="upi" />
                  <Smartphone className="w-5 h-5 text-secondary" />
                  <Label htmlFor="upi" className="flex-1 cursor-pointer">
                    UPI Payment
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent/50">
                  <RadioGroupItem value="wallet" id="wallet" />
                  <Wallet className="w-5 h-5 text-success" />
                  <Label htmlFor="wallet" className="flex-1 cursor-pointer">
                    Digital Wallet
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Card Details */}
          {paymentMethod === "card" && (
            <Card className="slide-up">
              <CardHeader>
                <CardTitle>Card Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input 
                    id="cardNumber" 
                    placeholder="1234 5678 9012 3456"
                    className="font-mono"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input id="expiry" placeholder="MM/YY" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input id="cvv" placeholder="123" type="password" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Cardholder Name</Label>
                  <Input id="name" placeholder="John Doe" />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pay Button */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">
            <Link to="/book-ride" className="sm:flex-1">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Back to Booking
              </Button>
            </Link>
            <Button 
              variant="hero" 
              size="lg" 
              className="w-full sm:w-auto"
              onClick={handlePayment}
              disabled={processing}
            >
              {processing ? "Processing..." : `Pay ₹${computedFare}`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;