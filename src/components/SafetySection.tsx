import { Shield, MapPin, Headphones, HardHat } from "lucide-react"

const SafetySection = () => {
  const safetyFeatures = [
    {
      icon: Shield,
      title: "Verified Heroes",
      description: "All our drivers are ID-verified students from your campus"
    },
    {
      icon: MapPin,
      title: "Live Tracking",
      description: "Real-time ride tracking for your safety (coming soon)"
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Round-the-clock assistance for any issues or emergencies"
    },
    {
      icon: HardHat,
      title: "Helmet Mandatory",
      description: "Safety first - helmets provided for every ride"
    }
  ]

  return (
    <section className="py-16 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 fade-in">
          <h2 className="text-3xl font-bold mb-4">Your Safety is Our Priority</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We've built Campus X with safety and trust at the core. Here's how we ensure every ride is secure.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {safetyFeatures.map((feature, index) => (
            <div 
              key={index} 
              className="text-center p-6 bg-card rounded-xl shadow-sm hover:shadow-md transition-all duration-300 slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <div className="bg-hero/5 border border-hero/20 rounded-lg p-6 max-w-2xl mx-auto">
            <p className="text-muted-foreground">
              <strong className="text-foreground">Campus X Promise:</strong> We're committed to making campus transportation 
              safer, more reliable, and more affordable for every student.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SafetySection