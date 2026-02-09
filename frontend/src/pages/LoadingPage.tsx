import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import nexusLogo from '../assets/nexus-logo.jpg';

interface LoadingPageProps {
    onComplete: () => void;
}

const LoadingPage = ({ onComplete }: LoadingPageProps) => {
    const [step, setStep] = useState(0);

    useEffect(() => {
        const timers = [
            setTimeout(() => setStep(1), 1000),
            setTimeout(() => setStep(2), 2500),
            setTimeout(() => setStep(3), 4500),
            setTimeout(() => onComplete(), 6000),
        ];
        return () => timers.forEach(clearTimeout);
    }, [onComplete]);

    return (
        <div className="fixed inset-0 bg-black flex flex-center items-center justify-center z-[100] overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[120px]" />
            </div>

            <div className="relative text-center px-6">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="logo"
                            initial={{ opacity: 0, scale: 0.9, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 1.05, y: -10 }}
                            transition={{
                                duration: 1.2,
                                ease: [0.16, 1, 0.3, 1]
                            }}
                            className="flex flex-col items-center will-animate"
                        >
                            <img
                                src={nexusLogo}
                                alt="Nexus"
                                className="w-32 h-32 rounded-2xl mb-8 logo-pulse"
                            />
                            <h1 className="text-4xl md:text-5xl font-bold tracking-[0.2em] orange-gradient uppercase">
                                Nexus
                            </h1>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="desc"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            transition={{
                                duration: 1,
                                ease: [0.16, 1, 0.3, 1]
                            }}
                            className="max-w-xl will-animate"
                        >
                            <p className="text-2xl md:text-3xl font-light text-zinc-300 leading-relaxed italic">
                                "The future of digital media management, redefined."
                            </p>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="final"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1 }}
                            className="flex flex-col items-center will-animate"
                        >
                            <div className="w-16 h-[1px] bg-orange-500 mb-8" />
                            <p className="text-sm tracking-[0.5em] uppercase text-orange-500/80 font-bold">
                                Initializing Systems
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default LoadingPage;
