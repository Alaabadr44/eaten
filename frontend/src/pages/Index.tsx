import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ProjectsSection from "@/components/ProjectsSection";
import ProjectDescriptions from "@/components/ProjectDescriptions";
import GallerySection from "@/components/GallerySection";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";

const Index = () => {
  return (
    <main className="overflow-x-hidden">
      <Navigation />
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <ProjectDescriptions />
      <GallerySection />
      <Footer />
      <Chatbot />
    </main>
  );
};

export default Index;
