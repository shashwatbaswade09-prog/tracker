import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import EditorSidebar from '../components/EditorSidebar';
import {
    Youtube, Instagram, Twitter,
    ArrowUpRight, Globe, AlertCircle, CheckCircle2,
    FileText, Download,
    Calculator, Trophy, X,
    AlertTriangle
} from 'lucide-react';

// --- Types ---
interface Campaign {
    id: number;
    title: string;
    creator: string;
    payout: string;
    payoutRate: number;
    platform: string;
    platformIcon: React.ReactNode;
    deadline: string;
    status: 'Active' | 'Ending Soon' | 'Closed';
    category: string;
    budget: {
        total: string;
        used: string;
        percentage: number;
    };
    rules: string[];
    assets: { name: string; type: string; url: string }[];
    personalStats: {
        submitted: number;
        views: string;
        earnings: string;
        rank: string;
        ratio: string;
    };
}

// --- Mock Data ---
const CAMPAIGNS: Campaign[] = [
    {
        id: 1,
        title: "Summer Gaming Vibe",
        creator: "Nexus Gaming Hub",
        payout: "$0.50 / 1k Views",
        payoutRate: 0.50,
        platform: "YouTube",
        platformIcon: <Youtube className="text-red-500" size={16} />,
        deadline: "2d 14h",
        status: "Ending Soon",
        category: "Gaming",
        budget: { total: "$50,000", used: "$38,400", percentage: 76 },
        rules: [
            "Minimum 15 seconds long",
            "Must include Nexus logo in top-right",
            "No copyrighted music",
            "Must be original edit"
        ],
        assets: [
            { name: "Raw Gameplay 01", type: "Video", url: "#" },
            { name: "NEXUS Overlay Pack", type: "Assets", url: "#" },
            { name: "BG Music Library", type: "Audio", url: "#" }
        ],
        personalStats: {
            submitted: 12,
            views: "840K",
            earnings: "$420.00",
            rank: "#14",
            ratio: "92%"
        }
    },
    {
        id: 2,
        title: "Aesthetic Edits 2024",
        creator: "Vibe Central",
        payout: "$8.50 / Approved Clip",
        payoutRate: 8.50,
        platform: "Instagram",
        platformIcon: <Instagram className="text-pink-500" size={16} />,
        deadline: "12h 30m",
        status: "Active",
        category: "Lifestyle",
        budget: { total: "$25,000", used: "$12,000", percentage: 48 },
        rules: [
            "Portrait mode (9:16) only",
            "High-quality color grading",
            "Maximum 3 clips per day",
            "Focus on aesthetic transitions"
        ],
        assets: [
            { name: "Vibe LUT Pack", type: "Presets", url: "#" },
            { name: "Inspiration Board", type: "Docs", url: "#" }
        ],
        personalStats: {
            submitted: 5,
            views: "1.2M",
            earnings: "$1,240.50",
            rank: "#8",
            ratio: "100%"
        }
    },
    {
        id: 3,
        title: "Crypto Alpha Signals",
        creator: "Bull Market Crew",
        payout: "$15.00 / Lead Generated",
        payoutRate: 0.0,
        platform: "Twitter/X",
        platformIcon: <Twitter className="text-blue-400" size={16} />,
        deadline: "5d 06h",
        status: "Active",
        category: "Finance",
        budget: { total: "$100,000", used: "$15,200", percentage: 15 },
        rules: [
            "CTA in bio is mandatory",
            "No mention of specific coins",
            "Must be educator-focused",
            "High verification standard"
        ],
        assets: [
            { name: "Signal Templates", type: "Images", url: "#" },
            { name: "Brand Style Guide", type: "Docs", url: "#" }
        ],
        personalStats: {
            submitted: 42,
            views: "145K",
            earnings: "$630.00",
            rank: "#42",
            ratio: "68%"
        }
    }
];

const SUBMISSIONS = [
    { id: 101, title: "SickTransition_v1.mp4", platform: "TikTok", views: "245k", earnings: "$122.50", status: "Approved", date: "Feb 05", campaignId: 1 },
    { id: 102, title: "AlphaIntro_Final.mp4", platform: "Instagram", views: "1.2M", earnings: "$840.00", status: "Approved", date: "Feb 04", campaignId: 2, highlight: true },
    { id: 103, title: "WeeklyRecap_Damp.mp4", platform: "YouTube", views: "18k", earnings: "$9.00", status: "Pending", date: "Feb 07", campaignId: 1 },
    { id: 104, title: "GamingClips_03.mp4", platform: "YouTube", views: "4.2k", earnings: "$2.10", status: "Rejected", date: "Feb 06", campaignId: 1 },
];

const CampaignsPage = () => {
    const [activeId, setActiveId] = useState(1);
    const [viewMode, setViewMode] = useState<'browse' | 'submissions'>('browse');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [videoLink, setVideoLink] = useState("");
    const [calcViews, setCalcViews] = useState(100000);
    const [verifError, setVerifError] = useState<string | null>(null);

    const checkVerification = () => {
        const verified = JSON.parse(localStorage.getItem('nexus_verified_platforms') || '[]');
        const campaignPlatform = activeCampaign.platform.toLowerCase().split('/')[0]; // simple normalize
        if (!verified.includes(campaignPlatform)) {
            setVerifError(`Platform Not Connected. Please verify your ${activeCampaign.platform} account in the 'Social Verification' section before submitting.`);
            return false;
        }
        return true;
    };

    const handleOpenModal = () => {
        if (checkVerification()) {
            setIsModalOpen(true);
        }
    };

    const activeCampaign = CAMPAIGNS.find(c => c.id === activeId) || CAMPAIGNS[0];
    const userSubmissions = SUBMISSIONS.filter(s => s.campaignId === activeId);

    const CampaignTab = ({ camp }: { camp: Campaign }) => (
        <button
            onClick={() => setActiveId(camp.id)}
            className={`flex-shrink-0 w-64 p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden group ${activeId === camp.id
                ? 'bg-orange-500/10 border-orange-500 shadow-[0_0_20px_rgba(255,107,0,0.1)]'
                : 'bg-white/5 border-white/5 hover:border-white/10'
                }`}
        >
            <div className="flex items-center justify-between mb-3 relative z-10">
                <div className="p-2 bg-black/40 rounded-lg group-hover:scale-110 transition-transform">
                    {camp.platformIcon}
                </div>
                <div className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded ${camp.status === 'Ending Soon' ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'
                    }`}>
                    {camp.status}
                </div>
            </div>
            <h4 className={`font-bold text-sm text-left uppercase tracking-tight mb-1 relative z-10 ${activeId === camp.id ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'}`}>
                {camp.title}
            </h4>
            <p className="text-[10px] font-bold text-orange-500 text-left relative z-10">{camp.payout}</p>
        </button>
    );

    const StatCard = ({ label, value, sub }: { label: string, value: string, sub?: string }) => (
        <div className="p-5 rounded-2xl bg-black/40 border border-white/5 flex flex-col gap-1">
            <span className="text-[10px] uppercase font-bold text-zinc-600 tracking-widest">{label}</span>
            <span className="text-xl font-bold text-white tracking-tighter">{value}</span>
            {sub && <span className="text-[10px] font-semibold text-zinc-500">{sub}</span>}
        </div>
    );

    return (
        <div className="min-h-screen bg-[#020202] text-white flex">
            <EditorSidebar />
            <main className="flex-1 ml-64 p-8 lg:p-12 overflow-y-auto">
                <AnimatePresence>
                    {verifError && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="bg-red-500/10 border border-red-500/20 rounded-2xl px-6 py-4 flex items-center justify-between mb-8"
                        >
                            <div className="flex items-center gap-3 text-red-500 text-xs font-bold uppercase tracking-widest">
                                <AlertTriangle size={16} />
                                {verifError}
                            </div>
                            <button onClick={() => setVerifError(null)} className="text-red-500/50 hover:text-red-500 transition-colors">
                                <X size={16} />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide mb-8">
                    {CAMPAIGNS.map(camp => (
                        <CampaignTab key={camp.id} camp={camp} />
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    <motion.div key={activeId} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 mb-8">
                            <div className="xl:col-span-8 space-y-8">
                                <div className="glass-panel p-0 overflow-hidden relative group">
                                    <div className="h-48 w-full relative">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10" />
                                        <div className="absolute bottom-6 left-8 z-20">
                                            <div className="flex items-center gap-4 mb-2">
                                                <div className="p-2 bg-orange-500 text-black rounded-lg">{activeCampaign.platformIcon}</div>
                                                <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">{activeCampaign.creator}</span>
                                            </div>
                                            <h2 className="text-4xl font-bold uppercase tracking-tighter">{activeCampaign.title}</h2>
                                        </div>
                                    </div>
                                    <div className="p-8 grid grid-cols-2 md:grid-cols-4 gap-6">
                                        <StatCard label="Reward Rate" value={activeCampaign.payout} />
                                        <StatCard label="Goal" value="$10 - $2.5K" />
                                        <StatCard label="Category" value={activeCampaign.category} />
                                        <div className="p-5 rounded-2xl bg-black/40 border border-white/5 flex flex-col gap-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] uppercase font-bold text-zinc-600 tracking-widest">Budget</span>
                                                <span className="text-[10px] font-bold text-white">{activeCampaign.budget.percentage}%</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-white/5 rounded-full"><div className="h-full bg-orange-500" style={{ width: `${activeCampaign.budget.percentage}%` }} /></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-8 border-b border-white/5 mb-6">
                                    <button onClick={() => setViewMode('browse')} className={`pb-4 text-xs font-bold uppercase tracking-widest relative ${viewMode === 'browse' ? 'text-white' : 'text-zinc-500'}`}>Brief & Assets {viewMode === 'browse' && <motion.div layoutId="nav-line" className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />}</button>
                                    <button onClick={() => setViewMode('submissions')} className={`pb-4 text-xs font-bold uppercase tracking-widest relative ${viewMode === 'submissions' ? 'text-white' : 'text-zinc-500'}`}>My Submissions ({userSubmissions.length}) {viewMode === 'submissions' && <motion.div layoutId="nav-line" className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />}</button>
                                </div>

                                {viewMode === 'browse' ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="glass-panel p-8">
                                            <h3 className="text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-3 text-orange-500"><AlertCircle size={18} /> Rules</h3>
                                            <ul className="space-y-4">
                                                {activeCampaign.rules.map((rule, i) => (
                                                    <li key={i} className="flex gap-4 text-sm text-zinc-400 uppercase tracking-tight leading-relaxed"><CheckCircle2 size={16} className="text-zinc-600" /> {rule}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="glass-panel p-8">
                                            <h3 className="text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-3 text-orange-500"><Globe size={18} /> Assets</h3>
                                            <div className="space-y-3">
                                                {activeCampaign.assets.map((asset, i) => (
                                                    <div key={i} className="flex items-center justify-between p-4 glass-card group">
                                                        <div className="flex items-center gap-4">
                                                            <FileText size={16} className="text-zinc-500" />
                                                            <p className="text-xs font-bold uppercase tracking-tighter">{asset.name}</p>
                                                        </div>
                                                        <Download size={18} className="text-zinc-500 group-hover:text-orange-500 cursor-pointer" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="glass-panel p-8">
                                        <table className="w-full text-left font-inter">
                                            <thead>
                                                <tr className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 border-b border-white/5">
                                                    <th className="pb-6 px-2">Clip</th>
                                                    <th className="pb-6">Reach</th>
                                                    <th className="pb-6">Earnings</th>
                                                    <th className="pb-6">Status</th>
                                                    <th className="pb-6 text-right pr-2">Link</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {userSubmissions.map((sub) => (
                                                    <tr key={sub.id} className="group hover:bg-white/5 transition-all">
                                                        <td className="py-6 px-2 text-xs font-bold uppercase">{sub.title}</td>
                                                        <td className="py-6 text-xs font-bold">{sub.views} Views</td>
                                                        <td className="py-6 text-sm font-bold text-orange-400">{sub.earnings}</td>
                                                        <td className="py-6"><span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${sub.status === 'Approved' ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'}`}>{sub.status}</span></td>
                                                        <td className="py-6 text-right pr-2"><ArrowUpRight size={18} className="text-zinc-600 hover:text-white cursor-pointer" /></td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>

                            <div className="xl:col-span-4 space-y-8">
                                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleOpenModal} className="w-full py-6 bg-orange-500 text-black rounded-2xl font-black uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(255,107,0,0.2)]">Submit New Clip</motion.button>
                                <div className="glass-panel p-8 space-y-6">
                                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-3 text-orange-500"><Trophy size={18} /> Performance</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 rounded-xl bg-white/5 border border-white/5"><span className="text-[9px] font-bold text-zinc-600 uppercase">Clips</span><p className="text-xl font-bold">{activeCampaign.personalStats.submitted}</p></div>
                                        <div className="p-4 rounded-xl bg-white/5 border border-white/5"><span className="text-[9px] font-bold text-zinc-600 uppercase">Rank</span><p className="text-xl font-bold">{activeCampaign.personalStats.rank}</p></div>
                                    </div>
                                </div>
                                <div className="glass-panel p-8">
                                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-6 flex items-center gap-3 text-orange-500"><Calculator size={18} /> Calculator</h3>
                                    <input type="range" min="1000" max="1000000" step="1000" value={calcViews} onChange={(e) => setCalcViews(parseInt(e.target.value))} className="w-full accent-orange-500 h-1 bg-white/5 mb-4" />
                                    <p className="text-2xl font-black text-white">${((calcViews / 1000) * activeCampaign.payoutRate).toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                <AnimatePresence>
                    {isModalOpen && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl" onClick={() => setIsModalOpen(false)}>
                            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-xl glass-panel p-10 relative" onClick={e => e.stopPropagation()}>
                                <h3 className="text-3xl font-black uppercase tracking-tighter mb-10 text-center">New Submission</h3>
                                <div className="space-y-6">
                                    <input type="text" placeholder="Paste Video Link..." className="w-full bg-black border border-white/5 rounded-xl py-4 px-6 text-sm focus:border-orange-500 outline-none" value={videoLink} onChange={e => setVideoLink(e.target.value)} />
                                    <button className="w-full py-4 bg-orange-500 text-black font-black uppercase tracking-widest text-[11px] rounded-xl">Submit Clip</button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default CampaignsPage;
