import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import heroBrain from "@/assets/hero-brain.png";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import news1 from "@/assets/news-1.jpg";
import news2 from "@/assets/news-2.jpg";
const Index = () => {
  return <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          
          
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-50">
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        
      </section>

      {/* Mission Section */}
      

      {/* Video Grid Section */}
      

      {/* Product Section */}
      

      {/* Solutions Section */}
      

      {/* News Section */}
      

      {/* Icon Row */}
      

      {/* CTA Buttons */}
      

      {/* Join Us Section */}
      

      {/* Get in Touch Section */}
      

      {/* Footer */}
      <footer className="py-20 border-t border-white/10">
        <div className="container mx-auto px-6">
          <h2 className="text-[120px] font-bold leading-none text-center md:text-9xl">Gestala</h2>
        </div>
      </footer>
    </div>;
};
export default Index;