import { motion } from 'framer-motion';
import { Construction, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ComingSoonPageProps {
    title: string;
}

const ComingSoonPage = ({ title }: ComingSoonPageProps) => {
    return (
        <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden bg-[#050505]">
            {/* Background Ambient Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] bg-orange-600/10 blur-[150px] -z-10" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl w-full text-center"
            >
                <div className="glass-panel p-12 relative overflow-hidden border-orange-500/20">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-50" />

                    <motion.div
                        animate={{
                            rotate: [0, -10, 10, -10, 0],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="w-20 h-20 rounded-2xl bg-orange-500/10 flex items-center justify-center mx-auto mb-8 border border-orange-500/20"
                    >
                        <Construction className="text-orange-500 w-10 h-10" />
                    </motion.div>

                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-[0.2em] orange-gradient mb-4">
                        {title}
                    </h1>

                    <div className="inline-block px-4 py-1 mb-8 text-[10px] font-bold tracking-[0.4em] uppercase bg-black/40 text-orange-500/80 border border-orange-500/10 rounded-full">
                        System Module: Under Construction
                    </div>

                    <p className="text-zinc-400 text-lg font-light leading-relaxed mb-12">
                        Our engineers are currently orchestrating the <span className="text-white font-medium">{title}</span> infrastructure.
                        This node will be integrated into the NEXUS network shortly.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/" className="nexus-btn flex items-center gap-2 px-8 py-3 text-sm">
                            <ArrowLeft size={16} /> Return to Hub
                        </Link>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 text-zinc-600 text-xs uppercase tracking-[0.3em] font-medium"
                >
                    NEXUS Core v1.0.4 • Signal Stable
                </motion.div>
            </motion.div>
        </div>
    );
};

export default ComingSoonPage;
