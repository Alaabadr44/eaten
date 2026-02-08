import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import welcomeBg from "@/assets/welcome-bg.png";
import eatenLogoWhite from "@/assets/eaten-logo-white.png";

const HeroSection = () => {
  return (
    <section
      id="home"
      className="relative h-[600px] flex items-center justify-center pt-24 pb-12"
      style={{
        backgroundImage: `url(${welcomeBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >


      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center">
          {/* Welcome Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex items-center justify-center gap-4">
              <p className="text-white text-2xl md:text-3xl font-body font-light">Welcome to</p>
              <span className="text-white text-4xl md:text-6xl lg:text-7xl" style={{ fontFamily: "'Brittany Signature', cursive", fontWeight: 400 }}>eaten</span>
            </div>
            <p className="text-white/90 text-base md:text-lg mb-6">
              Original Concepts & Unmatched Culinary Experiences
            </p>
          </motion.div>

          {/* Catering Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="catering-card max-w-2xl mx-auto text-center"
          >
            <p className="text-card-foreground text-lg font-medium leading-relaxed mb-4">
              EATEN delivers elevated catering experiences, crafted with care and built
              around your moments. From corporate events to private celebrations.
              Thoughtfully prepared, beautifully presented, and seamlessly served.
            </p>
            <Button variant="catering" size="lg">
              Book Catering
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
