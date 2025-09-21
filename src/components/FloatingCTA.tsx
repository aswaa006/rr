import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const FloatingCTA = () => {
  return (
    <Link to="/book-ride" className="floating-cta">
      <Button variant="cta" size="xl" className="rounded-full shadow-2xl">
        Book Ride Now
      </Button>
    </Link>
  );
};

export default FloatingCTA;