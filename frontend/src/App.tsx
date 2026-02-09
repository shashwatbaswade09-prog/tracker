import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoadingPage from './pages/LoadingPage';
import LoginPage from './pages/LoginPage';
import DiscoverPage from './pages/DiscoverPage';
import CampaignDetailsPage from './pages/CampaignDetailsPage';
import EditorDashboard from './pages/EditorDashboard';
import CampaignsPage from './pages/CampaignsPage';
import VerificationPage from './pages/VerificationPage';
import ComingSoonPage from './pages/ComingSoonPage';
import ChatbotDemo from './components/ChatbotDemo';
import './index.css';

function AppContent() {
  const [isLoading, setIsLoading] = useState(() => {
    return window.location.pathname === '/' && !sessionStorage.getItem('nexus_loaded');
  });

  const handleLoadingComplete = () => {
    sessionStorage.setItem('nexus_loaded', 'true');
    setIsLoading(false);
  };

  if (isLoading) {
    return <LoadingPage onComplete={handleLoadingComplete} />;
  }

  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<><Navbar /><LandingPage /></>} />
        <Route path="/login" element={<LoginPage />} />

        {/* Placeholder Routes */}
        <Route path="/portal" element={<><Navbar /><ComingSoonPage title="Portal" /></>} />
        <Route path="/network" element={<><Navbar /><ComingSoonPage title="Network" /></>} />
        <Route path="/resources" element={<><Navbar /><ComingSoonPage title="Resources" /></>} />

        {/* Editor Routes */}
        <Route path="/editor/discover" element={<DiscoverPage />} />
        <Route path="/editor/discover/:id" element={<CampaignDetailsPage />} />
        <Route path="/editor/campaigns" element={<CampaignsPage />} />
        <Route path="/editor/dashboard" element={<EditorDashboard />} />
        <Route path="/editor/verification" element={<VerificationPage />} />

        {/* Fallbacks */}
        <Route path="/editor/*" element={<DiscoverPage />} />

        <Route path="/admin/dashboard" element={<div className="p-20 text-center text-white">Admin Dashboard Placeholder</div>} />
      </Routes>
      <ChatbotDemo />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
