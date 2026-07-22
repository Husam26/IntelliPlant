import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import Sidebar from './components/layout/Sidebar';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Copilot from './pages/Copilot';
import Documents from './pages/Documents';
import Assets from './pages/Assets';
import Compliance from './pages/Compliance';
import Insights from './pages/Insights';
import PlantMap from './pages/PlantMap';
import { PrivacyPage, TermsPage, SecurityPage, StatusPage } from './pages/InfoPages';
import './index.css';
import './styles/Layout.css'; 

const PAGE_TITLES = {
  '/dashboard': { title: 'Dashboard', subtitle: 'Overview of plant operations and asset health' },
  '/dashboard/copilot': { title: 'AI Copilot', subtitle: 'Ask questions about your industrial operations' },
  '/dashboard/documents': { title: 'Documents', subtitle: 'Upload and manage industrial documents' },
  '/dashboard/assets': { title: 'Assets', subtitle: 'Monitor equipment health and maintenance' },
  '/dashboard/compliance': { title: 'Compliance', subtitle: 'Track regulatory compliance and gaps' },
  '/dashboard/insights': { title: 'Insights', subtitle: 'Patterns, trends, and AI-generated recommendations' },
  '/dashboard/plant-map': { title: 'Digital Twin', subtitle: 'Interactive plant visualization with real-time asset health' },
};

function PageWrapper({ children, path }) {
  const info = PAGE_TITLES[path] || {};
  return (
    <>
      <div className="page-header">
        <div>
          <h1>{info.title}</h1>
          <div className="subtitle">{info.subtitle}</div>
        </div>
      </div>
      {children}
    </>
  );
}

function DashboardLayout() {
  return (
    <div className="app-layout ip-root">
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  useEffect(() => {
    // Ensure a default theme exists globally so CSS variables are active
    const currentTheme = localStorage.getItem('ip-theme') || 
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Landing & Info Pages */}
        <Route path="/" element={<Landing />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/security" element={<SecurityPage />} />
        <Route path="/status" element={<StatusPage />} />
        
        {/* Protected Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<PageWrapper path="/dashboard"><Dashboard /></PageWrapper>} />
          <Route path="copilot" element={<PageWrapper path="/dashboard/copilot"><Copilot /></PageWrapper>} />
          <Route path="documents" element={<PageWrapper path="/dashboard/documents"><Documents /></PageWrapper>} />
          <Route path="assets" element={<PageWrapper path="/dashboard/assets"><Assets /></PageWrapper>} />
          <Route path="compliance" element={<PageWrapper path="/dashboard/compliance"><Compliance /></PageWrapper>} />
          <Route path="insights" element={<PageWrapper path="/dashboard/insights"><Insights /></PageWrapper>} />
          <Route path="plant-map" element={<PageWrapper path="/dashboard/plant-map"><PlantMap /></PageWrapper>} />
        </Route>
      </Routes>
    </Router>
  );
}
