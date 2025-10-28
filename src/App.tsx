import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { TransitionPage } from "@/components/animations";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import { HeroAuthProvider } from "@/contexts/HeroAuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import HeroProtectedRoute from "./components/HeroProtectedRoute";
import PassengerLogin from "./pages/PassengerLogin";
import PassengerSignup from "./pages/PassengerSignup";
import BookRide from "./pages/BookRide";
import PreBookRide from "./pages/PreBookRide";
import Payment from "./pages/Payment";
import RideConfirmation from "./pages/RideConfirmation";
import HeroRegistration from "./pages/HeroRegistration";
import About from "./pages/About";
import Feedback from "./pages/Feedback";
import Contact from "./pages/Contact";
import DriverLogin from "./pages/DriverLogin";
import HeroLogin from "./pages/HeroLogin";
import StudentDashboard from "./pages/StudentDashboard";
import DriverDashboard from "./pages/DriverDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <TransitionPage key={location.pathname}>
        <Routes location={location}>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Auth routes - redirect if already logged in */}
          <Route path="/passenger-login" element={
            <ProtectedRoute requireAuth={false}>
              <PassengerLogin />
            </ProtectedRoute>
          } />
          <Route path="/passenger-signup" element={
            <ProtectedRoute requireAuth={false}>
              <PassengerSignup />
            </ProtectedRoute>
          } />
          <Route path="/driver-login" element={<DriverLogin />} />
          <Route path="/hero-login" element={<HeroLogin />} />
          
          {/* Protected routes - require authentication */}
          <Route path="/book-ride" element={
            <ProtectedRoute>
              <BookRide />
            </ProtectedRoute>
          } />
          <Route path="/pre-book-ride" element={
            <ProtectedRoute>
              <PreBookRide />
            </ProtectedRoute>
          } />
          <Route path="/payment" element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          } />
          <Route path="/ride-confirmation" element={
            <ProtectedRoute>
              <RideConfirmation />
            </ProtectedRoute>
          } />
          <Route path="/student-dashboard" element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          } />
          
          {/* Hero/Driver routes */}
          <Route path="/become-hero" element={<HeroRegistration />} />
          <Route path="/hero-login" element={
            <HeroProtectedRoute requireAuth={false}>
              <HeroLogin />
            </HeroProtectedRoute>
          } />
          <Route path="/driver-dashboard" element={
            <HeroProtectedRoute>
              <DriverDashboard />
            </HeroProtectedRoute>
          } />
          
          {/* Admin routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TransitionPage>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AdminAuthProvider>
        <HeroAuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AnimatedRoutes />
          </BrowserRouter>
        </TooltipProvider>
        </HeroAuthProvider>
      </AdminAuthProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
