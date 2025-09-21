import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import FloatingCTA from "@/components/FloatingCTA";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { User, Settings, BarChart3, Calendar, Wallet, Clock } from "lucide-react";

const DriverLogin = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <FloatingCTA />
      
      <div className="container mx-auto max-w-5xl px-4 py-8 sm:py-12">
        <div className="fade-in text-center mb-10 sm:mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-secondary to-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4">Hero Dashboard</h1>
          <p className="text-base sm:text-xl text-muted-foreground">
            Coming Soon - Your complete driver portal
          </p>
        </div>

        <Card className="slide-up shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="text-center">Hero Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 border rounded-lg bg-primary/5">
                <BarChart3 className="w-8 h-8 text-primary mx-auto mb-2" />
                <h4 className="font-semibold">Total Rides</h4>
                <p className="text-3xl font-bold">128</p>
              </div>
              <div className="text-center p-6 border rounded-lg bg-secondary/5">
                <Wallet className="w-8 h-8 text-secondary mx-auto mb-2" />
                <h4 className="font-semibold">Total Earnings</h4>
                <p className="text-3xl font-bold">₹{128 * 30}</p>
              </div>
              <div className="text-center p-6 border rounded-lg bg-success/5">
                <Calendar className="w-8 h-8 text-success mx-auto mb-2" />
                <h4 className="font-semibold">This Week</h4>
                <p className="text-3xl font-bold">24 rides</p>
              </div>
            </div>

            <div className="border rounded-lg">
              <div className="px-4 py-3 border-b font-semibold flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Recent Bookings (Sample)
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left px-4 py-2">Ride ID</th>
                      <th className="text-left px-4 py-2">From</th>
                      <th className="text-left px-4 py-2">To</th>
                      <th className="text-left px-4 py-2">Time</th>
                      <th className="text-left px-4 py-2">Fare</th>
                      <th className="text-left px-4 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="px-4 py-2 font-mono">RX7A1B2</td>
                      <td className="px-4 py-2">Main Gate</td>
                      <td className="px-4 py-2">Hostel A</td>
                      <td className="px-4 py-2">09:30</td>
                      <td className="px-4 py-2">₹30</td>
                      <td className="px-4 py-2">Completed</td>
                    </tr>
                    <tr className="border-t">
                      <td className="px-4 py-2 font-mono">RX8C3D4</td>
                      <td className="px-4 py-2">Library</td>
                      <td className="px-4 py-2">Canteen</td>
                      <td className="px-4 py-2">11:15</td>
                      <td className="px-4 py-2">₹25</td>
                      <td className="px-4 py-2">Completed</td>
                    </tr>
                    <tr className="border-t">
                      <td className="px-4 py-2 font-mono">RX9E5F6</td>
                      <td className="px-4 py-2">Admin Block</td>
                      <td className="px-4 py-2">Sports Complex</td>
                      <td className="px-4 py-2">14:40</td>
                      <td className="px-4 py-2">₹30</td>
                      <td className="px-4 py-2">Completed</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
          <Card className="slide-up">
            <CardHeader>
              <CardTitle>What’s Coming</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
                <Clock className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">Real-time Ride Requests</p>
                  <p className="text-sm text-muted-foreground">Accept/decline rides instantly</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-secondary/5 rounded-lg">
                <BarChart3 className="w-5 h-5 text-secondary" />
                <div>
                  <p className="font-medium">Earnings Analytics</p>
                  <p className="text-sm text-muted-foreground">Detailed income tracking</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-success/5 rounded-lg">
                <User className="w-5 h-5 text-success" />
                <div>
                  <p className="font-medium">Profile Management</p>
                  <p className="text-sm text-muted-foreground">Update details & availability</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="slide-up">
            <CardHeader>
              <CardTitle>Not a Hero Yet?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Join our community of student drivers and start earning while helping fellow students get around campus safely and affordably.
              </p>
              <Link to="/become-hero" className="block">
                <Button variant="hero" size="lg" className="w-full">
                  Apply to Become a Hero
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Temporary Login Section */}
        <Card className="slide-up mt-6 sm:mt-8 border-muted">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="font-semibold mb-4">Current Heroes</h3>
              <p className="text-muted-foreground mb-6">
                If you're already registered as a Hero, we'll notify you via email 
                once the dashboard is ready. In the meantime, you can continue 
                receiving ride requests through our WhatsApp system.
              </p>
              <Button variant="outline" disabled>
                Dashboard Coming Soon
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default DriverLogin;