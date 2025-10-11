import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navigation from "@/components/Navigation";
import FloatingCTA from "@/components/FloatingCTA";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Bike, Lock, Mail, Eye, EyeOff } from "lucide-react";

const HeroLogin = () => {
  const BASE_URL = import.meta.env.VITE_ADMIN_API_URL || "http://localhost:4000";
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(""); // Clear error when user starts typing
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (!formData.email || !formData.password) {
        setError("Please fill in all fields");
        return;
      }

      const res = await fetch(`${BASE_URL}/api/heroes/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, password: formData.password })
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || "Invalid credentials");
      }
      const data = await res.json();

      // Update authentication context
      login({ name: data.hero.email.split('@')[0], email: data.hero.email, role: "driver", token: data.token });

      // Navigate to driver dashboard
      navigate("/driver-dashboard");
    } catch (error: any) {
      setError("Login failed. Please check your credentials.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <FloatingCTA />

      {/* Hero Section */}
      <section className="py-12 sm:py-16 px-4 bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-muted">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Bike className="w-20 h-20 text-primary mx-auto mb-6 animate-pulse" />
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Hero <span className="text-primary">Login</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Welcome back, Hero! Sign in to access your driver dashboard and start earning.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Login Form Section */}
      <section className="py-12 sm:py-16 px-4">
        <div className="container mx-auto max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="shadow-lg border-primary/20 border-t-4">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
                  <Bike className="w-6 h-6 text-primary" />
                  Hero Login
                </CardTitle>
                <p className="text-muted-foreground">
                  Enter your credentials to access your dashboard
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        placeholder="Enter your password"
                        required
                        className="h-12 pr-12"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-12 px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  {error && (
                    <div className="text-destructive text-sm text-center bg-destructive/10 p-3 rounded-md">
                      {error}
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    variant="hero" 
                    className="w-full h-12 text-lg font-semibold"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing In..." : "Sign In as Hero"}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-primary hover:text-primary/80"
                      onClick={() => navigate("/hero-registration")}
                    >
                      Register as Hero
                    </Button>
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 px-4 bg-muted/20">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">
              Why Join as a Hero?
            </h2>
            <p className="text-muted-foreground text-lg">
              Become a part of the PUGO community and start earning today.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bike className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Flexible Schedule</h3>
                <p className="text-muted-foreground">
                  Work when you want, earn when you ride. Complete control over your schedule.
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Safe & Secure</h3>
                <p className="text-muted-foreground">
                  All rides are tracked and verified. Your safety is our priority.
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-6 h-6 text-success" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Easy Earnings</h3>
                <p className="text-muted-foreground">
                  Get paid quickly and securely. Track your earnings in real-time.
                </p>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-muted-foreground text-sm border-t border-border">
        © {new Date().getFullYear()} PUGO | Built with ❤️ by Students
      </footer>
    </div>
  );
};

export default HeroLogin;
