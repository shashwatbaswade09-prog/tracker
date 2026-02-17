import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import EditorSidebar from '../components/EditorSidebar';
import { integrationsApi, type ConnectedAccount } from '../services/api';
import {
    Instagram, Youtube, Plus, X,
    CheckCircle2, ExternalLink, Mail, ShieldCheck,
    Loader2
} from 'lucide-react';

const VerificationPage = () => {
    const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
    const [metrics, setMetrics] = useState<{ [key: number]: any }>({});
    const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
    const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
    const [manualHandle, setManualHandle] = useState("");
    const [whopEmail, setWhopEmail] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isLinking, setIsLinking] = useState(false);

    // Initial load
    useEffect(() => {
        const fetchData = async () => {
            try {
                const accountsData = await integrationsApi.getAccounts();
                // Handle paginated response structure if present
                const accountsList = Array.isArray(accountsData)
                    ? accountsData
                    : (accountsData as any)?.results || [];
                setAccounts(accountsList);

                // Fetch metrics for verified accounts
                const verifiedAccounts = accountsList.filter((a: ConnectedAccount) => a.status === 'VERIFIED');
                const metricsPromises = verifiedAccounts.map(async (acc: ConnectedAccount) => {
                    try {
                        const m = await integrationsApi.getAccountMetrics(acc.id);
                        return { id: acc.id, metrics: m };
                    } catch (e) {
                        console.error(`Failed to fetch metrics for account ${acc.id}:`, e);
                        return null;
                    }
                });

                const metricsResults = await Promise.all(metricsPromises);
                const metricsMap: { [key: number]: any } = {};
                metricsResults.forEach(res => {
                    if (res) metricsMap[res.id] = res.metrics;
                });
                setMetrics(metricsMap);

                const savedEmail = localStorage.getItem('nexus_whop_email');
                if (savedEmail) setWhopEmail(savedEmail);
            } catch (err) {
                console.error('Failed to fetch verification data:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleConnect = async () => {
        if (!selectedPlatform) return;

        setIsLinking(true);
        try {
            // Check if OAuth is configured (simple heuristic)
            // If it fails or we want to allow manual linking as a preference:
            if (manualHandle) {
                const newAcc = await integrationsApi.manualLink(selectedPlatform.toUpperCase(), manualHandle);
                setAccounts(prev => [...prev.filter(a => a.id !== newAcc.id), newAcc]);
                setIsVerifyModalOpen(false);
                setSelectedPlatform(null);
                setManualHandle("");
            } else {
                const { url } = await integrationsApi.getConnectUrl(selectedPlatform.toUpperCase());
                window.location.href = url;
            }
        } catch (err) {
            console.error('Failed to link account:', err);
            alert('Failed to link account. Please try manual linking if OAuth is unavailable.');
        } finally {
            setIsLinking(false);
        }
    };

    const handleUnlink = async (accountId: number) => {
        if (!confirm('Are you sure you want to unlink this account?')) return;

        try {
            await integrationsApi.unlinkAccount(accountId);
            setAccounts(accounts.filter(acc => acc.id !== accountId));
        } catch (err) {
            console.error('Failed to unlink account:', err);
            alert('Failed to unlink account.');
        }
    };

    const handleSaveEmail = () => {
        setIsSaving(true);
        setTimeout(() => {
            localStorage.setItem('nexus_whop_email', whopEmail);
            setIsSaving(false);
        }, 800);
    };

    const platforms = [
        { id: 'instagram', name: 'Instagram', icon: <Instagram size={24} />, color: 'text-pink-500' },
        { id: 'tiktok', name: 'TikTok', icon: <div className="font-bold">♪</div>, color: 'text-white' }, // Simple TikTok mock
        { id: 'youtube', name: 'YouTube', icon: <Youtube size={24} />, color: 'text-red-500' },
        { id: 'twitter', name: 'X', icon: <X size={24} />, color: 'text-white' }
    ];

    return (
        <div className="min-h-screen bg-[#020202] text-white flex">
            <EditorSidebar />

            <main className="flex-1 ml-64 p-8 lg:p-12">
                <div className="max-w-4xl mx-auto space-y-12">

                    {/* 1. Header Section */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-black uppercase tracking-tighter">Linked Accounts</h2>
                            <p className="text-zinc-500 text-xs uppercase tracking-widest mt-1">Connect and verify your social media accounts to submit videos to campaigns</p>
                        </div>
                        <button
                            onClick={() => setIsVerifyModalOpen(true)}
                            className="flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all"
                        >
                            <Plus size={14} /> Add Account
                        </button>
                    </div>

                    {/* 2. Linked Accounts Grid (Matching Screenshot) */}
                    <div className="glass-panel p-8 space-y-8 border-white/5 relative">
                        {isLoading && (
                            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-3xl">
                                <Loader2 size={32} className="text-orange-500 animate-spin" />
                            </div>
                        )}
                        <div className="flex items-center gap-2 text-zinc-400">
                            <Instagram size={18} />
                            <span className="text-xs font-bold uppercase tracking-widest">Network Connections</span>
                            <span className="text-[10px] text-zinc-600 font-medium">{accounts.length} accounts</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {(Array.isArray(accounts) ? accounts : (accounts as any)?.results || []).map((account: any) => {
                                const p = platforms.find(pl => pl.id === account?.platform?.toLowerCase());
                                return (
                                    <motion.div
                                        key={account.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="p-5 rounded-2xl bg-zinc-900/50 border border-white/5 relative group"
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2 overflow-hidden">
                                                <div className={p?.color}>{p?.icon || <ShieldCheck size={16} />}</div>
                                                <span className="text-xs font-bold text-white uppercase tracking-tight truncate">@{account.handle}</span>
                                                <a href={account.profile_url} target="_blank" rel="noreferrer">
                                                    <ExternalLink size={12} className="text-zinc-600 hover:text-white transition-colors" />
                                                </a>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-green-500 uppercase tracking-widest mb-2">
                                            <CheckCircle2 size={12} /> {account.status === 'VERIFIED' ? 'Verified' : 'Pending'} {account.verified_at ? new Date(account.verified_at).toLocaleDateString() : ''}
                                        </div>

                                        {metrics[account.id] && (
                                            <div className="flex gap-4 mb-4 pt-4 border-t border-white/5">
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] text-zinc-500 font-bold uppercase">Subscribers</span>
                                                    <span className="text-xs font-bold text-white">{(metrics[account.id].subscribers || 0).toLocaleString()}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] text-zinc-500 font-bold uppercase">Total Views</span>
                                                    <span className="text-xs font-bold text-white">{(metrics[account.id].views || 0).toLocaleString()}</span>
                                                </div>
                                            </div>
                                        )}

                                        <button
                                            onClick={() => handleUnlink(account.id)}
                                            className="w-full py-2 bg-red-500/10 text-red-500/60 hover:text-red-500 hover:bg-red-500/20 border border-red-500/10 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all mt-2"
                                        >
                                            Unlink
                                        </button>
                                    </motion.div>
                                );
                            })}

                            {!isLoading && accounts.length === 0 && (
                                <div className="col-span-full py-12 text-center border-2 border-dashed border-white/5 rounded-3xl">
                                    <ShieldCheck size={48} className="mx-auto text-zinc-800 mb-4" />
                                    <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest">No accounts connected yet</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 3. Whop Email Section (Payment Details) */}
                    <div className="glass-panel p-8 border-orange-500/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 blur-3xl -translate-y-16 translate-x-16" />

                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-orange-500/10 rounded-xl border border-orange-500/20">
                                <Mail className="text-orange-500" size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-black uppercase tracking-tighter">Payment Credentials</h3>
                                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Your Whop email used for payouts</p>
                            </div>
                        </div>

                        <div className="max-w-md space-y-4">
                            <div className="relative">
                                <input
                                    type="email"
                                    placeholder="your-whop-email@example.com"
                                    value={whopEmail}
                                    onChange={(e) => setWhopEmail(e.target.value)}
                                    className="w-full bg-black border border-white/10 rounded-xl py-4 px-6 text-sm font-bold uppercase tracking-widest focus:border-orange-500 outline-none transition-all placeholder:text-zinc-800"
                                />
                                {whopEmail && (
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                        <CheckCircle2 size={16} className="text-green-500" />
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={handleSaveEmail}
                                disabled={isSaving || !whopEmail}
                                className="bg-white text-black px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-500 transition-all disabled:opacity-20"
                            >
                                {isSaving ? "Syncing..." : "Update Whop Email"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- Verify Platform Modal (Matching Screenshot 2) --- */}
                <AnimatePresence>
                    {isVerifyModalOpen && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-3xl">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="w-full max-w-lg bg-[#0a0a0b] border border-white/5 rounded-[40px] p-10 relative shadow-2xl"
                                onClick={e => e.stopPropagation()}
                            >
                                <button
                                    onClick={() => setIsVerifyModalOpen(false)}
                                    className="absolute top-8 left-8 p-2 text-zinc-500 hover:text-white transition-colors"
                                >
                                    <X size={24} />
                                </button>

                                <h3 className="text-3xl font-bold text-center mb-10 tracking-tight">Connect Account</h3>

                                <div className="grid grid-cols-2 gap-4 mb-10">
                                    {platforms.map(p => (
                                        <button
                                            key={p.id}
                                            onClick={() => setSelectedPlatform(p.id)}
                                            className={`p-8 rounded-3xl border transition-all flex flex-col items-center gap-4 ${selectedPlatform === p.id
                                                ? 'bg-white/10 border-white/20'
                                                : 'bg-white/5 border-white/5 hover:border-white/10'
                                                }`}
                                        >
                                            <div className={`${p.color}`}>
                                                {p.icon}
                                            </div>
                                            <span className="text-lg font-bold">{p.name}</span>
                                        </button>
                                    ))}
                                </div>

                                {selectedPlatform && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="mb-10 space-y-4"
                                    >
                                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-center">
                                            Enter handle (e.g. @SchoolbyGanesh)
                                        </p>
                                        <input
                                            type="text"
                                            placeholder={`@${selectedPlatform}_handle`}
                                            value={manualHandle}
                                            onChange={(e) => setManualHandle(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-xl font-bold focus:border-orange-500 outline-none transition-all text-center"
                                        />
                                    </motion.div>
                                )}

                                <button
                                    disabled={!selectedPlatform || (selectedPlatform && !manualHandle) || isLinking}
                                    onClick={handleConnect}
                                    className="w-full py-5 bg-white/10 text-zinc-400 font-bold text-xl rounded-2xl hover:bg-white/20 hover:text-white transition-all disabled:opacity-10"
                                >
                                    {isLinking ? "Linking..." : "Connect Now"}
                                </button>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

            </main>
        </div>
    );
};

export default VerificationPage;
