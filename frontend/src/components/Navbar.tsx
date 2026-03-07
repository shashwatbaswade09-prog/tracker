
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
                            NEXUS
                        </div>
                    </Link>
                    <div className="flex items-center gap-6 text-sm font-bold uppercase tracking-widest text-zinc-500">
                        <Link to="/portal" className="text-zinc-400 hover:text-orange-500 transition-colors">Portal</Link>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
