import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { adminApi, authApi, type User, type AdminStats } from '../services/api';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar
} from 'recharts';
import {
    TrendingUp, Eye, Users,
    ClipboardList, Zap,
    Shield, Globe, Activity,
    ChevronRight, Settings
} from 'lucide-react';

// Mock data for trends (since backend doesn't provide historical data yet)
const trendData = [
    { name: 'Mon', views: 4200, submissions: 12 },
    { name: 'Tue', views: 18000, submissions: 45 },
    { name: 'Wed', views: 12000, submissions: 30 },
    { name: 'Thu', views: 45000, submissions: 85 },
    { name: 'Fri', views: 24000, submissions: 52 },
    { name: 'Sat', views: 32000, submissions: 71 },
    { name: 'Sun', views: 56000, submissions: 104 },
];

const StatCard = ({ icon, label, value, trend, trendType }: any) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="glass-panel p-6 border-white/5 hover:border-orange-500/20 transition-all flex flex-col gap-4 relative overflow-hidden group"
    >
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-orange-500/5 rounded-full blur-2xl group-hover:bg-orange-500/10 transition-all" />
        <div className="flex items-center justify-between relative z-10">
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 text-orange-500 group-hover:scale-110 group-hover:bg-orange-500/10 transition-all">
                {icon}
            </div>
            {trend && (
                <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${trendType === 'up' ? 'text-green-500 bg-green-500/10' : 'text-red-500 bg-red-500/10'}`}>
                    {trendType === 'up' ? <TrendingUp size={10} /> : <TrendingUp size={10} className="rotate-180" />}
                    {trend}
                </div>
            )}
        </div>
        <div className="relative z-10">
            <p className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-bold mb-1">{label}</p>
            <h3 className="text-3xl font-bold text-white tracking-tighter">{value}</h3>
        </div>
    </motion.div>
);

const AdminDashboard = () => {
    const [me, setMe] = useState<User | null>(null);
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [meData, statsData, usersData] = await Promise.all([
                    authApi.getMe(),
                    adminApi.getStats(),
                    adminApi.getUsers(),
                ]);
                setMe(meData);
                setStats(statsData);
                // Handle paginated response
                setUsers(Array.isArray(usersData) ? usersData : (usersData as any).results || []);
            } catch (err) {
                console.error('Failed to fetch admin data:', err);
            }
        };
        fetchData();
    }, []);

    const formatNumber = (val: any) => {
        const num = Number(val) || 0;
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    };

    return (
        <div className="min-h-screen bg-[#020202] text-white flex">
            <AdminSidebar />

            <main className="flex-1 ml-64 p-8 lg:p-12 overflow-y-auto">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <Shield className="text-orange-500" size={20} />
                            <span className="text-orange-500 font-bold uppercase tracking-widest text-xs">Administrative Control</span>
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold tracking-tighter uppercase mb-2">
                            System <span className="text-white">Overview</span>
                        </h1>
                        <p className="text-zinc-500 text-lg flex items-center gap-2">
                            Welcome back, {me?.username || 'Admin'}. Monitoring Nexus global network.
                        </p>
                    </motion.div>

                    <div className="flex gap-4">
                        <div className="px-6 py-3 glass-panel border-white/5 flex flex-col gap-1 ring-1 ring-white/5">
                            <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest leading-none">Status</span>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                <span className="text-sm font-bold text-white uppercase tracking-tighter">Live Network</span>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <StatCard
                        icon={<Users size={24} />}
                        label="Total Network Users"
                        value={users.length.toString()}
                        trend="+4"
                        trendType="up"
                    />
                    <StatCard
                        icon={<Eye size={24} />}
                        label="Cumulative Reach"
                        value={formatNumber(stats?.total_views || 0)}
                        trend="+18%"
                        trendType="up"
                    />
                    <StatCard
                        icon={<ClipboardList size={24} />}
                        label="Total Submissions"
                        value={stats?.total_submissions?.toString() || "0"}
                        trend="+12"
                        trendType="up"
                    />
                    <StatCard
                        icon={<Activity size={24} />}
                        label="Network Uptime"
                        value="99.9%"
                        trend="+0.1%"
                        trendType="up"
                    />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 mb-12">
                    <div className="xl:col-span-8 flex flex-col gap-8">
                        {/* Reach Graph */}
                        <div className="glass-panel p-8 relative overflow-hidden ring-1 ring-white/5">
                            <div className="absolute top-0 right-0 p-8 flex gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(255,107,0,0.5)]"></div>
                                    <span className="text-[10px] font-bold uppercase text-zinc-500 tracking-widest">Global Reach</span>
                                </div>
                            </div>
                            <h3 className="text-sm font-black uppercase tracking-[0.3em] mb-10 flex items-center gap-3">
                                <Activity className="text-orange-500" size={16} /> Reach Trends
                            </h3>
                            <div className="h-[350px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={trendData}>
                                        <defs>
                                            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#ff6b00" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#ff6b00" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                                        <XAxis
                                            dataKey="name"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#52525b', fontSize: 10, fontWeight: 800 }}
                                            dy={10}
                                        />
                                        <YAxis hide />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,107,0,0.2)', borderRadius: '12px' }}
                                            itemStyle={{ color: '#ff6b00', textTransform: 'uppercase', fontSize: '10px', fontWeight: 'bold' }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="views"
                                            stroke="#ff6b00"
                                            strokeWidth={3}
                                            fillOpacity={1}
                                            fill="url(#colorViews)"
                                            animationDuration={2000}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Recent User Activity */}
                        <div className="glass-panel p-8 ring-1 ring-white/5">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-sm font-black uppercase tracking-[0.3em]">Network User Directory</h3>
                                <button className="text-[10px] font-black text-orange-500 uppercase tracking-widest hover:text-orange-400 transition-colors">Audit All Users</button>
                            </div>
                            <div className="space-y-4">
                                {users.slice(0, 5).map((u) => (
                                    <div key={u.id} className="flex items-center justify-between p-4 glass-card border-white/5 group hover:border-orange-500/20 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xs font-black text-orange-500 uppercase group-hover:bg-orange-500/10 transition-all">
                                                {u.username.substring(0, 2)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-white uppercase tracking-tight">{u.username}</p>
                                                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter">{u.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-8">
                                            <div className="text-right">
                                                <p className="text-[10px] text-zinc-500 uppercase font-bold mb-0.5">Role</p>
                                                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${u.role === 'ADMIN' ? 'bg-orange-500/10 text-orange-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                                    {u.role || 'USER'}
                                                </span>
                                            </div>
                                            <div className="text-right min-w-[100px]">
                                                <p className="text-[10px] text-zinc-500 uppercase font-bold mb-0.5">Joined</p>
                                                <p className="text-[10px] text-white font-bold">{u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="xl:col-span-4 flex flex-col gap-8">
                        {/* Submissions Stats */}
                        <div className="glass-panel p-8 ring-1 ring-white/5 bg-orange-500/[0.02]">
                            <h3 className="text-sm font-black uppercase tracking-[0.3em] mb-8">Asset Metrics</h3>
                            <div className="h-[200px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={trendData}>
                                        <Bar dataKey="submissions" fill="#ff6b00" radius={[4, 4, 0, 0]} />
                                        <XAxis dataKey="name" hide />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,107,0,0.2)', borderRadius: '12px' }}
                                            itemStyle={{ color: '#ff6b00', textTransform: 'uppercase', fontSize: '10px', fontWeight: 'bold' }}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="mt-8 space-y-4">
                                <div className="flex justify-between items-center text-[11px] font-bold border-b border-white/5 pb-2">
                                    <span className="text-zinc-500 uppercase">Pending Review</span>
                                    <span className="text-white">0</span>
                                </div>
                                <div className="flex justify-between items-center text-[11px] font-bold border-b border-white/5 pb-2">
                                    <span className="text-zinc-500 uppercase">Average Approval Time</span>
                                    <span className="text-white">2.4h</span>
                                </div>
                                <div className="flex justify-between items-center text-[11px] font-bold border-b border-white/5 pb-2">
                                    <span className="text-zinc-500 uppercase">Hot Campaigns</span>
                                    <span className="text-orange-500">4 Active</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Admin Actions */}
                        <div className="glass-panel p-8 ring-1 ring-white/5">
                            <h3 className="text-sm font-black uppercase tracking-[0.3em] mb-8">System Actions</h3>
                            <div className="grid grid-cols-1 gap-3">
                                <button className="w-full flex items-center justify-between p-4 glass-card group hover:border-orange-500/30 transition-all font-black text-[10px] uppercase tracking-widest">
                                    <span className="flex items-center gap-3"><Zap size={14} className="text-orange-500" /> Flush Cache</span>
                                    <ChevronRight size={14} className="text-zinc-700 group-hover:text-orange-500 transition-all" />
                                </button>
                                <button className="w-full flex items-center justify-between p-4 glass-card group hover:border-blue-500/30 transition-all font-black text-[10px] uppercase tracking-widest">
                                    <span className="flex items-center gap-3"><Globe size={14} className="text-blue-500" /> View Live Logs</span>
                                    <ChevronRight size={14} className="text-zinc-700 group-hover:text-blue-500 transition-all" />
                                </button>
                                <button className="w-full flex items-center justify-between p-4 glass-card group hover:border-white/20 transition-all font-black text-[10px] uppercase tracking-widest">
                                    <span className="flex items-center gap-3"><Settings size={14} className="text-zinc-400" /> Global Config</span>
                                    <ChevronRight size={14} className="text-zinc-700 group-hover:text-white transition-all" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
