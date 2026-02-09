import {
    LayoutDashboard,
    Target,
    DollarSign,
    ShieldCheck,
    CreditCard,
    Users,
    Settings,
    LogOut,
    ChevronRight,
    Globe,
    User as UserIcon
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import nexusLogo from '../assets/nexus-logo.jpg';
import { authApi } from '../services/api';
import type { User } from '../services/api';

const EditorSidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await authApi.getMe();
                setUser(userData);
            } catch (err) {
                console.error('Failed to fetch user:', err);
                // navigate('/login');
            }
        };
        fetchUser();
    }, []);

    const handleLogout = () => {
        authApi.logout();
        navigate('/login');
    };

    const menuItems = [
        { icon: <Globe size={20} />, label: 'Discover', path: '/editor/discover' },
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/editor/dashboard' },
        { icon: <Target size={20} />, label: 'My Campaigns', path: '/editor/campaigns' },
        { icon: <DollarSign size={20} />, label: 'Earnings', path: '/editor/earnings' },
        { icon: <ShieldCheck size={20} />, label: 'Social Verification', path: '/editor/verification' },
        { icon: <CreditCard size={20} />, label: 'Bank Accounts', path: '/editor/billing' },
        { icon: <Users size={20} />, label: 'Referrals', path: '/editor/referrals' },
        { icon: <Settings size={20} />, label: 'Settings', path: '/editor/settings' },
    ];

    return (
        <aside className="w-64 h-screen fixed left-0 top-0 bg-black border-r border-orange-500/10 flex flex-col z-50 overflow-hidden">
            <div className="p-6 border-b border-orange-500/10 flex items-center justify-center">
                <Link to="/" className="flex flex-col items-center gap-2 group">
                    <div className="relative">
                        <div className="absolute inset-0 bg-orange-500/20 blur-lg rounded-full group-hover:bg-orange-500/40 transition-all"></div>
                        <img src={nexusLogo} alt="Nexus" className="w-12 h-12 rounded-xl relative z-10 border border-orange-500/20" />
                    </div>
                    <span className="font-bold tracking-[0.2em] text-white uppercase text-[10px] mt-2 group-hover:text-orange-500 transition-colors">
                        Nexus <span className="text-orange-500">Editor</span>
                    </span>
                </Link>
            </div>

            <nav className="flex-1 p-4 space-y-1 mt-4 overflow-y-auto scrollbar-hide">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.label}
                            to={item.path}
                            className={`flex items-center justify-between group px-4 py-3 rounded-xl transition-all duration-300 ${isActive
                                ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20 shadow-[0_0_20px_rgba(255,107,0,0.05)]'
                                : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <span className={`${isActive ? 'text-orange-500' : 'text-zinc-400 group-hover:text-orange-500 transition-colors'}`}>
                                    {item.icon}
                                </span>
                                <span className="text-[11px] font-bold uppercase tracking-widest leading-none">
                                    {item.label}
                                </span>
                            </div>
                            {isActive && <ChevronRight size={14} className="text-orange-500/50" />}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-6 border-t border-orange-500/10 bg-zinc-900/10">
                <div className="flex items-center gap-3 mb-6 p-2 rounded-lg bg-white/5 border border-white/5">
                    <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                        <UserIcon className="text-orange-500" size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-white truncate">{user?.username || 'Loading...'}</p>
                        <p className="text-[10px] text-zinc-500 truncate">{user?.whop_email || 'Connecting...'}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-2 w-full text-zinc-500 hover:text-red-500 transition-all uppercase tracking-widest font-bold text-[10px] group"
                >
                    <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default EditorSidebar;
