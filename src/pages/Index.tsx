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
          <div className="text-2xl font-bold">GESTALA</div>
          <div className="hidden md:flex gap-8 text-sm">
            <a href="#home" className="hover:text-blue-400 transition">Home</a>
            <a href="#product" className="hover:text-blue-400 transition">Product</a>
            <a href="#about" className="hover:text-blue-400 transition">About</a>
            <a href="#contact" className="hover:text-blue-400 transition">Contact</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-50">
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="relative z-10 container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
              Better Brain<br />
              for Better<br />
              Humanity
            </h1>
          </div>
          <div className="flex justify-center">
            
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 border-t border-white/10">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-8">Mission</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <p className="text-gray-300 leading-relaxed">
              With decades study on neurophysics, we aim to utilize it through applying of neuroscience and AI technology, to provide comprehensive brain health solutions for the whole life cycle to enable neuroplasticity. We provide a product platform for intelligent brain health.
            </p>
            <p className="text-gray-300 leading-relaxed">
              聚焦脑健康领域，依托深厚的神经科学和AI技术，为全生命周期提供全面的脑健康解决方案，致力于挖掘大脑可塑性潜力，赋予人类更健康的大脑，助力实现更美好的人生。
            </p>
          </div>
        </div>
      </section>

      {/* Video Grid Section */}
      <section className="py-20 bg-black/50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-6 gap-4">
            {[...Array(18)].map((_, i) => <div key={i} className="aspect-square bg-gradient-to-br from-blue-600 to-blue-900 rounded-lg glow-blue flex items-center justify-center relative group cursor-pointer">
                {i === 9 && <div className="absolute inset-0 flex items-center justify-center">
                    <Play className="w-12 h-12 text-white" />
                  </div>}
                <span className="text-4xl font-bold opacity-50 group-hover:opacity-100 transition">8</span>
              </div>)}
          </div>
        </div>
      </section>

      {/* Product Section */}
      <section id="product" className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-12">Product</h2>
          
          {/* Product Series */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[{
            title: "Product Series 1",
            subtitle: "产品系列1",
            desc: "The standard used to evaluate your brain's health and user's brain function. It has been used to study and monitor brain health in various clinical settings, including stroke, TBI, ADHD, epilepsy, and more. Utilizing AI and big data, after years of accumulation, there are more than 10,000 brain health..."
          }, {
            title: "Product Series 2",
            subtitle: "产品系列2",
            desc: "Like a stethoscope for a heart or a blood pressure cuff, the standard used to evaluate your brain's health. Based on a century of research on EEG, we utilize the proprietary algorithm, based on AI and deep learning model to assess one's brain health..."
          }, {
            title: "Product Series 3",
            subtitle: "产品系列3",
            desc: "The standard used to evaluate your brain's health and function. Utilizing advanced EEG analysis with AI/ML technologies, based on decades of neuroscience, our algorithm provides comprehensive..."
          }].map((product, i) => <div key={i} className="border border-white/10 rounded-lg p-6 hover:border-blue-500/50 transition">
                <h3 className="text-xl font-bold mb-2">{product.title}</h3>
                <p className="text-sm text-gray-400 mb-4">{product.subtitle}</p>
                <p className="text-sm text-gray-300 leading-relaxed">{product.desc}</p>
              </div>)}
          </div>

          {/* Product Images */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <img src={product1} alt="Product 1" className="w-full h-64 object-cover rounded-lg" />
            <img src={product2} alt="Product 2" className="w-full h-64 object-cover rounded-lg" />
            <img src={product3} alt="Product 3" className="w-full h-64 object-cover rounded-lg" />
            <img src={product4} alt="Product 4" className="w-full h-64 object-cover rounded-lg col-span-2 md:col-span-1" />
            <img src={product5} alt="Product 5" className="w-full h-64 object-cover rounded-lg col-span-2" />
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-20 bg-black/50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-4">Solutions brought by</h2>
          <p className="text-4xl font-bold text-blue-400 mb-8">GESTALA to the industry</p>
        </div>
      </section>

      {/* News Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-4xl font-bold">News</h2>
            <a href="#" className="text-blue-400 hover:text-blue-300 transition">More+</a>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-lg overflow-hidden border border-white/10">
              <img src={news1} alt="News 1" className="w-full h-64 object-cover" />
              <div className="p-6">
                <p className="text-sm text-gray-400 mb-2">2025.06.25 TBI 10:57:21 EST</p>
                <h3 className="text-lg font-semibold">New AI Learning tool helps people understand the brain health</h3>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden border border-white/10">
              <img src={news2} alt="News 2" className="w-full h-64 object-cover" />
              <div className="p-6">
                <p className="text-sm text-gray-400 mb-2">2025.06.25 What the brain says about sleep study suggests brain health</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Icon Row */}
      <section className="py-12 bg-black/50">
        <div className="container mx-auto px-6">
          <div className="flex justify-center gap-8 flex-wrap">
            {[...Array(8)].map((_, i) => <div key={i} className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-blue-900 glow-blue"></div>)}
          </div>
        </div>
      </section>

      {/* CTA Buttons */}
      

      {/* Join Us Section */}
      <section className="py-20 bg-black/50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-8">Join Us</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="text-gray-300 space-y-4">
              <p>● R&D - Data Scientist (AI Inference) 2</p>
              <p>● R&D - Data Scientist (AI Inference) 1</p>
              <p>● R&D - Software Engineer 5</p>
              <p>● R&D - Software Engineer 3</p>
              <p>● Cloud Solutions Architect 2</p>
              <p>● Sales - Account Manager 2</p>
            </div>
            <div className="text-gray-300 space-y-4">
              <p>● Marketing 2</p>
              <p>● Marketing 1</p>
              <p>● Customer</p>
              <p>● Operations</p>
            </div>
          </div>
        </div>
      </section>

      {/* Get in Touch Section */}
      <section id="contact" className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-12">Get in Touch</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">Shanghai</h3>
              <p className="text-5xl font-bold text-blue-400 mb-4">10:45</p>
              <p className="text-gray-300">Room 2301, Building A, No. 123, Huaihai Road, Shanghai, China</p>
              <p className="text-gray-300 mt-2">+86 21 1234 5678</p>
              <p className="text-gray-300">info@gestala.com</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4">Chengdu</h3>
              <p className="text-5xl font-bold text-blue-400 mb-4">10:45</p>
              <p className="text-gray-300">Unit 1505, Tower B, No. 456, Tianfu Avenue, Chengdu, China</p>
              <p className="text-gray-300 mt-2">+86 28 8765 4321</p>
              <p className="text-gray-300">cd@gestala.com</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4">Contact</h3>
              <p className="text-gray-300">Email: contact@gestala.com</p>
              <p className="text-gray-300 mt-2">Phone: +1 (555) 123-4567</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/10">
        <div className="container mx-auto px-6">
          <h2 className="text-[120px] font-bold leading-none text-center md:text-9xl">Gestala</h2>
        </div>
      </footer>
    </div>;
};
export default Index;