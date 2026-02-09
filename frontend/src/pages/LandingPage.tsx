import { motion } from 'framer-motion';
import { Zap, Star, ArrowRight, Play, Layout, Cpu } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="pt-32 pb-20 px-6 relative overflow-hidden">
            {/* Background Ambient Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-orange-600/5 blur-[150px] -z-10" />

            <div className="max-w-7xl mx-auto">
                {/* Hero Section */}
                <section className="text-center mb-32">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-block px-4 py-1.5 mb-8 text-xs font-bold tracking-[0.3em] uppercase bg-orange-500/10 text-orange-500 border border-orange-500/20 rounded-full">
                            Intelligence in Motion
                        </span>
                        <h1 className="text-6xl md:text-8xl font-bold mb-10 orange-gradient uppercase leading-[0.9]">
                            Next-Gen Media <br />
                            <span className="text-white">Orchestration.</span>
                        </h1>
                        <p className="text-xl text-zinc-400 max-w-3xl mx-auto mb-12 font-light leading-relaxed">
                            Consolidate your digital assets, automate your workflows, and scale your media presence with NEXUS MEDIA's proprietary toolset.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <button className="nexus-btn text-lg px-10 py-5 w-full sm:w-auto">
                                Join the Network
                            </button>
                            <button className="nexus-btn-outline text-lg px-10 py-5 w-full sm:w-auto">
                                View Solutions
                            </button>
                        </div>
                    </motion.div>
                </section>

                {/* Feature Grid */}
                <section className="mb-32">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: <Play className="text-orange-500" />, title: "Stream Engine", desc: "Real-time media processing with ultra-low latency." },
                            { icon: <Layout className="text-orange-500" />, title: "Asset Hub", desc: "Military-grade encryption for all your digital properties." },
                            { icon: <Cpu className="text-orange-500" />, title: "Automate AI", desc: "Custom AI models built specifically for media scaling." }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="glass-panel p-8 group hover:scale-[1.02] transition-transform"
                            >
                                <div className="w-14 h-14 rounded-xl bg-orange-500/10 flex items-center justify-center mb-6 border border-orange-500/20">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-4 uppercase tracking-wider">{feature.title}</h3>
                                <p className="text-zinc-500 text-sm leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Featured Network Section */}
                <section>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
                        <div>
                            <h2 className="text-4xl font-bold uppercase tracking-widest text-white mb-2">Featured Network</h2>
                            <p className="text-zinc-500">The most influential media channels on our platform.</p>
                        </div>
                        <button className="text-orange-500 flex items-center gap-2 font-bold uppercase tracking-widest text-sm hover:gap-3 transition-all">
                            Full Network Directory <ArrowRight size={18} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((item) => (
                            <motion.div
                                key={item}
                                whileHover={{ scale: 1.02 }}
                                className="glass-card overflow-hidden group border-orange-500/5 hover:border-orange-500/20"
                            >
                                <div className="aspect-[16/10] bg-zinc-900 relative overflow-hidden">
                                    <img
                                        src={`https://images.unsplash.com/photo-${1485827404703 + item}?auto=format&fit=crop&q=80&w=800`}
                                        alt="Product"
                                        className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity grayscale hover:grayscale-0 duration-700"
                                    />
                                    <div className="absolute top-4 right-4 glass-panel px-3 py-1 flex items-center gap-1 text-xs font-bold text-orange-400 border-orange-500/30">
                                        <Zap size={14} /> ACTIVE
                                    </div>
                                </div>
                                <div className="p-8">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 rounded-lg bg-orange-600/20 flex items-center justify-center border border-orange-600/30">
                                            <Star size={20} className="text-orange-500" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg uppercase tracking-wider">Apex Media Group</h3>
                                            <p className="text-xs text-orange-500/60 font-bold tracking-widest">NEXUS PARTNER</p>
                                        </div>
                                    </div>
                                    <p className="text-zinc-500 text-sm mb-8 leading-relaxed">
                                        Exclusive access to high-tier media assets and automated cross-platform distribution networks.
                                    </p>
                                    <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                        <span className="text-2xl font-bold text-white">$2,499<span className="text-xs text-zinc-600 font-normal ml-1">PA</span></span>
                                        <button className="text-xs font-bold text-orange-500 uppercase tracking-[0.2em] hover:text-orange-300 transition-colors">
                                            View Channel
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default LandingPage;
