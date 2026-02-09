import { motion } from 'framer-motion';
import EditorSidebar from '../components/EditorSidebar';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
    TrendingUp, Eye, DollarSign, Plus,
    Trophy, Zap, Target, Star, CheckCircle2,
    Clock, Instagram, Youtube, Twitter, Globe,
    Award, Flame, Sparkles, PlusSquare, ShieldCheck
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

const clipPerformance = [
    { id: 1, title: 'SickTransition_v1.mp4', platform: 'TikTok', views: '245k', earnings: '$122.50', status: 'Approved', date: 'Feb 05' },
    { id: 2, title: 'AlphaIntro_Final.mp4', platform: 'Instagram', views: '1.2M', earnings: '$840.00', status: 'Approved', date: 'Feb 04', highlight: true },
    { id: 3, title: 'WeeklyRecap_Damp.mp4', platform: 'YouTube', views: '18k', earnings: '--', status: 'Pending', date: 'Feb 07' },
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

const VerificationStatusCard = () => {
    const verified = JSON.parse(localStorage.getItem('nexus_verified_platforms') || '[]');
    const email = localStorage.getItem('nexus_whop_email');

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
                        <div key={p} className={`w-2 h-2 rounded-full ${verified.includes(p) ? 'bg-green-500' : 'bg-white/10'}`} title={p} />
                    ))}
                    <span className="text-[10px] font-bold text-white ml-2 uppercase">{verified.length}/4 VERIFIED</span>
                </div>
            </div>
        </motion.div>
    );
};

const EditorDashboard = () => {
    return (
        <div className="min-h-screen bg-[#020202] text-white flex">
            <EditorSidebar />

            <main className="flex-1 ml-64 p-8 lg:p-12 overflow-y-auto">

                {/* 1. Welcome Header */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h1 className="text-4xl lg:text-5xl font-bold tracking-tighter uppercase mb-2">
                            Welcome back, <span className="text-orange-500">John Doe</span>
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
                    <StatCard icon={<Eye size={24} />} label="Total Views" value="4.8M" trend="+15%" trendType="up" />
                    <StatCard icon={<Trophy size={24} />} label="Campaign Rank" value="#42" trend="+5" trendType="up" />
                    <VerificationStatusCard />
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
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-lg font-bold uppercase tracking-widest">My Clips Portal</h3>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2 px-3 py-1.5 glass-card bg-white/5 text-[10px] font-bold uppercase cursor-pointer hover:border-orange-500/30">
                                <Instagram size={14} /> Instagram
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 glass-card bg-white/5 text-[10px] font-bold uppercase cursor-pointer hover:border-orange-500/30">
                                <Youtube size={14} /> YouTube
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 border-b border-white/5">
                                    <th className="pb-6 pl-2">Asset Details</th>
                                    <th className="pb-6">Platform</th>
                                    <th className="pb-6">Reach</th>
                                    <th className="pb-6 text-center">Earnings</th>
                                    <th className="pb-6">Status</th>
                                    <th className="pb-6 pr-2 text-right">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {clipPerformance.map((row) => (
                                    <tr
                                        key={row.id}
                                        className={`group transition-all ${row.highlight ? 'bg-orange-500/5' : 'hover:bg-white/5'}`}
                                    >
                                        <td className="py-6 pl-2">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-10 rounded bg-zinc-800 relative overflow-hidden group-hover:scale-105 transition-transform border border-white/5 group-hover:border-orange-500/20">
                                                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent"></div>
                                                    {row.highlight && <div className="absolute top-1 left-1"><Star size={10} className="text-orange-500 fill-orange-500" /></div>}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-xs uppercase tracking-tight text-zinc-200 group-hover:text-white">{row.title}</span>
                                                    <span className="text-[10px] text-zinc-600 font-medium">MP4 • 1080p • 24MB</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-6">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 group-hover:text-zinc-300">{row.platform}</span>
                                        </td>
                                        <td className="py-6">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold group-hover:text-white transition-colors">{row.views}</span>
                                                <span className="text-[9px] text-green-500 font-bold">+2.4%</span>
                                            </div>
                                        </td>
                                        <td className="py-6 text-center">
                                            <span className={`text-sm font-bold tracking-tighter ${row.highlight ? 'text-orange-400' : 'text-white'}`}>{row.earnings}</span>
                                        </td>
                                        <td className="py-6">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-1.5 h-1.5 rounded-full ${row.status === 'Approved' ? 'bg-green-500' : 'bg-orange-500/50 rotate-in-progress'}`}></div>
                                                <span className={`text-[10px] font-bold uppercase tracking-widest ${row.status === 'Approved' ? 'text-green-500/80' : 'text-zinc-500'}`}>
                                                    {row.status}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-6 pr-2 text-right">
                                            <span className="text-[10px] font-bold text-zinc-600">{row.date}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </main>
        </div>
    );
};

export default EditorDashboard;
