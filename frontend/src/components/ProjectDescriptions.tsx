import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const ProjectDescriptions = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section
            ref={ref}
            className="relative"
            style={{ backgroundColor: '#E8E7E7' }}
        >
            <div className="container mx-auto px-6 py-12">
                <div className="grid md:grid-cols-2 gap-12">
                    {/* Barbar Description */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <p className="leading-relaxed text-xl" style={{ fontFamily: 'Inter, sans-serif', color: '#271100' }}>
                            <strong className="font-bold">Barbar</strong> marks Eaten's first brand identity project,
                            bringing the original flavors of Lebanon to life. Our
                            expansion to The Drive reflects a commitment to
                            authenticity and culinary excellence. Our work focused
                            on introducing the brand to a new market, setting the
                            foundation for future locations.
                        </p>
                    </motion.div>

                    {/* E11VN Description */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        <p className="leading-relaxed text-xl" style={{ fontFamily: 'Inter, sans-serif', color: '#271100' }}>
                            <strong className="font-bold">E11VN</strong> is a vibrant concept serving matcha, sandos, and
                            specialty coffee, located at The Drive. Designed for
                            both coffee enthusiasts and music lovers, E11VN blends
                            modern café culture with live music experiences,
                            creating a unique community hub where people can
                            enjoy great flavors and great vibes.
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default ProjectDescriptions;
