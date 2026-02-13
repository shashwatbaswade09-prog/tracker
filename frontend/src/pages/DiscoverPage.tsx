import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EditorSidebar from '../components/EditorSidebar';
import { Search, ArrowLeft } from 'lucide-react';

const DISCOVER_CAMPAIGNS = [
    {
        id: 1,
        title: "Bert Kreischer: $0.70 per 1,000 views",
        category: "Comedy Clipping",
        payout: "$0.70/1K views",
        budget: "$15,000",
        tag: "Comedy",
        img: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: 2,
        title: "Benny Blanco & Lil Dicky Fan Pages",
        category: "creatorXchange Clipper Marketplace",
        payout: "$1.00/1K views",
        budget: "$5,000",
        tag: "Music",
        img: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: 3,
        title: "James Hype Clipping (Head Talking Only)",
        category: "James Hype",
        payout: "$1.20/1K views",
        budget: "$3,000",
        tag: "Music",
        img: "https://images.unsplash.com/photo-1514525253361-bee8a187499b?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: 4,
        title: "UGC ONLY - 'Vibes' - Rich The Kid, DDG, Blueface",
        category: "ClipHaus",
        payout: "$2.00/1K views",
        budget: "$3,000",
        tag: "Music",
        img: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: 5,
        title: "Viral Artists Clipping",
        category: "MusicEraClipping",
        payout: "$0.15/1K views",
        budget: "$1,750",
        tag: "Music",
        img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: 6,
        title: "Clip For Saamir",
        category: "Clip Dealers",
        payout: "$0.50/1K views",
        budget: "$4,800",
        tag: "Personal brand",
        img: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=800&auto=format&fit=crop"
    }
];

const DiscoverPage = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div className="min-h-screen bg-[#020202] text-white flex">
            <EditorSidebar />

            <main className="flex-1 ml-64 min-h-screen flex flex-col">
                {/* Top Sticky Header (Centered Search) */}
                <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-white/5 px-8 flex items-center justify-between py-3">
                    <div className="flex-1 max-w-xl mx-auto relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-orange-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search Nexus..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:border-orange-500/50 transition-all placeholder:text-zinc-600"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-xs font-bold text-zinc-500 hover:text-white cursor-pointer transition-colors uppercase tracking-widest">API</span>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all">
                            Create a business
                        </button>
                    </div>
                </div>

                <div className="p-8 lg:p-12">
                    {/* Breadcrumb / Title */}
                    <div className="flex items-center gap-4 mb-8">
                        <ArrowLeft className="text-zinc-500 hover:text-white cursor-pointer transition-colors" size={20} />
                        <h2 className="text-xl font-bold tracking-tight">Discover Content Rewards</h2>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {DISCOVER_CAMPAIGNS.map((camp) => (
                            <motion.div
                                key={camp.id}
                                whileHover={{ y: -4 }}
                                onClick={() => navigate(`/editor/discover/${camp.id}`)}
                                className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden cursor-pointer group hover:border-white/10 transition-all"
                            >
                                <div className="h-48 relative overflow-hidden">
                                    <img
                                        src={camp.img}
                                        alt={camp.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest">
                                        {camp.tag}
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-500">View Rules & Join</p>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <div className="flex items-start gap-4 mb-3">
                                        <div className="w-10 h-10 rounded-full bg-zinc-800 border border-white/5 flex-shrink-0" />
                                        <div>
                                            <h3 className="text-sm font-bold leading-tight group-hover:text-orange-500 transition-colors uppercase tracking-tight line-clamp-2 underline-offset-4 group-hover:underline">
                                                {camp.title}
                                            </h3>
                                            <p className="text-[11px] text-zinc-500 mt-1">{camp.category}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 mt-4">
                                        <span className="text-[11px] font-black text-white">{camp.payout.split('/')[0]}</span>
                                        <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest opacity-50">• {camp.budget}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DiscoverPage;
