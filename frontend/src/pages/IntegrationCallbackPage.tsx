import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { integrationsApi } from '../services/api';
import { Loader2, CheckCircle2, XCircle, ShieldCheck } from 'lucide-react';

const IntegrationCallbackPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        const handleCallback = async () => {
            const code = searchParams.get('code');
            const state = searchParams.get('state');

            if (!code) {
                setStatus('error');
                setErrorMsg('Authorization code not found. Connection failed.');
                return;
            }

            // Determine platform from state
            let platform = 'YOUTUBE';
            if (state?.includes('tiktok')) platform = 'TIKTOK';
            if (state?.includes('instagram')) platform = 'INSTAGRAM';

            try {
                await integrationsApi.oauthExchange(platform, code);
                setStatus('success');
                setTimeout(() => {
                    navigate('/editor/verification');
                }, 2000);
            } catch (err: any) {
                console.error('OAuth exchange failed:', err);
                setStatus('error');
                setErrorMsg(err.message || 'Failed to link account. Please try again.');
            }
        };

        handleCallback();
    }, [searchParams, navigate]);

    return (
        <div className="min-h-screen bg-[#020202] text-white flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md glass-panel p-10 text-center border-white/5 relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-orange-500/20" />
                <div className="absolute top-0 left-0 h-1 bg-orange-500 transition-all duration-1000" style={{ width: status === 'success' ? '100%' : '50%' }} />

                <div className="mb-8 flex justify-center">
                    {status === 'loading' && (
                        <div className="relative">
                            <Loader2 size={64} className="text-orange-500 animate-spin" />
                            <ShieldCheck size={24} className="absolute inset-0 m-auto text-orange-500/50" />
                        </div>
                    )}
                    {status === 'success' && (
                        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20">
                            <CheckCircle2 size={32} className="text-green-500" />
                        </div>
                    )}
                    {status === 'error' && (
                        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
                            <XCircle size={32} className="text-red-500" />
                        </div>
                    )}
                </div>

                <h2 className="text-2xl font-black uppercase tracking-tighter mb-4">
                    {status === 'loading' && 'Authenticating...'}
                    {status === 'success' && 'Connection Successful'}
                    {status === 'error' && 'Connection Failed'}
                </h2>

                <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest leading-relaxed">
                    {status === 'loading' && 'Syncing your network credentials with Nexus security layers.'}
                    {status === 'success' && 'Your account has been successfully linked. Redirecting you back...'}
                    {status === 'error' && errorMsg}
                </p>

                {status === 'error' && (
                    <button
                        onClick={() => navigate('/editor/verification')}
                        className="mt-8 w-full py-4 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                    >
                        Go Back to Verification
                    </button>
                )}
            </motion.div>
        </div>
    );
};

export default IntegrationCallbackPage;
