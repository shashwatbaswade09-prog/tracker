import { ShoppingCart, Search, Menu, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import nexusLogo from '../assets/nexus-logo.jpg';

const Navbar = () => {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between glass-panel px-6 py-3 border-orange-500/10">
                <div className="flex items-center gap-6">
                    <Link to="/" className="flex items-center gap-3 group">
                        <img src={nexusLogo} alt="Nexus" className="w-10 h-10 rounded-lg group-hover:scale-110 transition-transform" />
                        <div className="text-xl font-bold tracking-widest text-white uppercase hidden sm:block">
                            NEXUS <span className="text-orange-500">MEDIA</span>
                        </div>
                    </Link>
                    <div className="hidden lg:flex items-center gap-6 text-sm font-bold uppercase tracking-widest text-zinc-500">
                        <a href="#" className="hover:text-orange-500 transition-colors">Portal</a>
                        <a href="#" className="hover:text-orange-500 transition-colors">Network</a>
                        <a href="#" className="hover:text-orange-500 transition-colors">Resources</a>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative hidden sm:block">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                        <input
                            type="text"
                            placeholder="Search assets..."
                            className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-orange-500/50 w-48 xl:w-64 transition-all"
                        />
                    </div>

                    <button className="p-2 text-zinc-400 hover:text-orange-500 transition-colors">
                        <ShoppingCart size={20} />
                    </button>

                    <Link to="/login" className="nexus-btn flex items-center gap-2 py-2 text-sm">
                        <User size={18} />
                        <span className="hidden sm:inline">Portal Login</span>
                    </Link>

                    <button className="lg:hidden p-2 text-zinc-400 hover:text-orange-500">
                        <Menu size={24} />
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
