import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, ShieldCheck, Mail, Phone, Instagram } from 'lucide-react';

const VideoCard = ({ videoSrc, delay }: { videoSrc: string, delay: number }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    const handleMouseEnter = () => {
        videoRef.current?.play();
    };

    const handleMouseLeave = () => {
        videoRef.current?.pause();
        if (videoRef.current) videoRef.current.currentTime = 0;
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="group relative aspect-[9/16] rounded-3xl overflow-hidden border border-white/5 hover:border-orange-500/30 transition-all shadow-2xl shadow-orange-500/0 hover:shadow-orange-500/10 bg-zinc-900"
        >
            <video
                ref={videoRef}
                src={videoSrc}
                loop
                muted
                playsInline
                className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

            <div className="absolute inset-0 flex flex-col justify-end p-8" />
        </motion.div>
    );
};

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-[#000000] text-white pt-32 pb-20 px-6 relative overflow-hidden">
            {/* ROI Media Inspired Radial Glows */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-900/10 blur-[120px] rounded-full" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,107,0,0.03)_0%,transparent_70%)]" />
            </div>

            <div className="max-w-7xl mx-auto">
                {/* Hero Section */}
                <section className="text-center mb-40 relative">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <span className="inline-block px-6 py-2 mb-8 text-[10px] font-bold tracking-[0.4em] uppercase bg-orange-500/5 text-orange-500 border border-orange-500/10 rounded-full backdrop-blur-sm">
                            The Ultimate Clipping Infrastructure
                        </span>

                        <h1 className="text-7xl md:text-9xl font-bold mb-8 tracking-tighter leading-[0.85] uppercase">
                            Grow Your Brand <br />
                            <span className="orange-gradient text-glow">With Clipping.</span>
                        </h1>

                        <p className="text-xl text-zinc-500 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
                            We build you a mass content distribution system that scales your brand to new heights with an army of clippers.
                        </p>

                        {/* Social Proof Metric */}
                        <div className="flex flex-col items-center justify-center mb-16">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5 }}
                                className="flex flex-col items-center"
                            >
                                <span className="text-5xl md:text-6xl font-black tabular-nums tracking-tight">500,000,000+</span>
                                <span className="text-zinc-600 font-bold tracking-[0.2em] uppercase text-xs mt-2">Views tracked for your favorite creators</span>
                            </motion.div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <button className="nexus-btn text-lg px-12 py-5 w-full sm:w-auto rounded-xl">
                                Join the Network
                            </button>
                            <button className="nexus-btn-outline text-lg px-12 py-5 w-full sm:w-auto rounded-xl bg-white/5 backdrop-blur-md">
                                View Solutions
                            </button>
                        </div>
                    </motion.div>

                    {/* Category Scroller (ROI Media Style) */}
                    <div className="mt-24 overflow-hidden py-10 border-y border-white/5">
                        <motion.div
                            animate={{ x: [0, -1000] }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="flex gap-20 whitespace-nowrap"
                        >
                            {["Streamers", "Coaches", "Creators", "Musicians", "Athletes", "Brands", "Influencers", "Gamers"].map((cat) => (
                                <span key={cat} className="text-4xl md:text-5xl font-bold text-zinc-800 uppercase tracking-widest hover:text-orange-500/20 transition-colors cursor-default">
                                    {cat}
                                </span>
                            ))}
                        </motion.div>
                    </div>
                </section>
                {/* Social Links Section */}
                <section className="mb-40">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold uppercase tracking-tight text-white mb-4">Connect With Our Community</h2>
                        <p className="text-zinc-500 text-lg">Join the army of creators dominating the digital space.</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            {
                                name: "Discord",
                                color: "hover:border-orange-500/50 hover:bg-orange-500/[0.05]",
                                iconColor: "text-orange-500",
                                link: "https://discord.gg/NmYKQjJBU2",
                                icon: (
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.06.06 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                                    </svg>
                                )
                            },
                            {
                                name: "WhatsApp",
                                color: "hover:border-orange-500/50 hover:bg-orange-500/[0.05]",
                                iconColor: "text-orange-500",
                                link: "https://chat.whatsapp.com/KZFHke579k2ETgc8fhzItG?mode=gi_t",
                                icon: (
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                    </svg>
                                )
                            },
                            {
                                name: "Instagram",
                                color: "hover:border-orange-500/50 hover:bg-orange-500/[0.05]",
                                iconColor: "text-orange-500",
                                link: "https://www.instagram.com/nexusmediaorg?igsh=MWpxMDd4NW9nbHJ6ZA==",
                                icon: (
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                                    </svg>
                                )
                            },
                            {
                                name: "Whop",
                                color: "hover:border-orange-500/50 hover:bg-orange-500/[0.05]",
                                iconColor: "text-orange-500",
                                link: "https://whop.com/nexusmediaorg",
                                icon: (
                                    <svg width="24" height="24" viewBox="165 115 280 85" fill="currentColor">
                                        <path d="M201.221 117.811c-14.791 0-24.987 6.49-32.703 13.829 0 0-3.116 2.953-3.076 3.043l32.405 32.405 32.4-32.405c-6.136-8.447-17.704-16.872-29.026-16.872Zm80.009.004c-14.791 0-24.987 6.49-32.704 13.83 0 0-2.845 2.873-2.975 3.042l-40.054 40.06 32.355 32.354 72.403-72.414c-6.136-8.447-17.698-16.872-29.025-16.872Zm80.244-.004c-14.791 0-24.987 6.49-32.703 13.829 0 0-2.964 2.897-3.076 3.043l-80.125 80.136 8.481 8.481c13.121 13.121 34.599 13.121 47.719 0l88.629-88.617h.101c-6.136-8.447-17.699-16.872-29.026-16.872Z" />
                                    </svg>
                                )
                            }
                        ].map((social, i) => (
                            <motion.a
                                key={social.name}
                                href={social.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className={`flex flex-col items-center justify-center p-8 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-md transition-all duration-300 ${social.color} group`}
                            >
                                <div className={`w-12 h-12 flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300 ${social.iconColor}`}>
                                    {social.icon}
                                </div>
                                <span className="text-sm font-bold uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">{social.name}</span>
                            </motion.a>
                        ))}
                    </div>
                </section>

                {/* Our Results Section (ROI Media Style) */}
                <section className="mb-40">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-bold uppercase tracking-tight text-white mb-4">Our Results</h2>
                        <p className="text-zinc-500 text-lg">Mass distribution strategies that crush the algorithm.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <VideoCard videoSrc="/assets/results/1.mp4" delay={0.1} />
                        <VideoCard videoSrc="/assets/results/2.mp4" delay={0.2} />
                        <VideoCard videoSrc="/assets/results/4.mp4" delay={0.3} />
                        <VideoCard videoSrc="/assets/results/5.mp4" delay={0.4} />
                        <VideoCard videoSrc="/assets/results/6.mp4" delay={0.5} />
                        <VideoCard videoSrc="/assets/results/7.mp4" delay={0.6} />
                    </div>
                </section>

                {/* Contact Section */}
                <section className="mb-40">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold uppercase tracking-tight text-white mb-4">Direct From the Founder</h2>
                        <p className="text-zinc-500 text-lg">Direct access to the elite team behind the engine.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {[
                            {
                                label: "Email",
                                value: "nexus@thenexusmedia.org",
                                icon: <Mail className="text-orange-500" />,
                                href: "mailto:nexus@thenexusmedia.org"
                            },
                            {
                                label: "Phone",
                                value: "+91 9834613309",
                                icon: <Phone className="text-orange-500" />,
                                href: "tel:+919834613309"
                            },
                            {
                                label: "Instagram",
                                value: "@aryan_kole",
                                icon: <Instagram className="text-orange-500" />,
                                href: "https://www.instagram.com/aryan_kole?igsh=b2QyNjZsejFnYW9k"
                            }
                        ].map((contact, i) => (
                            <motion.a
                                key={contact.label}
                                href={contact.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="glass-panel p-8 group hover:bg-orange-500/[0.02] transition-all border-white/5 hover:border-orange-500/20 text-center"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-orange-500/5 flex items-center justify-center mb-6 mx-auto border border-white/5 group-hover:border-orange-500/30 transition-all">
                                    {contact.icon}
                                </div>
                                <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-2">{contact.label}</h3>
                                <p className="text-xl font-bold text-white tracking-tight">{contact.value}</p>
                            </motion.a>
                        ))}
                    </div>
                </section>

                {/* Core Pillars */}
                <section className="mb-40">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: <TrendingUp className="text-orange-500" />, title: "Stage 1: Launch", desc: "Initialize your content engine with our proprietary distribution framework." },
                            { icon: <Users className="text-orange-500" />, title: "Stage 2: Coach", desc: "Our elite team optimization ensures every clip hits the maximum possible audience." },
                            { icon: <ShieldCheck className="text-orange-500" />, title: "Stage 3: Scale", desc: "Automate your growth and dominate multiple platforms simultaneously." }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="glass-panel p-10 group hover:bg-orange-500/[0.02] transition-all border-white/5 hover:border-orange-500/20"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-orange-500/5 flex items-center justify-center mb-8 border border-white/5 group-hover:border-orange-500/30 transition-all">
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-bold mb-4 uppercase tracking-tighter">{feature.title}</h3>
                                <p className="text-zinc-500 text-base leading-relaxed font-medium">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default LandingPage;

