import { useState } from "react";
import { motion } from "framer-motion";
import { User, ChevronDown, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import eatenLogo from "@/assets/eaten-logo.png";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Catering", href: "/catering" },
    { name: "Loyalty Program", href: "/loyalty" },
    { name: "Contact Us", href: "/contact" },
  ];

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm"
    >
      <div className="container mx-auto px-6 h-[92px] flex items-center">
        <div className="flex items-center justify-between w-full">
          {/* Logo */}
          <Link to="/">
            <img src={eatenLogo} alt="Eaten" className="h-12 md:h-16 lg:h-20 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 lg:gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`nav-link ${isActive(link.href) ? "active" : ""}`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* User Icon */}
          <Link to="/admin/login" className="hidden md:flex items-center gap-2 cursor-pointer text-eaten-charcoal hover:text-black transition-colors">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <User size={20} />
            </div>
            <ChevronDown size={16} />
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-eaten-charcoal"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden absolute top-[92px] left-0 right-0 bg-white shadow-lg"
          >
            <div className="px-6 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`block py-3 text-eaten-charcoal font-medium hover:text-black transition-colors ${isActive(link.href) ? "text-black font-semibold" : ""}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navigation;
