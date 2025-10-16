import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Navigation from "@/components/Navigation";
import FloatingCTA from "@/components/FloatingCTA";
import Footer from "@/components/Footer";
import { 
  User, MapPin, Clock, Car, LogOut, Settings, BarChart3, 
  Calendar, Wallet, CheckCircle, XCircle, Phone, Key, 
  Navigation as NavigationIcon, Star, AlertCircle, Timer
} from "lucide-react";
import { logout } from "@/firebase";
import { 
  getRideRequests, 
  acceptRide, 
  declineRide, 
  updateRideStatus, 
  getCurrentRide, 
  getDriverStats,
  updateDriverStatus,
  type RideRequest,
  type CurrentRide,
  type DriverStats
} from "@/services/rideService";

interface UserData {
  email: string;
  name: string;
  photo: string;
  role: string;
}

// Types are now imported from rideService

const DriverDashboard = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isOnline, setIsOnline] = useState(false);
  const [rideRequests, setRideRequests] = useState<RideRequest[]>([]);
  const [currentRide, setCurrentRide] = useState<CurrentRide | null>(null);
  const [driverStats, setDriverStats] = useState<DriverStats>({ totalRides: 0, totalEarnings: 0, completedRides: 0 });
  const [driverId, setDriverId] = useState<string>("");
  const [otpInput, setOtpInput] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [rideEnded, setRideEnded] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setUser(user);
        // For demo purposes, using a mock driver ID
        // In production, this should come from the user's driver profile
        setDriverId("driver-123");
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("user");
        window.location.href = "/";
      }
    } else {
      window.location.href = "/";
    }
  }, []);

  useEffect(() => {
    if (isOnline && driverId) {
      fetchRideRequests();
      fetchDriverStats();
      const interval = setInterval(() => {
        fetchRideRequests();
        fetchCurrentRide();
      }, 5000); // Check every 5 seconds
      return () => clearInterval(interval);
    }
  }, [isOnline, driverId]);

  useEffect(() => {
    if (driverId) {
      fetchDriverStats();
      fetchCurrentRide();
    }
  }, [driverId]);

  useEffect(() => {
    if (currentRide && currentRide.status === 'accepted') {
      const timer = setTimeout(() => {
        // Auto-expire if not confirmed within 3 minutes
        setCurrentRide(null);
        setShowOtpModal(false);
      }, 180000); // 3 minutes
      return () => clearTimeout(timer);
    }
  }, [currentRide]);

  const fetchRideRequests = async () => {
    try {
      const requests = await getRideRequests();
      setRideRequests(requests);
    } catch (error) {
      console.error('Error fetching ride requests:', error);
    }
  };

  const fetchDriverStats = async () => {
    try {
      const stats = await getDriverStats(driverId);
      setDriverStats(stats);
    } catch (error) {
      console.error('Error fetching driver stats:', error);
    }
  };

  const fetchCurrentRide = async () => {
    try {
      const ride = await getCurrentRide(driverId);
      setCurrentRide(ride);
    } catch (error) {
      console.error('Error fetching current ride:', error);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const toggleOnlineStatus = async () => {
    const newStatus = !isOnline;
    setIsOnline(newStatus);
    
    if (driverId) {
      await updateDriverStatus(driverId, newStatus);
    }
    
    if (!newStatus) {
      setRideRequests([]);
      setCurrentRide(null);
    }
  };

  const handleAcceptRide = async (request: RideRequest) => {
    try {
      const success = await acceptRide(request.id, driverId);
      if (success) {
        setRideRequests(prev => prev.filter(r => r.id !== request.id));
        // Fetch the current ride to get the OTP
        await fetchCurrentRide();
        setShowOtpModal(true);
      } else {
        alert('Failed to accept ride. Please try again.');
      }
    } catch (error) {
      console.error('Error accepting ride:', error);
      alert('Failed to accept ride. Please try again.');
    }
  };

  const handleDeclineRide = async (requestId: string) => {
    try {
      await declineRide(requestId);
      setRideRequests(prev => prev.filter(r => r.id !== requestId));
    } catch (error) {
      console.error('Error declining ride:', error);
    }
  };

  const verifyOtp = async () => {
    if (otpInput === currentRide?.otp) {
      try {
        const success = await updateRideStatus(currentRide.id, 'otp_verified');
        if (success) {
          setCurrentRide(prev => prev ? {
            ...prev,
            status: 'otp_verified',
            otpVerifiedAt: new Date().toISOString()
          } : null);
          setShowOtpModal(false);
          setOtpInput("");
        } else {
          alert("Failed to verify OTP. Please try again.");
        }
      } catch (error) {
        console.error('Error verifying OTP:', error);
        alert("Failed to verify OTP. Please try again.");
      }
    } else {
      alert("Invalid OTP. Please try again.");
    }
  };

  const startRide = async () => {
    if (currentRide) {
      try {
        const success = await updateRideStatus(currentRide.id, 'in_progress');
        if (success) {
          setCurrentRide(prev => prev ? {
            ...prev,
            status: 'in_progress',
            rideStartedAt: new Date().toISOString()
          } : null);
        } else {
          alert("Failed to start ride. Please try again.");
        }
      } catch (error) {
        console.error('Error starting ride:', error);
        alert("Failed to start ride. Please try again.");
      }
    }
  };

  const endRide = async () => {
    if (currentRide) {
      try {
        const success = await updateRideStatus(currentRide.id, 'completed');
        if (success) {
          setCurrentRide(prev => prev ? {
            ...prev,
            status: 'completed',
            rideEndedAt: new Date().toISOString()
          } : null);
          setRideEnded(true);
          setShowFeedbackModal(true);
          // Refresh driver stats
          await fetchDriverStats();
        } else {
          alert("Failed to end ride. Please try again.");
        }
      } catch (error) {
        console.error('Error ending ride:', error);
        alert("Failed to end ride. Please try again.");
      }
    }
  };

  const completeRide = () => {
    setCurrentRide(null);
    setRideEnded(false);
    setShowFeedbackModal(false);
  };

  const formatTimeRemaining = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <FloatingCTA />
      
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-8 lg:py-12">
        {/* Welcome Section */}
        <div className="fade-in text-center mb-8 sm:mb-10 lg:mb-12">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-secondary to-primary rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            {user.photo ? (
              <img 
                src={user.photo} 
                alt={user.name} 
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover"
              />
            ) : (
              <User className="w-8 h-8 sm:w-12 sm:h-12 text-white" />
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
            Welcome, Hero {user.name?.split(' ')[0]}!
          </h1>
          <p className="text-sm sm:text-base lg:text-xl text-muted-foreground">
            Ready to help students get around campus?
          </p>
        </div>

        {/* Status Toggle */}
        <Card className="slide-up mb-6 sm:mb-8">
          <CardContent className="pt-4 sm:pt-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <span className="font-medium text-sm sm:text-base">
                  {isOnline ? 'Online - Available for rides' : 'Offline - Not accepting rides'}
                </span>
              </div>
              <Button 
                variant={isOnline ? "destructive" : "hero"}
                size="lg"
                onClick={toggleOnlineStatus}
                className="w-full sm:w-auto text-sm sm:text-base"
                disabled={currentRide !== null}
              >
                {isOnline ? 'Go Offline' : 'Go Online'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Current Ride Status */}
        {currentRide && (
          <Card className="slide-up mb-6 sm:mb-8 border-2 border-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Car className="w-5 h-5" />
                Current Ride
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Passenger</Label>
                    <p className="text-lg font-semibold">{currentRide.studentName}</p>
                    <p className="text-sm text-muted-foreground">{currentRide.studentPhone}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Route</Label>
                    <p className="text-lg font-semibold">{currentRide.fromLocation} → {currentRide.toLocation}</p>
                  </div>
                </div>
                
                {currentRide.status === 'accepted' && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Waiting for passenger to confirm payment. OTP: {currentRide.otp}
                    </AlertDescription>
                  </Alert>
                )}

                {currentRide.status === 'otp_verified' && (
                  <div className="space-y-4">
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        Payment confirmed! Please call the passenger and start the ride.
                      </AlertDescription>
                    </Alert>
                    <Button onClick={startRide} className="w-full">
                      <NavigationIcon className="w-4 h-4 mr-2" />
                      Start Ride
                    </Button>
                  </div>
                )}

                {currentRide.status === 'in_progress' && (
                  <div className="space-y-4">
                    <Alert>
                      <NavigationIcon className="h-4 w-4" />
                      <AlertDescription>
                        Ride in progress. Navigate to destination and end ride when complete.
                      </AlertDescription>
                    </Alert>
                    <Button onClick={endRide} variant="destructive" className="w-full">
                      <XCircle className="w-4 h-4 mr-2" />
                      End Ride
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="text-center p-4 sm:p-6 bg-primary/5">
            <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-primary mx-auto mb-2" />
            <h4 className="font-semibold text-sm sm:text-base">Total Rides</h4>
            <p className="text-2xl sm:text-3xl font-bold">{driverStats.totalRides}</p>
          </Card>
          <Card className="text-center p-4 sm:p-6 bg-secondary/5">
            <Wallet className="w-6 h-6 sm:w-8 sm:h-8 text-secondary mx-auto mb-2" />
            <h4 className="font-semibold text-sm sm:text-base">Total Earnings</h4>
            <p className="text-2xl sm:text-3xl font-bold">₹{driverStats.totalEarnings}</p>
          </Card>
          <Card className="text-center p-4 sm:p-6 bg-success/5 sm:col-span-2 lg:col-span-1">
            <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-success mx-auto mb-2" />
            <h4 className="font-semibold text-sm sm:text-base">This Week</h4>
            <p className="text-2xl sm:text-3xl font-bold">24 rides</p>
          </Card>
        </div>

        {/* Available Ride Requests (if online and no current ride) */}
        {isOnline && !currentRide && rideRequests.length > 0 && (
          <Card className="slide-up mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="w-5 h-5" />
                Available Ride Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rideRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-primary" />
                      <div>
                        <p className="font-medium">{request.fromLocation} → {request.toLocation}</p>
                        <p className="text-sm text-muted-foreground">Student: {request.studentName}</p>
                        <p className="text-sm text-muted-foreground">Phone: {request.studentPhone}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{request.gender}</Badge>
                          <Badge variant="outline">Pref: {request.driverPreference}</Badge>
                          <Badge variant="outline">₹{request.fare}</Badge>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Timer className="w-3 h-3 text-red-500" />
                          <span className="text-sm text-red-500">
                            {formatTimeRemaining(request.timeRemaining)} remaining
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeclineRide(request.id)}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Decline
                      </Button>
                      <Button 
                        size="sm" 
                        variant="hero"
                        onClick={() => handleAcceptRide(request)}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Accept
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* No requests message */}
        {isOnline && !currentRide && rideRequests.length === 0 && (
          <Card className="slide-up mb-8">
            <CardContent className="pt-6">
              <div className="text-center text-muted-foreground">
                <Car className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No ride requests available at the moment</p>
                <p className="text-sm">We'll notify you when new requests come in</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* OTP Verification Modal */}
        {showOtpModal && currentRide && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  Verify OTP
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Please share this OTP with the passenger: <strong>{currentRide.otp}</strong>
                </p>
                <div className="space-y-2">
                  <Label htmlFor="otp">Enter OTP to confirm payment</Label>
                  <Input
                    id="otp"
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    placeholder="Enter 4-digit OTP"
                    maxLength={4}
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => {
                      setShowOtpModal(false);
                      setCurrentRide(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={verifyOtp}
                    disabled={otpInput.length !== 4}
                  >
                    Verify
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Feedback Modal */}
        {showFeedbackModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Ride Completed
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Great job! The passenger will now be able to provide feedback.
                </p>
                <div className="text-center">
                  <p className="text-lg font-semibold">Ride # {driverStats.totalRides}</p>
                  <p className="text-sm text-muted-foreground">Earnings: ₹30</p>
                </div>
                <Button 
                  className="w-full"
                  onClick={completeRide}
                >
                  Continue
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Logout Section */}
        <div className="text-center">
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DriverDashboard;