import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import FloatingCTA from "@/components/FloatingCTA";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { User, MapPin, Clock, Car, LogOut, Settings, History, Wallet } from "lucide-react";
import { logout } from "@/firebase";

interface UserData {
  email: string;
  name: string;
  photo: string;
  role: string;
}

const StudentDashboard = () => {
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      // Redirect to home if no user data
      window.location.href = "/";
    }
  }, []);

  const handleLogout = async () => {
    await logout();
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
      
      <div className="container mx-auto max-w-6xl px-4 py-8 sm:py-12">
        {/* Welcome Section */}
        <div className="fade-in text-center mb-10 sm:mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6">
            {user.photo ? (
              <img 
                src={user.photo} 
                alt={user.name} 
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <User className="w-12 h-12 text-white" />
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4">
            Welcome back, {user.name?.split(' ')[0]}!
          </h1>
          <p className="text-base sm:text-xl text-muted-foreground">
            Ready for your next campus ride?
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <Link to="/book-ride" className="block">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Car className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Book a Ride</h3>
                <p className="text-sm text-muted-foreground">Find a Hero nearby</p>
              </CardContent>
            </Card>
          </Link>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <History className="w-8 h-8 text-secondary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Ride History</h3>
              <p className="text-sm text-muted-foreground">View past rides</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Wallet className="w-8 h-8 text-success mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Wallet</h3>
              <p className="text-sm text-muted-foreground">Manage payments</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Settings className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Settings</h3>
              <p className="text-sm text-muted-foreground">Account preferences</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 mb-8">
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
                      <p className="text-sm text-muted-foreground">Yesterday, 2:30 PM</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-success">Completed</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-primary" />
                    <div>
                      <p className="font-medium">Library → Canteen</p>
                      <p className="text-sm text-muted-foreground">2 days ago, 11:15 AM</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-success">Completed</span>
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
                Wallet Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <p className="text-2xl font-bold text-primary">₹150</p>
                  <p className="text-sm text-muted-foreground">Available Balance</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-lg font-semibold">5</p>
                    <p className="text-xs text-muted-foreground">Total Rides</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-lg font-semibold">₹450</p>
                    <p className="text-xs text-muted-foreground">Total Spent</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Add Money
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Book Ride */}
        <Card className="slide-up mb-8">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">Need a ride right now?</h3>
              <p className="text-muted-foreground mb-6">
                Book a ride with our Heroes and get to your destination safely and affordably.
              </p>
              <Link to="/book-ride">
                <Button variant="hero" size="lg" className="w-full sm:w-auto">
                  <Car className="w-5 h-5 mr-2" />
                  Book a Ride
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

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

export default StudentDashboard;
