/**
 * App.jsx — Root component with routing and layout.
 * 
 * Uses React Router for client-side navigation.
 * Layout: Fixed sidebar + scrollable main content area.
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import Copilot from './pages/Copilot';
import Documents from './pages/Documents';
import Assets from './pages/Assets';
import Compliance from './pages/Compliance';
import Insights from './pages/Insights';
import PlantMap from './pages/PlantMap';
import './index.css';

const PAGE_TITLES = {
  '/': { title: 'Dashboard', subtitle: 'Overview of plant operations and asset health' },
  '/copilot': { title: 'AI Copilot', subtitle: 'Ask questions about your industrial operations' },
  '/documents': { title: 'Documents', subtitle: 'Upload and manage industrial documents' },
  '/assets': { title: 'Assets', subtitle: 'Monitor equipment health and maintenance' },
  '/compliance': { title: 'Compliance', subtitle: 'Track regulatory compliance and gaps' },
  '/insights': { title: 'Insights', subtitle: 'Patterns, trends, and AI-generated recommendations' },
  '/plant-map': { title: 'Digital Twin', subtitle: 'Interactive plant visualization with real-time asset health' },
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

export default function App() {
  return (
    <Router>
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<PageWrapper path="/"><Dashboard /></PageWrapper>} />
            <Route path="/copilot" element={<PageWrapper path="/copilot"><Copilot /></PageWrapper>} />
            <Route path="/documents" element={<PageWrapper path="/documents"><Documents /></PageWrapper>} />
            <Route path="/assets" element={<PageWrapper path="/assets"><Assets /></PageWrapper>} />
            <Route path="/compliance" element={<PageWrapper path="/compliance"><Compliance /></PageWrapper>} />
            <Route path="/insights" element={<PageWrapper path="/insights"><Insights /></PageWrapper>} />
            <Route path="/plant-map" element={<PageWrapper path="/plant-map"><PlantMap /></PageWrapper>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
