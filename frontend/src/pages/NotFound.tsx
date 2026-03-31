import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import textureBg from "@/assets/texture-bg.png";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col font-body">
      <Navigation />
      <div
        className="flex-grow flex items-center justify-center px-6 pt-[92px] py-12 relative overflow-hidden"
        style={{
          backgroundImage: `url(${textureBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-eaten-beige/80 backdrop-blur-[1px]"></div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl w-full text-center space-y-8 relative z-10"
        >
          <div className="space-y-2">
            <h1 className="text-8xl md:text-9xl font-heading font-black text-eaten-charcoal opacity-20">
              404
            </h1>
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-eaten-charcoal -mt-10 md:-mt-16">
              Page Not Found
            </h2>
          </div>

          <p className="text-lg text-eaten-charcoal/80 max-w-md mx-auto leading-relaxed">
            The flavor you're looking for doesn't seem to exist here.
            Perhaps it was moved or changed?
          </p>

          <div className="pt-4">
            <Link
              to="/"
              className="inline-block px-10 py-4 bg-eaten-charcoal text-white rounded-full font-heading font-bold uppercase tracking-widest text-sm hover:bg-black transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1"
            >
              Return Home
            </Link>
          </div>

          <div className="flex justify-center gap-2 pt-12 grayscale opacity-40">
            <div className="w-1.5 h-1.5 rounded-full bg-eaten-charcoal"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-eaten-charcoal"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-eaten-charcoal"></div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
