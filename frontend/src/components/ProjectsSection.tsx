import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import barbarLogo from "@/assets/barbar-logo.png";
import e11vnLogo from "@/assets/e11vn-logo.png";
import projectsBg from "@/assets/projects-bg.png";

const ProjectsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="projects"
      ref={ref}
      className="relative h-[271px] flex items-center"
      style={{
        backgroundImage: `url(${projectsBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >

      <div className="container mx-auto px-6 relative z-10 w-full">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-white text-2xl md:text-3xl lg:text-4xl font-bold mb-6 md:mb-8"
          style={{ fontFamily: 'Raleway, sans-serif' }}
        >
          Our Projects
        </motion.h2>

        {/* Brand Logos */}
        <div className="grid grid-cols-2 gap-4 md:gap-6 lg:gap-8">
          {/* Barbar */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center justify-center"
          >
            <img src={barbarLogo} alt="Barbar by D" className="h-24 w-24 md:h-36 md:w-36 lg:h-40 lg:w-40 object-contain" />
          </motion.div>

          {/* E11VN */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex items-center justify-center"
          >
            <img src={e11vnLogo} alt="E11VN" className="h-24 w-24 md:h-36 md:w-36 lg:h-40 lg:w-40 object-contain" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
