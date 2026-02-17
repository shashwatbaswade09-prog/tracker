import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, UserCog, Lock, Mail, ArrowRight, User as UserIcon, Loader2 } from 'lucide-react';
import nexusLogo from '../assets/nexus-logo.jpg';
import { authApi } from '../services/api';

const LoginPage = () => {
    const [role, setRole] = useState<'admin' | 'editor' | null>(null);
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Form States
    const [loginIdentifier, setLoginIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [whopEmail, setWhopEmail] = useState('');

    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            await authApi.login(loginIdentifier, password);
            console.log('Login successful for role:', role);
            if (role === 'editor') {
                navigate('/editor/discover');
            } else if (role === 'admin') {
                navigate('/admin/dashboard');
            }
        } catch (err: any) {
            setError(err.message || 'Authentication failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            await authApi.register({
                email: loginIdentifier,
                username,
                password,
                whop_email: whopEmail
            });
            setSuccess('Account created successfully! You can now log in.');
            setMode('login');
            setPassword('');
        } catch (err: any) {
            setError(err.message || 'Registration failed');
        } finally {
            setIsLoading(false);
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
                        Secure access to NEXUS's administrative and content creation tools.
                    </motion.p>
                </div>

                {/* Right Side: Logic */}
                <div className="glass-panel p-8 md:p-10 min-h-[500px] flex flex-col justify-center">
                    <AnimatePresence mode="wait">
                        {!role ? (
                            <motion.div
                                key="role-selection"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="space-y-6"
                            >
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
                            </motion.div>
                        ) : (
                            <motion.div
                                key={`${mode}-form`}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <button
                                        onClick={() => {
                                            setRole(null);
                                            setError(null);
                                            setSuccess(null);
                                        }}
                                        className="text-xs font-bold text-orange-500 uppercase tracking-widest hover:text-orange-400"
                                    >
                                        ← Back
                                    </button>
                                    <button
                                        onClick={() => {
                                            setMode(mode === 'login' ? 'register' : 'login');
                                            setError(null);
                                            setSuccess(null);
                                        }}
                                        className="text-xs font-black text-amber-500 uppercase tracking-widest hover:text-amber-400 hover:scale-105 transition-all"
                                    >
                                        {mode === 'login' ? 'Create Account' : 'Back to Login'}
                                    </button>
                                </div>

                                <h3 className="text-2xl font-bold mb-2">
                                    {mode === 'login'
                                        ? (role === 'admin' ? 'Administrative Access' : 'Editorial Access')
                                        : 'Join the Network'
                                    }
                                </h3>
                                <p className="text-zinc-500 text-sm mb-6">
                                    {mode === 'login'
                                        ? 'Enter your credentials to continue to the dashboard.'
                                        : 'Fill out the details below to register as an Editor.'}
                                </p>

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-xs font-medium"
                                    >
                                        {error}
                                    </motion.div>
                                )}

                                {success && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-3 bg-green-500/10 border border-green-500/20 rounded text-green-400 text-xs font-medium"
                                    >
                                        {success}
                                    </motion.div>
                                )}

                                <form onSubmit={mode === 'login' ? handleLogin : handleRegister} className="space-y-4">
                                    {mode === 'register' && (
                                        <div className="grid grid-cols-1 gap-4">
                                            <div className="relative">
                                                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                                                <input
                                                    required
                                                    type="text"
                                                    placeholder="Username"
                                                    value={username}
                                                    onChange={(e) => setUsername(e.target.value)}
                                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-orange-500/50 transition-all text-white"
                                                />
                                            </div>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                                                <input
                                                    type="email"
                                                    placeholder="Whop Mail"
                                                    value={whopEmail}
                                                    onChange={(e) => setWhopEmail(e.target.value)}
                                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-orange-500/50 transition-all text-white"
                                                />
                                            </div>
                                        </div>
                                    )}
                                    <div className="relative">
                                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                                        <input
                                            required
                                            type="text"
                                            placeholder="Email or Username"
                                            value={loginIdentifier}
                                            onChange={(e) => setLoginIdentifier(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-orange-500/50 transition-all text-white"
                                        />
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                                        <input
                                            required
                                            type="password"
                                            placeholder="Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-orange-500/50 transition-all text-white"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="nexus-btn w-full mt-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? (
                                            <Loader2 className="animate-spin" size={18} />
                                        ) : (
                                            mode === 'login' ? 'Sign In' : 'Create Account'
                                        )}
                                        {!isLoading && <ArrowRight size={18} />}
                                    </button>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

            </div>
        </div>
    );
};

export default LoginPage;
