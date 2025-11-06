
import { Layout } from "@/components/Layout";
import { HeroSection } from "@/components/HeroSection";
import { useRef } from "react";

const Index = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  return (
    <Layout pageTitle="Home">
      <HeroSection videoRef={videoRef} />

      {/* Blank Body Section */}
      <section className="h-[600px]"></section>
    </Layout>
  );
};
export default Index;