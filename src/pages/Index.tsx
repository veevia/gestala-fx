
import { Layout } from "@/components/Layout";
import { HeroSection } from "@/components/HeroSection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />

      {/* Blank Body Section */}
      <section className="h-[600px]"></section>
    </Layout>
  );
};
export default Index;