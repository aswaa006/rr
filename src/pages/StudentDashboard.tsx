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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      window.location.href = "/";
    }
    setLoading(false);
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-yellow-400 mx-auto"></div>
          <p className="mt-3 text-black text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navigation />
      <FloatingCTA />

      <main className="container mx-auto px-6 py-12 max-w-6xl">

        {/* Welcome Header */}
        <section className="mb-12 rounded-lg p-8 bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-500 shadow-lg flex flex-col md:flex-row items-center gap-10 animate-fade-slideUp">
          <div className="relative w-28 h-28 rounded-full cursor-pointer overflow-hidden flex items-center justify-center
            bg-yellow-200 shadow-lg shadow-yellow-400/40 animate-pulse">
            {user.photo ? (
              <img 
                src={user.photo} 
                alt={user.name} 
                className="rounded-full w-24 h-24 object-cover transition-transform duration-300 ease-in-out hover:scale-110"
              />
            ) : (
              <User className="w-20 h-20 text-orange-600" />
            )}
            <div className="absolute inset-0 rounded-full border-4 border-yellow-300 pointer-events-none"></div>
          </div>
          <div className="flex-grow text-center md:text-left">
            <h1 className="text-4xl font-extrabold mb-2 text-white drop-shadow-lg">
              Welcome back, {user.name.split(' ')[0]}!
            </h1>
            <p className="text-lg text-yellow-100 font-medium tracking-wide">
              Ready for your next campus ride? Let’s roll! 🚀
            </p>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
          <Link to="/book-ride" className="transform transition-transform hover:scale-105 cursor-pointer rounded-lg shadow-md hover:shadow-yellow-400 bg-yellow-300 hover:bg-yellow-400 duration-300">
            <Card className="bg-transparent p-6 text-center cursor-pointer">
              <Car className="mx-auto mb-5 w-12 h-12 text-orange-700" />
              <h3 className="text-2xl font-semibold mb-1 text-black">Book a Ride</h3>
              <p className="text-sm text-orange-800">Find your Hero nearby quickly</p>
            </Card>
          </Link>
          <Card className="p-6 text-center shadow-md rounded-lg hover:shadow-yellow-300 cursor-pointer bg-yellow-50 hover:bg-yellow-100 hover:scale-105 transform transition-transform duration-300">
            <History className="mx-auto mb-5 w-12 h-12 text-orange-700" />
            <h3 className="text-2xl font-semibold mb-1 text-black">Ride History</h3>
            <p className="text-sm text-orange-700">View previous journeys</p>
          </Card>
          <Card className="p-6 text-center shadow-md rounded-lg hover:shadow-yellow-300 cursor-pointer bg-yellow-50 hover:bg-yellow-100 hover:scale-105 transform transition-transform duration-300">
            <Wallet className="mx-auto mb-5 w-12 h-12 text-orange-700" />
            <h3 className="text-2xl font-semibold mb-1 text-black">Wallet</h3>
            <p className="text-sm text-orange-700">Manage your payments</p>
          </Card>
          <Card className="p-6 text-center rounded-lg shadow-md hover:shadow-yellow-300 cursor-pointer bg-yellow-50 hover:bg-yellow-100 hover:scale-105 transform transition-transform duration-300">
            <Settings className="mx-auto mb-5 w-12 h-12 text-orange-700" />
            <h3 className="text-2xl font-semibold mb-1 text-black">Settings</h3>
            <p className="text-sm text-orange-700">Account preferences</p>
          </Card>
        </section>

        {/* Recent Activity & Wallet Summary */}
        <section className="grid lg:grid-cols-2 gap-12 mb-16">
          <Card className="p-8 rounded-lg shadow-md hover:shadow-yellow-300 transition-shadow duration-300 bg-yellow-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Clock className="w-6 h-6 text-orange-700" />
                Recent Rides
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                <div className="flex justify-between bg-white rounded-lg p-4 items-center shadow-sm">
                  <div className="flex gap-3 items-center">
                    <MapPin className="w-5 h-5 text-yellow-500" />
                    <div>
                      <p className="font-semibold text-orange-800">Main Gate → Hostel A</p>
                      <p className="text-sm text-yellow-600">Yesterday, 2:30 PM</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-green-600">Completed</span>
                </div>
                <div className="flex justify-between bg-white rounded-lg p-4 items-center shadow-sm">
                  <div className="flex gap-3 items-center">
                    <MapPin className="w-5 h-5 text-yellow-500" />
                    <div>
                      <p className="font-semibold text-orange-800">Library → Canteen</p>
                      <p className="text-sm text-yellow-600">2 days ago, 11:15 AM</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-green-600">Completed</span>
                </div>
                <div className="text-center">
                  <Button variant="outline" size="sm" className="mt-4 text-yellow-600 border-yellow-600 hover:bg-yellow-600 hover:text-white">
                    View All Rides
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="p-8 rounded-lg shadow-md hover:shadow-yellow-300 transition-shadow duration-300 bg-yellow-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Wallet className="w-6 h-6 text-orange-700" />
                Wallet Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-4xl font-bold text-orange-800 mb-2">₹150</p>
              <p className="text-yellow-600 mb-4">Available Balance</p>
              <div className="grid grid-cols-2 gap-6 mb-4 text-orange-700">
                <div>
                  <p className="text-2xl font-semibold">5</p>
                  <p className="text-sm">Total Rides</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold">₹450</p>
                  <p className="text-sm">Total Spent</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full border-yellow-600 text-yellow-600 hover:bg-yellow-600 hover:text-white">
                Add Money
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Quick Book Ride Call to Action */}
        <section className="mb-20 text-center animate-fade-slideUp">
          <Card className="p-10 rounded-lg bg-gradient-to-r from-orange-400 to-yellow-400 shadow-lg cursor-pointer hover:shadow-yellow-500 transition-shadow duration-300">
            <h3 className="text-3xl font-bold mb-3 text-black">Need a ride right now?</h3>
            <p className="mb-6 text-yellow-900 font-medium">
              Book a ride with our Heroes and get to your destination quickly and safely.
            </p>
            <Link to="/book-ride" className="inline-block">
              <Button variant="hero" size="lg" className="tracking-wider uppercase text-black">
                <Car className="w-6 h-6 mr-2 inline" />
                Book a Ride
              </Button>
            </Link>
          </Card>
        </section>

        {/* Logout Section */}
        <section className="mb-14 text-center animate-fade-slideUp">
          <Button 
            variant="outline" 
            onClick={handleLogout} 
            className="border-yellow-600 text-yellow-600 hover:bg-yellow-600 hover:text-white"
          >
            <LogOut className="w-5 h-5 mr-2 inline-block" />
            Sign Out
          </Button>
        </section>
      </main>
      
      <Footer />

      {/* Global CSS animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 0 8px 3px rgba(253, 224, 71, 0.6);
          }
          50% {
            box-shadow: 0 0 12px 6px rgba(253, 224, 71, 0.85);
          }
        }
        .animate-pulse {
          animation: pulse 3s ease-in-out infinite;
        }
        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(25px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-slideUp {
          animation: fadeSlideUp 0.6s ease forwards;
        }
      `}</style>
    </div>
  );
};

export default StudentDashboard;
