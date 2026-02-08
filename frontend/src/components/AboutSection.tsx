import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import aboutBg from "@/assets/about-section-bg.png";

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="about"
      ref={ref}
      className="relative py-20 md:py-32"
      style={{
        backgroundImage: `url(${aboutBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-white text-3xl md:text-4xl font-bold mb-8">
            About Us
          </h2>
        </motion.div>

        <div className="max-w-4xl">
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-white font-body text-xl font-medium leading-relaxed mb-6"
          >
            EATEN was established at the end of 2021 as a multi-brand food and hospitality group operating
            across restaurants, QSR, cloud kitchens, and catering. Our journey began with Barbar, one of
            Lebanon's pioneering restaurant brands, setting the foundation for quality, consistency, and
            memorable experiences.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-white font-body text-xl font-medium leading-relaxed"
          >
            Our portfolio includes Barbar and E11VN, with plans to expand both concepts across Egypt's most
            premium locations. In addition to growing our own brands, we also aim to partner with and manage
            other restaurant concepts, bringing our expertise in operations and customer experience to a wider
            range of culinary ventures. Our catering services continue to serve corporate events, private
            gatherings, and large-scale occasions, reflecting our commitment to excellence across every aspect
            of food and hospitality.
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
