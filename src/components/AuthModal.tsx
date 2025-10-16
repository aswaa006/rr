import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Lock, Car, Upload, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { studentLogin, studentSignUp } from "@/services/supabaseService";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  userType: "student" | "hero";
}

const AuthModal = ({ isOpen, onClose, userType }: AuthModalProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    vehicleNumber: "",
    idProof: null as File | null,
  });
  const { toast } = useToast();
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (userType === "student") {
        if (isLogin) {
          const res = await studentLogin(formData.email, formData.password);
          if (!res.success || !res.student) throw new Error(res.error || "Login failed");
          login({ name: res.student.full_name, email: res.student.email, role: "user" });
          toast({ title: "Login Successful!", description: "Welcome back to PUGO!" });
        } else {
          const res = await studentSignUp({ fullName: formData.name, email: formData.email, password: formData.password });
          if (!res.success || !res.student) throw new Error(res.error || "Signup failed");
          login({ name: res.student.full_name, email: res.student.email, role: "user" });
          toast({ title: "Account Created!", description: "Welcome to PUGO!" });
        }
      } else {
        // For hero path, keep existing local flow until backend is ready
        const userData = {
          name: formData.name || "Demo Hero",
          email: formData.email,
          role: "driver",
        };
        login(userData);
        toast({ title: isLogin ? "Login Successful!" : "Account Created!" });
      }

      setFormData({ name: "", email: "", password: "", vehicleNumber: "", idProof: null });
      onClose();
      navigate("/book-ride");
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Authentication failed", variant: "destructive" });
    }
  };

  const handleInputChange = (field: string, value: string | File | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {userType === "student" ? "Student" : "Hero"} {isLogin ? "Login" : "Sign Up"}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={isLogin ? "login" : "signup"} onValueChange={(value) => setIsLogin(value === "login")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="your@email.com"
                      required
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
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button type="submit" variant="hero" className="w-full">
                      Login
                    </Button>
                    {userType === "student" && (
                      <div className="text-center">
                        <Button
                          type="button"
                          variant="link"
                          className="p-0 h-auto text-sm"
                          onClick={() => {
                            onClose();
                            navigate("/passenger-login");
                          }}
                        >
                          Use Enhanced Login
                        </Button>
                      </div>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="signup">
            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="your@email.com"
                      required
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
                        placeholder="Create a strong password"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  {userType === "hero" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="vehicleNumber" className="flex items-center gap-2">
                          <Car className="w-4 h-4" />
                          Vehicle Number
                        </Label>
                        <Input
                          id="vehicleNumber"
                          value={formData.vehicleNumber}
                          onChange={(e) => handleInputChange("vehicleNumber", e.target.value)}
                          placeholder="HR-26-AX-1234"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="idProof" className="flex items-center gap-2">
                          <Upload className="w-4 h-4" />
                          ID Proof Upload
                        </Label>
                        <Input
                          id="idProof"
                          type="file"
                          accept=".jpg,.jpeg,.png,.pdf"
                          onChange={(e) => handleInputChange("idProof", e.target.files?.[0] || null)}
                          required
                        />
                        <p className="text-xs text-muted-foreground">
                          Upload your student ID or Aadhar card (JPG, PNG, PDF)
                        </p>
                      </div>
                    </>
                  )}

                  <div className="space-y-3">
                    <Button type="submit" variant="hero" className="w-full">
                      Create Account
                    </Button>
                    {userType === "student" && (
                      <div className="text-center">
                        <Button
                          type="button"
                          variant="link"
                          className="p-0 h-auto text-sm"
                          onClick={() => {
                            onClose();
                            navigate("/passenger-signup");
                          }}
                        >
                          Use Enhanced Signup
                        </Button>
                      </div>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;