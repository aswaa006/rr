import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import FloatingCTA from "@/components/FloatingCTA";
import Footer from "@/components/Footer";
import { User, MapPin, Clock, Car, LogOut, Settings, BarChart3, Calendar, Wallet, CheckCircle, XCircle } from "lucide-react";
import { logout } from "@/firebase";

interface UserData {
  email: string;
  name: string;
  photo: string;
  role: string;
}

const DriverDashboard = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("user");
        window.location.href = "/";
      }
    } else {
      // Redirect to home if no user data
      window.location.href = "/";
    }
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  const toggleOnlineStatus = () => {
    setIsOnline(!isOnline);
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
              >
                {isOnline ? 'Go Offline' : 'Go Online'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="text-center p-4 sm:p-6 bg-primary/5">
            <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-primary mx-auto mb-2" />
            <h4 className="font-semibold text-sm sm:text-base">Total Rides</h4>
            <p className="text-2xl sm:text-3xl font-bold">128</p>
          </Card>
          <Card className="text-center p-4 sm:p-6 bg-secondary/5">
            <Wallet className="w-6 h-6 sm:w-8 sm:h-8 text-secondary mx-auto mb-2" />
            <h4 className="font-semibold text-sm sm:text-base">Total Earnings</h4>
            <p className="text-2xl sm:text-3xl font-bold">₹{128 * 30}</p>
          </Card>
          <Card className="text-center p-4 sm:p-6 bg-success/5 sm:col-span-2 lg:col-span-1">
            <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-success mx-auto mb-2" />
            <h4 className="font-semibold text-sm sm:text-base">This Week</h4>
            <p className="text-2xl sm:text-3xl font-bold">24 rides</p>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
          <Card className="slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Recent Rides
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-primary" />
                    <div>
                      <p className="font-medium">Main Gate → Hostel A</p>
                      <p className="text-sm text-muted-foreground">Student: John Doe</p>
                      <p className="text-sm text-muted-foreground">Yesterday, 2:30 PM</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-success">₹30</span>
                    <div className="flex items-center gap-1 mt-1">
                      <CheckCircle className="w-3 h-3 text-success" />
                      <span className="text-xs text-success">Completed</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-primary" />
                    <div>
                      <p className="font-medium">Library → Canteen</p>
                      <p className="text-sm text-muted-foreground">Student: Jane Smith</p>
                      <p className="text-sm text-muted-foreground">2 days ago, 11:15 AM</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-success">₹25</span>
                    <div className="flex items-center gap-1 mt-1">
                      <CheckCircle className="w-3 h-3 text-success" />
                      <span className="text-xs text-success">Completed</span>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <Button variant="outline" size="sm">
                    View All Rides
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                Earnings Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <p className="text-2xl font-bold text-primary">₹3,840</p>
                  <p className="text-sm text-muted-foreground">Total Earnings</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-lg font-semibold">128</p>
                    <p className="text-xs text-muted-foreground">Total Rides</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-lg font-semibold">₹30</p>
                    <p className="text-xs text-muted-foreground">Avg. per Ride</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Withdraw Earnings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Current Ride Requests (if online) */}
        {isOnline && (
          <Card className="slide-up mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="w-5 h-5" />
                Available Ride Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-primary" />
                    <div>
                      <p className="font-medium">Admin Block → Sports Complex</p>
                      <p className="text-sm text-muted-foreground">Student: Mike Johnson</p>
                      <p className="text-sm text-muted-foreground">Requested 2 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                      <XCircle className="w-4 h-4 mr-1" />
                      Decline
                    </Button>
                    <Button size="sm" variant="hero">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Accept
                    </Button>
                  </div>
                </div>
                <div className="text-center text-muted-foreground">
                  <p>No more pending requests</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Profile Actions */}
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-8">
          <Card className="slide-up">
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Settings className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">Update Profile</p>
                  <p className="text-sm text-muted-foreground">Manage your personal information</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Car className="w-5 h-5 text-secondary" />
                <div>
                  <p className="font-medium">Vehicle Details</p>
                  <p className="text-sm text-muted-foreground">Update vehicle information</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                Manage Profile
              </Button>
            </CardContent>
          </Card>

          <Card className="slide-up">
            <CardHeader>
              <CardTitle>Help & Support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Clock className="w-5 h-5 text-success" />
                <div>
                  <p className="font-medium">24/7 Support</p>
                  <p className="text-sm text-muted-foreground">Get help anytime</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <BarChart3 className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">Performance Tips</p>
                  <p className="text-sm text-muted-foreground">Maximize your earnings</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>

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
