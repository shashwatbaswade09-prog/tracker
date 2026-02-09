import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import EditorSidebar from '../components/EditorSidebar';
import {
    Youtube, Instagram,
    X, ArrowLeft, MoreHorizontal, AlertTriangle
} from 'lucide-react';
import nexusLogo from '../assets/nexus-logo.jpg';

const CampaignDetailsPage = () => {
    const navigate = useNavigate();
    const { id: _id } = useParams();
    const [_isModalOpen, setIsModalOpen] = useState(false);
    const [_videoLink, _setVideoLink] = useState("");
    const [verifError, setVerifError] = useState<string | null>(null);

    // Mock verification check
    const checkVerification = () => {
        const verified = JSON.parse(localStorage.getItem('nexus_verified_platforms') || '[]');
        const campaignPlatform = 'instagram'; // Mock platform for this campaign
        if (!verified.includes(campaignPlatform)) {
            setVerifError("Platform Not Connected. Please verify your Instagram account in the 'Social Verification' section before submitting.");
            return false;
        }
        return true;
    };

    const handleOpenModal = () => {
        if (checkVerification()) {
            setIsModalOpen(true);
        }
    };

    const campaign = {
        title: "ThinkSchool's (Ganeshprasad) 🇮🇳 $0.50 per 1k views jan",
        reward: "$0.50 / 1K",
        type: "Clipping",
        minPayout: "$20.00",
        maxPayout: "$200.00",
        category: "Personal brand",
        platforms: [<Instagram key="ig" size={18} className="text-pink-600" />, <Youtube key="yt" size={18} className="text-red-600" />],
        paidOut: { current: "$3,955.72", total: "$3,955.72", percentage: 100 },
        requirements: [
            "Audio clips with the speakers must be in the highlights",
            "Clip must have branding as shown in reference",
            "Minimum 30 seconds, maximum 60 seconds"
        ],
        submissionsCount: 585
    };

    return (
        <div className="min-h-screen bg-[#020202] text-white flex">
            <EditorSidebar />
            <main className="flex-1 ml-64 min-h-screen flex flex-col relative">
                <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-white/5 px-8 flex items-center gap-6 py-4">
                    <button onClick={() => navigate('/editor/discover')} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
                        <ArrowLeft size={16} /> Back
                    </button>
                    <div className="flex-1 text-center"><h1 className="text-sm font-bold uppercase tracking-tight">{campaign.title}</h1></div>
                    <button className="text-zinc-500 hover:text-white transition-colors">
                        <MoreHorizontal size={20} />
                    </button>
                </div>

                <AnimatePresence>
                    {verifError && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="bg-red-500/10 border-b border-red-500/20 px-8 py-4 flex items-center justify-between"
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

                <div className="p-12 max-w-5xl mx-auto w-full pb-32">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-0 overflow-hidden mb-8 group">
                        <div className="aspect-video w-full bg-zinc-900 relative">
                            <img src="https://images.unsplash.com/photo-1593344484962-996055d493b4?q=80&w=1200" className="w-full h-full object-cover opacity-60" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#020202]" />
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center z-10">
                                <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">THINKSCHOOL <span className="text-blue-400">PODCAST</span></h2>
                                <div className="flex items-center justify-center gap-3">
                                    <img src={nexusLogo} className="w-6 h-6 rounded border border-orange-500/20" />
                                    <span className="text-xs font-black uppercase tracking-[0.4em] text-orange-500">NEXUS MEDIA</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <button className="w-full py-4 bg-white/5 border border-blue-500/20 rounded-xl text-blue-400 text-xs font-bold uppercase tracking-[0.2em] mb-12">See submissions ({campaign.submissionsCount})</button>

                    <div className="mb-12 space-y-4 px-1">
                        <div className="flex justify-between items-end"><p className="text-[10px] font-black uppercase text-zinc-600">PAID OUT</p><span className="text-[10px] font-black">{campaign.paidOut.percentage}%</span></div>
                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${campaign.paidOut.percentage}%` }} className="h-full bg-orange-500" /></div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-16">
                        {[
                            { label: "REWARD", value: campaign.reward, highlight: true },
                            { label: "TYPE", value: campaign.type },
                            { label: "MINIMUM", value: campaign.minPayout },
                            { label: "MAXIMUM", value: campaign.maxPayout },
                            { label: "CATEGORY", value: campaign.category },
                        ].map((stat, i) => (
                            <div key={i} className="p-4 rounded-xl bg-[#0a0a0a] border border-white/5">
                                <p className="text-[8px] font-black uppercase text-zinc-600 mb-2">{stat.label}</p>
                                <p className={`text-[11px] font-black uppercase ${stat.highlight ? 'bg-blue-600 text-white px-2 py-1 rounded inline-block' : 'text-zinc-200'}`}>{stat.value}</p>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-6 pb-20">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">REQUIREMENTS</h3>
                        <div className="flex flex-wrap gap-4">
                            {campaign.requirements.map((req, i) => (
                                <div key={i} className="px-6 py-4 rounded-xl bg-white/5 border border-white/5 text-xs font-bold uppercase text-zinc-400">{req}</div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="fixed bottom-0 left-64 right-0 p-6 bg-[#020202]/90 backdrop-blur-xl border-t border-white/5 z-50 flex items-center justify-between px-12 text-white">
                    <div>
                        <h4 className="text-sm font-black uppercase tracking-tight mb-1">{campaign.title}</h4>
                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{campaign.reward} / 1K</p>
                    </div>
                    <button
                        onClick={handleOpenModal}
                        className="bg-blue-600 text-white px-12 py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg hover:scale-105 active:scale-95 transition-all"
                    >
                        Submit
                    </button>
                </div>
            </main>
        </div>
    );
};

export default CampaignDetailsPage;
