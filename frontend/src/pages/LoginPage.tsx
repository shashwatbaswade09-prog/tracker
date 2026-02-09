import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, UserCog, Lock, Mail, ArrowRight } from 'lucide-react';
import nexusLogo from '../assets/nexus-logo.jpg';

const LoginPage = () => {
    const [role, setRole] = useState<'admin' | 'editor' | null>(null);
    const navigate = useNavigate();

    const handleLogin = () => {
        console.log('Attempting login for role:', role);
        if (role === 'editor') {
            navigate('/editor/discover');
        } else if (role === 'admin') {
            navigate('/admin/dashboard');
        } else {
            console.warn('No role selected for login');
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-600/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10">

                {/* Left Side: Branding */}
                <div className="text-center md:text-left pr-0 md:pr-12">
                    <motion.img
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        src={nexusLogo}
                        className="w-20 h-20 rounded-xl mb-6 mx-auto md:mx-0"
                    />
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl font-bold mb-4 orange-gradient uppercase"
                    >
                        Nexus Portal
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-zinc-400 text-lg leading-relaxed"
                    >
                        Secure access to NEXUS MEDIA's administrative and content creation tools.
                    </motion.p>
                </div>

                {/* Right Side: Logic */}
                <div className="glass-panel p-8 md:p-10">
                    {!role ? (
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold mb-8 text-center uppercase tracking-widest text-zinc-300">Select Identity</h3>

                            <button
                                onClick={() => setRole('admin')}
                                className="w-full flex items-center gap-6 p-6 glass-card group hover:border-orange-500/50 transition-all text-left"
                            >
                                <div className="w-14 h-14 rounded-full bg-orange-500/10 flex items-center justify-center group-hover:bg-orange-500/20 transition-all">
                                    <Shield className="text-orange-500" size={28} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-lg">Nexus Admin</h4>
                                    <p className="text-sm text-zinc-500">Full system & user management</p>
                                </div>
                            </button>

                            <button
                                onClick={() => setRole('editor')}
                                className="w-full flex items-center gap-6 p-6 glass-card group hover:border-amber-500/50 transition-all text-left"
                            >
                                <div className="w-14 h-14 rounded-full bg-amber-500/10 flex items-center justify-center group-hover:bg-amber-500/20 transition-all">
                                    <UserCog className="text-amber-500" size={28} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-lg">Nexus Editor</h4>
                                    <p className="text-sm text-zinc-500">Content curation & assets</p>
                                </div>
                            </button>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-6"
                        >
                            <button
                                onClick={() => setRole(null)}
                                className="text-xs font-bold text-orange-500 uppercase tracking-widest hover:text-orange-400 mb-4 inline-block"
                            >
                                ← Change Role
                            </button>

                            <h3 className="text-2xl font-bold mb-2">
                                {role === 'admin' ? 'Administrative Access' : 'Editorial Access'}
                            </h3>
                            <p className="text-zinc-500 text-sm mb-6">Enter your credentials to continue to the dashboard.</p>

                            <div className="space-y-4">
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                                    <input
                                        type="email"
                                        placeholder="Email Address"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-orange-500/50 transition-all"
                                    />
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-orange-500/50 transition-all"
                                    />
                                </div>
                                <button
                                    onClick={handleLogin}
                                    className="nexus-btn w-full mt-4 flex items-center justify-center gap-2"
                                >
                                    Sign In <ArrowRight size={18} />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default LoginPage;
