import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import BookRide from "./pages/BookRide";
import Payment from "./pages/Payment";
import RideConfirmation from "./pages/RideConfirmation";
import HeroRegistration from "./pages/HeroRegistration";
import About from "./pages/About";
import Feedback from "./pages/Feedback";
import Contact from "./pages/Contact";
import DriverLogin from "./pages/DriverLogin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/book-ride" element={<BookRide />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/ride-confirmation" element={<RideConfirmation />} />
          <Route path="/become-hero" element={<HeroRegistration />} />
          <Route path="/about" element={<About />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/driver-login" element={<DriverLogin />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
