import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import EditorSidebar from '../components/EditorSidebar';
import { authApi, integrationsApi } from '../services/api';
import type { User, ConnectedAccount, VideoInsight } from '../services/api';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
    TrendingUp, Eye, DollarSign, Plus,
    Trophy, Zap, Target, CheckCircle2,
    Clock, Instagram, Youtube, Twitter, Globe,
    Award, Flame, Sparkles, PlusSquare,
    RefreshCw,
    ShieldCheck, Loader2
} from 'lucide-react';

// Mock data for analytics
const graphData = [
    { name: 'Mon', earnings: 120, views: 4200, approved: 12 },
    { name: 'Tue', earnings: 450, views: 18000, approved: 45 },
    { name: 'Wed', earnings: 300, views: 12000, approved: 30 },
    { name: 'Thu', earnings: 900, views: 45000, approved: 85 },
    { name: 'Fri', earnings: 600, views: 24000, approved: 52 },
    { name: 'Sat', earnings: 800, views: 32000, approved: 71 },
    { name: 'Sun', earnings: 1100, views: 56000, approved: 104 },
];

const topEditors = [
    { rank: 1, name: 'Alex Rivera', points: 14500, avatar: 'AR' },
    { rank: 2, name: 'Sarah Chen', points: 12800, avatar: 'SC' },
    { rank: 3, name: 'Marcus Tech', points: 11200, avatar: 'MT' },
];

const activeCampaigns = [
    { id: 1, title: 'Summer Gaming Vibe', rate: '$5.00 / 1k Views', type: 'YouTube', deadline: '2d 14h', icon: <Youtube className="text-red-500" /> },
    { id: 2, title: 'Aesthetic Edits 2024', rate: '$8.50 / Approved Clip', type: 'Instagram', deadline: '12h 30m', icon: <Instagram className="text-pink-500" /> },
    { id: 3, title: 'Crypto Alpha Signals', rate: '$15.00 / Lead', type: 'Twitter/X', deadline: '5d 06h', icon: <Twitter className="text-blue-400" /> },
];

const StatCard = ({ icon, label, value, trend, trendType }: any) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="glass-panel p-6 border-white/5 hover:border-orange-500/20 transition-all flex flex-col gap-4 relative overflow-hidden group"
    >
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-orange-500/5 rounded-full blur-2xl group-hover:bg-orange-500/10 transition-all" />
        <div className="flex items-center justify-between relative z-10">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20 text-orange-500 group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${trendType === 'up' ? 'text-green-500 bg-green-500/10' : 'text-red-500 bg-red-500/10'}`}>
                {trendType === 'up' ? <TrendingUp size={10} /> : <TrendingUp size={10} className="rotate-180" />}
                {trend}
            </div>
        </div>
        <div className="relative z-10">
            <p className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-bold mb-1">{label}</p>
            <h3 className="text-3xl font-bold text-white tracking-tighter">{value}</h3>
        </div>
    </motion.div>
);

const VerificationStatusCard = ({ accounts = [] }: { accounts: any }) => {
    const email = localStorage.getItem('nexus_whop_email');

    // Handle paginated response structure if present
    const accountsList = Array.isArray(accounts)
        ? accounts
        : (accounts?.results && Array.isArray(accounts.results))
            ? accounts.results
            : [];

    const verifiedPlatforms = accountsList
        .filter((a: any) => a && a.platform)
        .map((a: any) => a.platform.toLowerCase());

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="glass-panel p-6 border-white/5 hover:border-blue-500/20 transition-all flex flex-col gap-4 relative overflow-hidden group bg-blue-500/5"
        >
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/15 transition-all" />
            <div className="flex items-center justify-between relative z-10">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-blue-500 group-hover:scale-110 transition-transform">
                    <ShieldCheck size={24} />
                </div>
                <div className={`flex items-center gap-1 text-[8px] font-bold px-2 py-0.5 rounded-full ${email ? 'text-green-500 bg-green-500/10' : 'text-orange-500 bg-orange-500/10'}`}>
                    {email ? 'EMAIL SYNCED' : 'EMAIL MISSING'}
                </div>
            </div>
            <div className="relative z-10">
                <p className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-bold mb-1">Status</p>
                <div className="flex gap-1.5 mt-1">
                    {['instagram', 'tiktok', 'youtube', 'twitter'].map(p => (
                        <div key={p} className={`w-2 h-2 rounded-full ${verifiedPlatforms.includes(p) ? 'bg-green-500' : 'bg-white/10'}`} title={p} />
                    ))}
                    <span className="text-[10px] font-bold text-white ml-2 uppercase">{(verifiedPlatforms || []).length}/4 VERIFIED</span>
                </div>
            </div>
        </motion.div>
    );
};

const EditorDashboard = () => {
    const [user, setUser] = useState<User | null>(null);
    const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
    const [metrics, setMetrics] = useState<{ [key: number]: any }>({});
    const [videoInsights, setVideoInsights] = useState<VideoInsight[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedPlatform, setSelectedPlatform] = useState<'YOUTUBE' | 'INSTAGRAM'>('YOUTUBE');
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userData, accountsData] = await Promise.all([
                    authApi.getMe(),
                    integrationsApi.getAccounts(),
                ]);
                setUser(userData);

                // Handle paginated response structure if present
                const accountsList = Array.isArray(accountsData)
                    ? accountsData
                    : (accountsData as any)?.results || [];
                setAccounts(accountsList);

                // Fetch metrics for verified YouTube accounts
                const youtubeAccounts = accountsList.filter((a: ConnectedAccount) => a.platform === 'YOUTUBE' && a.status === 'VERIFIED');
                const metricsPromises = youtubeAccounts.map(async (acc: ConnectedAccount) => {
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

            } catch (err) {
                console.error('Failed to fetch dashboard data:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchContent = async () => {
            const activeAcc = accounts.find(a => a.platform === selectedPlatform && a.status === 'VERIFIED');
            if (activeAcc) {
                try {
                    const insights = await integrationsApi.getContentMetrics(activeAcc.id);
                    setVideoInsights(insights);
                } catch (e) {
                    console.error("Failed to fetch content metrics:", e);
                    setVideoInsights([]);
                }
            } else {
                setVideoInsights([]);
            }
        };
        if (accounts.length > 0) {
            fetchContent();
        }
    }, [selectedPlatform, accounts]);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        const platformAccounts = accounts.filter(a => a.platform === selectedPlatform && a.status === 'VERIFIED');
        const promises = platformAccounts.map(async (acc: ConnectedAccount) => {
            try {
                const [m, insights] = await Promise.all([
                    integrationsApi.getAccountMetrics(acc.id),
                    integrationsApi.getContentMetrics(acc.id)
                ]);
                setMetrics(prev => ({ ...prev, [acc.id]: m }));
                if (acc.platform === selectedPlatform) setVideoInsights(insights);
            } catch (e) {
                console.error(e);
            }
        });
        await Promise.all(promises);
        setTimeout(() => setIsRefreshing(false), 800); // UI feel
    };

    // Filtered account for live monitor
    const activeAccount = accounts.find(a => a.platform === selectedPlatform && a.status === 'VERIFIED');
    const activeMetrics = activeAccount ? metrics[activeAccount.id] : null;


    // Aggregate metrics for summary cards
    const totalSubscribers = Object.values(metrics).reduce((acc, m) => acc + (Number(m?.subscribers) || 0), 0);
    const totalChannelViews = Object.values(metrics).reduce((acc, m) => acc + (Number(m?.views) || 0), 0);

    return (
        <div className="min-h-screen bg-[#020202] text-white flex">
            <EditorSidebar />

            <main className="flex-1 ml-64 p-8 lg:p-12 overflow-y-auto relative">
                {isLoading && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
                        <Loader2 className="text-orange-500 animate-spin" size={48} />
                    </div>
                )}

                {/* 1. Welcome Header */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h1 className="text-4xl lg:text-5xl font-bold tracking-tighter uppercase mb-2">
                            Welcome back, <span className="text-orange-500">{user?.username || 'Editor'}</span>
                        </h1>
                        <p className="text-zinc-500 text-lg flex items-center gap-2">
                            <Sparkles size={18} className="text-orange-500" />
                            Continue creating and earning with your premium clips.
                        </p>
                    </motion.div>
                    <div className="flex items-center gap-3">
                        <div className="px-4 py-2 glass-panel border-orange-500/20 flex items-center gap-3">
                            <Flame size={18} className="text-orange-500 animate-pulse" />
                            <span className="text-sm font-bold uppercase tracking-widest">7 Day Streak</span>
                        </div>
                        <button className="nexus-btn flex items-center gap-2">
                            <Plus size={18} /> Submit New Clip
                        </button>
                    </div>
                </header>

                {/* 2. Performance Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-12">
                    <StatCard icon={<DollarSign size={24} />} label="Total Payout" value="$12,840" trend="+12.5%" trendType="up" />
                    <StatCard icon={<Target size={24} />} label="This Month" value="$2,450" trend="+8.2%" trendType="up" />
                    <StatCard icon={<CheckCircle2 size={24} />} label="Approved Clips" value="142" trend="+14" trendType="up" />
                    <StatCard icon={<Eye size={24} />} label="Channel Views" value={totalChannelViews > 1000000 ? `${(totalChannelViews / 1000000).toFixed(1)}M` : totalChannelViews.toLocaleString()} trend="+15%" trendType="up" />
                    <StatCard icon={<Trophy size={24} />} label="Subscribers" value={totalSubscribers > 1000 ? `${(totalSubscribers / 1000).toFixed(1)}K` : totalSubscribers.toLocaleString()} trend="+5" trendType="up" />
                    <VerificationStatusCard accounts={accounts} />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 mb-12">

                    {/* Left & Middle Column */}
                    <div className="xl:col-span-8 flex flex-col gap-8">

                        {/* 5. Performance Analytics Section */}
                        <div className="glass-panel p-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 flex gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                                    <span className="text-[10px] font-bold uppercase text-zinc-500">Earnings</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-white/20"></div>
                                    <span className="text-[10px] font-bold uppercase text-zinc-500">Views</span>
                                </div>
                            </div>
                            <h3 className="text-lg font-bold uppercase tracking-widest mb-10 flex border-l-4 border-orange-500 pl-4">Growth Analytics</h3>
                            <div className="h-[350px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={graphData}>
                                        <defs>
                                            <linearGradient id="colorOrange" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#ff6b00" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#ff6b00" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                        <XAxis
                                            dataKey="name"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#71717a', fontSize: 10, fontWeight: 700 }}
                                            dy={10}
                                        />
                                        <YAxis hide />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,107,0,0.2)', borderRadius: '12px' }}
                                            itemStyle={{ color: '#ff6b00', textTransform: 'uppercase', fontSize: '10px', fontWeight: 'bold' }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="earnings"
                                            stroke="#ff6b00"
                                            strokeWidth={3}
                                            fillOpacity={1}
                                            fill="url(#colorOrange)"
                                            animationDuration={2000}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* 4. Active Campaigns Section */}
                        <div className="glass-panel p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-lg font-bold uppercase tracking-widest">Active High-Payout Campaigns</h3>
                                <button className="text-xs font-bold text-orange-500 uppercase tracking-widest hover:text-orange-400">View All Campaigns</button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {activeCampaigns.map((camp) => (
                                    <div key={camp.id} className="glass-card p-5 group hover:border-orange-500/40 relative">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-orange-500/20 transition-all">
                                                {camp.icon}
                                            </div>
                                            <span className="text-[10px] font-bold text-zinc-500 uppercase flex items-center gap-1">
                                                <Clock size={12} /> {camp.deadline}
                                            </span>
                                        </div>
                                        <h4 className="font-bold text-sm mb-2 uppercase tracking-tight">{camp.title}</h4>
                                        <p className="text-orange-500 text-xs font-bold mb-4">{camp.rate}</p>
                                        <button className="w-full py-2 bg-white/5 hover:bg-orange-500 hover:text-black transition-all rounded-lg text-[10px] font-bold uppercase tracking-widest border border-white/5">
                                            Join Campaign
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="xl:col-span-4 flex flex-col gap-8">

                        {/* 3. Quick Action Panel */}
                        <div className="glass-panel p-8">
                            <h3 className="text-lg font-bold uppercase tracking-widest mb-8 text-glow">Quick Actions</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { id: 'sub', icon: <PlusSquare />, label: 'Submit Clip', color: 'orange' },
                                    { id: 'earn', icon: <DollarSign />, label: 'Earnings', color: 'zinc' },
                                    { id: 'disc', icon: <Globe />, label: 'Community', color: 'zinc' },
                                    { id: 'camp', icon: <Zap />, label: 'Campaigns', color: 'zinc' }
                                ].map((action) => (
                                    <button
                                        key={action.id}
                                        className={`flex flex-col items-center gap-3 p-6 glass-card group transition-all ${action.color === 'orange' ? 'border-orange-500/20 bg-orange-500/5 hover:bg-orange-500/10' : 'hover:border-white/20'}`}
                                    >
                                        <div className={`${action.color === 'orange' ? 'text-orange-500' : 'text-zinc-500 group-hover:text-white'} transition-colors`}>
                                            {action.icon}
                                        </div>
                                        <span className={`text-[10px] font-bold uppercase tracking-widest ${action.color === 'orange' ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-200'}`}>
                                            {action.label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 6. Leaderboard & Achievements Section */}
                        <div className="glass-panel p-8">
                            <h3 className="text-lg font-bold uppercase tracking-widest mb-8 flex items-center gap-3">
                                <Award className="text-orange-500" /> Leaderboard
                            </h3>
                            <div className="space-y-4 mb-8">
                                {topEditors.map((ed) => (
                                    <div key={ed.rank} className="flex items-center justify-between p-4 glass-card border-white/5 group hover:border-orange-500/20">
                                        <div className="flex items-center gap-4">
                                            <span className="text-xs font-bold text-orange-500/60 w-4">#{ed.rank}</span>
                                            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white uppercase group-hover:border-orange-500/40">
                                                {ed.avatar}
                                            </div>
                                            <span className="text-sm font-bold text-zinc-300 group-hover:text-white transition-colors">{ed.name}</span>
                                        </div>
                                        <span className="text-xs font-bold text-orange-500">{ed.points.toLocaleString()} pts</span>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-6 border-t border-white/5">
                                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest mb-2">
                                    <span className="text-zinc-500 text-[10px]">Rank Progress: <span className="text-orange-500">Master</span></span>
                                    <span className="text-white">82%</span>
                                </div>
                                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                    <div className="w-[82%] h-full bg-gradient-to-r from-orange-600 to-orange-400 relative">
                                        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                                    </div>
                                </div>
                                <p className="text-[10px] text-zinc-600 mt-3 italic text-center">2,450 points until "Nexus Legend" rank.</p>
                            </div>
                        </div>

                    </div>
                </div>

                {/* 7. My Clips Performance Table */}
                <div className="glass-panel p-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                        <div>
                            <h3 className="text-lg font-bold uppercase tracking-widest mb-1">My Clips Portal</h3>
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Manage and track your asset performance</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleRefresh}
                                className={`p-2 rounded-lg glass-card border-white/5 hover:border-orange-500/30 transition-all ${isRefreshing ? 'animate-spin text-orange-500' : 'text-zinc-500 hover:text-white'}`}
                            >
                                <RefreshCw size={14} />
                            </button>
                            <div className="flex gap-2 p-1 glass-card bg-white/5 rounded-xl border-white/5">
                                <button
                                    onClick={() => setSelectedPlatform('INSTAGRAM')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-bold uppercase transition-all ${selectedPlatform === 'INSTAGRAM' ? 'bg-orange-500 text-black shadow-[0_0_15px_rgba(255,107,0,0.3)]' : 'text-zinc-500 hover:text-zinc-300'}`}
                                >
                                    <Instagram size={14} /> Instagram
                                </button>
                                <button
                                    onClick={() => setSelectedPlatform('YOUTUBE')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-bold uppercase transition-all ${selectedPlatform === 'YOUTUBE' ? 'bg-orange-500 text-black shadow-[0_0_15px_rgba(255,107,0,0.3)]' : 'text-zinc-500 hover:text-zinc-300'}`}
                                >
                                    <Youtube size={14} /> YouTube
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Live Account Monitor Banner */}
                    <div className="mb-10 animate-fade-in">
                        {activeAccount ? (
                            <div className="glass-card p-6 border-orange-500/10 flex flex-wrap items-center justify-between gap-6 bg-gradient-to-r from-orange-500/[0.03] to-transparent">
                                <div className="flex items-center gap-5">
                                    <div className="relative">
                                        <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
                                            {selectedPlatform === 'YOUTUBE' ? <Youtube size={24} /> : <Instagram size={24} />}
                                        </div>
                                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#050505] animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <span className="font-bold text-sm tracking-tight">{activeMetrics?.title || activeAccount.handle}</span>
                                            <span className="px-1.5 py-0.5 rounded bg-green-500/10 text-green-500 text-[8px] font-black uppercase tracking-tighter border border-green-500/20">Live</span>
                                        </div>
                                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{activeMetrics?.video_count || 0} Assets • Linked & Tracking</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-10">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black uppercase text-zinc-500 tracking-tighter mb-1">Followers</span>
                                        <span className="font-bold text-lg leading-none tracking-tighter">
                                            {activeMetrics?.subscribers?.toLocaleString() || '0'}
                                        </span>
                                    </div>
                                    <div className="w-px h-8 bg-white/5"></div>
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black uppercase text-zinc-500 tracking-tighter mb-1">Total Views</span>
                                        <span className="font-bold text-lg leading-none tracking-tighter">
                                            {activeMetrics?.views?.toLocaleString() || '0'}
                                        </span>
                                    </div>
                                    <div className="w-px h-8 bg-white/5"></div>
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black uppercase text-zinc-500 tracking-tighter mb-1">Engagement</span>
                                        <span className="font-bold text-lg leading-none tracking-tighter text-orange-500">
                                            {activeMetrics ? (
                                                (() => {
                                                    const views = activeMetrics.views || 0;
                                                    const interactions = (activeMetrics.likes || 0) + (activeMetrics.comments || 0);
                                                    if (views === 0) return '0%';
                                                    return ((interactions / views) * 100).toFixed(1) + '%';
                                                })()
                                            ) : '--'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="glass-card p-6 border-white/5 text-center bg-white/[0.02]">
                                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">No verified {selectedPlatform} account linked for live tracking</p>
                                <button className="mt-3 text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] hover:text-orange-400">Connect Account Now →</button>
                            </div>
                        )}
                    </div>

                    <div className="overflow-x-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-orange-500/80">Recent Content Insights</h4>
                            <span className="text-[10px] font-bold text-zinc-500 uppercase">{videoInsights.length} Assets Tracked</span>
                        </div>
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 border-b border-white/5">
                                    <th className="pb-6 pl-2">Content Asset</th>
                                    <th className="pb-6">Type</th>
                                    <th className="pb-6">Engagement</th>
                                    <th className="pb-6 text-center">Likes</th>
                                    <th className="pb-6">Status</th>
                                    <th className="pb-6 pr-2 text-right">Published</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {videoInsights.map((video) => (
                                    <tr
                                        key={video.id}
                                        className="group hover:bg-white/5 transition-all"
                                    >
                                        <td className="py-6 pl-2">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-10 rounded bg-zinc-800 relative overflow-hidden group-hover:scale-105 transition-transform border border-white/5 group-hover:border-orange-500/20">
                                                    <img src={video.thumbnail} alt="" className="w-full h-full object-cover opacity-60 group-hover:opacity-90 transition-opacity" />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                                </div>
                                                <div className="flex flex-col max-w-[200px]">
                                                    <span className="font-bold text-xs uppercase tracking-tight text-zinc-200 group-hover:text-white truncate" title={video.title}>{video.title}</span>
                                                    <span className="text-[9px] text-zinc-600 font-medium uppercase font-mono">{video.id}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-6">
                                            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${video.is_short ? 'bg-orange-500/10 text-orange-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                                {video.is_short ? 'Short' : 'Video'}
                                            </span>
                                        </td>
                                        <td className="py-6">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold group-hover:text-white transition-colors">{video.views.toLocaleString()} Views</span>
                                                <span className="text-[9px] text-green-500 font-bold">Live Tracking</span>
                                            </div>
                                        </td>
                                        <td className="py-6 text-center">
                                            <span className="text-sm font-bold tracking-tighter text-white">{video.likes.toLocaleString()}</span>
                                        </td>
                                        <td className="py-6">
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-green-500/80">Active</span>
                                            </div>
                                        </td>
                                        <td className="py-6 pr-2 text-right">
                                            <span className="text-[10px] font-bold text-zinc-600">{new Date(video.published_at).toLocaleDateString()}</span>
                                        </td>
                                    </tr>
                                ))}
                                {videoInsights.length === 0 && !isLoading && (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center text-zinc-600 text-xs uppercase font-bold tracking-widest">
                                            No recent content found for this platform
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </main>
        </div>
    );
};

export default EditorDashboard;
