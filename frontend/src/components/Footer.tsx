import { motion } from "framer-motion";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import footerBg from "@/assets/projects-footer-bg.png";

const Footer = () => {
  return (
    <footer
      className="relative py-8"
      style={{
        backgroundImage: `url(${footerBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-2"
          >
            <p className="text-white text-sm">
              <span className="font-medium">Address:</span>{" "}
              <a
                href="#"
                className="underline hover:text-eaten-beige transition-colors"
              >
                The industrial zone, New Cairo, Third settlement, No. 342, Cairo, Egypt.
              </a>
            </p>
            <p className="text-white text-sm">
              <span className="font-medium">Opening Hours:</span> Sunday - Thursday 9AM - 5PM
            </p>
            <p className="text-white text-sm">
              <span className="font-medium">Phone:</span>{" "}
              <a
                href="tel:+2611147-22"
                className="hover:text-eaten-beige transition-colors"
              >
                +2(611)147-22
              </a>
            </p>
          </motion.div>

          {/* Social Icons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex gap-4"
          >
            <a
              href="#"
              className="text-white hover:text-eaten-beige transition-colors"
              aria-label="Facebook"
            >
              <Facebook size={24} />
            </a>
            <a
              href="#"
              className="text-white hover:text-eaten-beige transition-colors"
              aria-label="Instagram"
            >
              <Instagram size={24} />
            </a>
            <a
              href="#"
              className="text-white hover:text-eaten-beige transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={24} />
            </a>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
