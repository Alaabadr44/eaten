import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import projectsBg from "@/assets/texture-bg.png"; // Using texture background for consistency

interface ComingSoonProps {
    title: string;
}

const ComingSoon = ({ title }: ComingSoonProps) => {
    return (
        <div className="min-h-screen flex flex-col font-body">
            <Navigation />
            <div
                className="flex-grow flex items-center justify-center px-6 pt-[92px] py-12 relative overflow-hidden"
                style={{
                    backgroundImage: `url(${projectsBg})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                {/* Overlay to ensure readability while keeping texture */}
                <div className="absolute inset-0 bg-eaten-beige/80 backdrop-blur-[2px]"></div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-3xl w-full text-center space-y-10 relative z-10"
                >
                    <div className="space-y-4">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                        >
                            <span className="text-eaten-taupe font-heading uppercase tracking-[0.4em] text-xs font-semibold px-4 py-1 border border-eaten-taupe/30 rounded-full">
                                Under Development
                            </span>
                        </motion.div>

                        <h1 className="text-5xl md:text-7xl font-heading font-bold text-eaten-charcoal tracking-tight">
                            {title}
                        </h1>
                    </div>

                    <div className="flex items-center justify-center gap-4 py-2">
                        <div className="h-[1px] w-12 bg-eaten-taupe/50"></div>
                        <h2 className="text-3xl md:text-4xl font-heading text-eaten-dark italic font-light">
                            Coming Soon
                        </h2>
                        <div className="h-[1px] w-12 bg-eaten-taupe/50"></div>
                    </div>

                    <p className="text-xl text-eaten-charcoal/90 max-w-xl mx-auto leading-relaxed font-light">
                        We are currently meticulously crafting the <span className="font-semibold text-eaten-dark">{title}</span> experience.
                        Soon you will be able to enjoy exclusive benefits and seamless interaction with us.
                    </p>



                    <div className="pt-16 flex flex-col items-center gap-6">
                        <div className="flex gap-3">
                            <motion.div
                                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="w-1.5 h-1.5 rounded-full bg-eaten-taupe"
                            ></motion.div>
                            <motion.div
                                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
                                transition={{ repeat: Infinity, duration: 2, delay: 0.3 }}
                                className="w-1.5 h-1.5 rounded-full bg-eaten-taupe"
                            ></motion.div>
                            <motion.div
                                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
                                transition={{ repeat: Infinity, duration: 2, delay: 0.6 }}
                                className="w-1.5 h-1.5 rounded-full bg-eaten-taupe"
                            ></motion.div>
                        </div>
                        <p className="text-[10px] font-heading uppercase tracking-[0.5em] text-eaten-taupe/60">
                            Eaten Premium Experience
                        </p>
                    </div>
                </motion.div>
            </div>
            <Footer />
        </div>
    );
};

export default ComingSoon;
