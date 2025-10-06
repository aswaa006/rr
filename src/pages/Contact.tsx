import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import FloatingCTA from "@/components/FloatingCTA";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Clock, MessageCircle, HelpCircle } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <FloatingCTA />

      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="fade-in text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
          <p className="text-xl text-muted-foreground">
            Need help? Have questions? We're here for you!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="slide-up shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-primary" />
                  Support Hotline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-primary mb-2">+91 1023456789</p>
                <p className="text-muted-foreground">Available 24/7 for emergency support</p>
                <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  Response time: 2-5 minutes
                </div>
              </CardContent>
            </Card>

            <Card className="slide-up shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-secondary" />
                  Email Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold mb-2">support@campusx.edu</p>
                <p className="text-muted-foreground mb-3">For detailed queries and feedback</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  Response time: 2-4 hours
                </div>
              </CardContent>
            </Card>

            <Card className="slide-up shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-success" />
                  Campus Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold mb-2">PUGO Headquarters</p>
                <p className="text-muted-foreground mb-3">
                  Student Activity Center<br />
                  Room 201, Second Floor<br />
                  University Campus, 110001
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  Mon-Fri: 9AM - 6PM
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Campus Map & Quick Actions */}
          <div className="space-y-6">
            <Card className="slide-up shadow-lg">
              <CardHeader>
                <CardTitle>Campus Map</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-8 text-center">
                  <MapPin className="w-16 h-16 text-primary mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Campus map showing the geographical layout of the campus
                  </p>

                  {/* Embed your map location URL below in the iframe src */}
                  <div className="mt-6 mx-auto max-w-full h-64 rounded-lg overflow-hidden border border-primary/30">
                    <iframe
                      title="PUGO Map"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3890.136478182118!2d80.01357431485576!3d13.028270808301927!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a528b827687f127%3A0xca9d2e9fba575931!2sSaveetha%20University!5e0!3m2!1sen!2sin!4v1695555432100"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen={true}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>

                  <Button variant="outline" className="mt-4">
                    View Full Map
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="slide-up shadow-lg">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link to="/feedback" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Share Feedback
                  </Button>
                </Link>

                <Button variant="outline" className="w-full justify-start">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  FAQ & Help Center
                </Button>

                <Link to="/become-hero" className="block">
                  <Button variant="secondary" className="w-full justify-start">
                    <Phone className="w-4 h-4 mr-2" />
                    Report Emergency
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="slide-up border-primary/20 bg-primary/5">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3">Need Immediate Help?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  For urgent ride issues or safety concerns, call our 24/7 hotline
                </p>
                <Button variant="hero" className="w-full">
                  Call Support Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="mt-16">
          <div className="text-center mb-8 fade-in">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">Quick answers to common questions</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="slide-up">
              <CardHeader>
                <CardTitle className="text-lg">How do I book a ride?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Simply select your pickup and drop locations, choose pre-booking for 
                  a ₹5 discount, and proceed to payment. A Hero will be assigned immediately!
                </p>
              </CardContent>
            </Card>

            <Card className="slide-up">
              <CardHeader>
                <CardTitle className="text-lg">Is it safe to ride with Heroes?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Absolutely! All Heroes are verified students with proper documentation. 
                  Every ride is tracked and monitored for your safety.
                </p>
              </CardContent>
            </Card>

            <Card className="slide-up">
              <CardHeader>
                <CardTitle className="text-lg">What if my Hero is late?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Heroes typically arrive within 5-7 minutes. If there's a delay, 
                  you'll receive automatic updates and can contact them directly.
                </p>
              </CardContent>
            </Card>

            <Card className="slide-up">
              <CardHeader>
                <CardTitle className="text-lg">Can I cancel a booked ride?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes, you can cancel rides up to 2 minutes after booking for a full refund. 
                  After that, standard cancellation charges apply.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Contact;
