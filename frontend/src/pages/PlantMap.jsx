/**
 * PlantMap Page — Interactive Digital Twin of the Industrial Plant.
 * 
 * Displays a 2D visual map of the plant with:
 * - Clickable asset nodes with real-time health indicators
 * - Animated connection lines showing process flow
 * - Detail panel on click showing health, incidents, documents
 * - Color-coded health status (green/yellow/red)
 */

import { useState, useEffect } from 'react';
import { Activity, AlertTriangle, FileText, X, Zap, Thermometer, Droplets, Wind } from 'lucide-react';
import { assetAPI, analyticsAPI } from '../services/api';
import '../styles/PlantMap.css';

// Plant layout positions for each asset type
const PLANT_LAYOUT = {
  'P-101': { x: 15, y: 55, zone: 'Unit A', icon: 'pump', label: 'Pump P-101', connections: ['HX-205', 'V-302'] },
  'P-102': { x: 15, y: 75, zone: 'Unit A', icon: 'pump', label: 'Pump P-102', connections: ['HX-205'] },
  'HX-205': { x: 40, y: 45, zone: 'Unit A', icon: 'exchanger', label: 'Heat Exchanger HX-205', connections: ['C-401'] },
  'V-302': { x: 40, y: 70, zone: 'Unit C', icon: 'valve', label: 'Valve V-302', connections: ['T-901'] },
  'C-401': { x: 65, y: 40, zone: 'Unit B', icon: 'compressor', label: 'Compressor C-401', connections: ['T-901'] },
  'M-505': { x: 65, y: 75, zone: 'Packaging', icon: 'motor', label: 'Motor M-505', connections: [] },
  'T-901': { x: 85, y: 55, zone: 'Tank Farm', icon: 'tank', label: 'Tank T-901', connections: [] },
};

const ASSET_ICONS = {
  pump: Droplets,
  exchanger: Thermometer,
  valve: Activity,
  compressor: Wind,
  motor: Zap,
  tank: FileText,
};

function getHealthColor(score) {
  if (score >= 80) return '#10b981';
  if (score >= 60) return '#f59e0b';
  return '#ef4444';
}

function getHealthStatus(score) {
  if (score >= 80) return 'Healthy';
  if (score >= 60) return 'Warning';
  return 'Critical';
}

function getGlowClass(score) {
  if (score >= 80) return 'glow-green';
  if (score >= 60) return 'glow-amber';
  return 'glow-red';
}

export default function PlantMap() {
  const [assets, setAssets] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [incidents, setIncidents] = useState([]);
  const [riskScores, setRiskScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlantData();
  }, []);

  async function loadPlantData() {
    try {
      const [assetsRes, riskRes] = await Promise.all([
        assetAPI.list(),
        analyticsAPI.getRiskScores(),
      ]);
      setAssets(assetsRes.data.assets || []);
      setRiskScores(riskRes.data.risk_scores || []);
    } catch (err) {
      console.error('Failed to load plant data:', err);
    } finally {
      setLoading(false);
    }
  }

  async function selectAsset(asset) {
    setSelectedAsset(asset);
    try {
      const res = await assetAPI.getIncidents(asset.id);
      setIncidents(res.data.incidents || []);
    } catch {
      setIncidents([]);
    }
  }

  // Merge backend asset data with layout positions
  const plantNodes = assets.map(asset => ({
    ...asset,
    layout: PLANT_LAYOUT[asset.id] || { x: 50, y: 50, zone: 'Unknown', icon: 'pump', label: asset.name, connections: [] },
  }));

  // Generate connection lines between assets
  const connections = [];
  plantNodes.forEach(node => {
    (node.layout.connections || []).forEach(targetId => {
      const target = plantNodes.find(n => n.id === targetId);
      if (target) {
        connections.push({
          from: node,
          to: target,
          key: `${node.id}-${target.id}`,
        });
      }
    });
  });

  if (loading) {
    return (
      <div className="page-content">
        <div className="plant-map-loading">
          <div className="spinner" />
          <p>Loading Digital Twin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      {/* Plant Stats Bar */}
      <div className="plant-stats-bar">
        <div className="plant-stat">
          <span className="plant-stat-value">{assets.length}</span>
          <span className="plant-stat-label">Total Assets</span>
        </div>
        <div className="plant-stat">
          <span className="plant-stat-value healthy">{assets.filter(a => a.health_score >= 80).length}</span>
          <span className="plant-stat-label">Healthy</span>
        </div>
        <div className="plant-stat">
          <span className="plant-stat-value warning">{assets.filter(a => a.health_score >= 60 && a.health_score < 80).length}</span>
          <span className="plant-stat-label">Warning</span>
        </div>
        <div className="plant-stat">
          <span className="plant-stat-value critical">{assets.filter(a => a.health_score < 60).length}</span>
          <span className="plant-stat-label">Critical</span>
        </div>
      </div>

      <div className="plant-map-container">
        {/* SVG Canvas for connections */}
        <svg className="plant-connections-svg">
          <defs>
            <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          {connections.map(conn => (
            <g key={conn.key}>
              <line
                className="connection-line"
                x1={`${conn.from.layout.x}%`} y1={`${conn.from.layout.y}%`}
                x2={`${conn.to.layout.x}%`} y2={`${conn.to.layout.y}%`}
              />
              <line
                className="connection-flow"
                x1={`${conn.from.layout.x}%`} y1={`${conn.from.layout.y}%`}
                x2={`${conn.to.layout.x}%`} y2={`${conn.to.layout.y}%`}
              />
            </g>
          ))}
        </svg>

        {/* Zone Labels */}
        <div className="zone-label" style={{ left: '5%', top: '35%' }}>Unit A</div>
        <div className="zone-label" style={{ left: '55%', top: '20%' }}>Unit B</div>
        <div className="zone-label" style={{ left: '30%', top: '85%' }}>Unit C</div>
        <div className="zone-label" style={{ left: '75%', top: '75%' }}>Packaging</div>
        <div className="zone-label" style={{ left: '78%', top: '35%' }}>Tank Farm</div>

        {/* Asset Nodes */}
        {plantNodes.map(node => {
          const IconComp = ASSET_ICONS[node.layout.icon] || Activity;
          const healthColor = getHealthColor(node.health_score);
          const isSelected = selectedAsset?.id === node.id;

          return (
            <div
              key={node.id}
              className={`plant-node ${getGlowClass(node.health_score)} ${isSelected ? 'selected' : ''}`}
              style={{
                left: `${node.layout.x}%`,
                top: `${node.layout.y}%`,
                borderColor: healthColor,
              }}
              onClick={() => selectAsset(node)}
            >
              <div className="node-pulse" style={{ borderColor: healthColor }} />
              <div className="node-icon" style={{ background: `${healthColor}22` }}>
                <IconComp size={22} color={healthColor} />
              </div>
              <div className="node-label">{node.id}</div>
              <div className="node-health" style={{ color: healthColor }}>
                {Math.round(node.health_score)}%
              </div>
            </div>
          );
        })}

        {/* Detail Panel */}
        {selectedAsset && (
          <div className="plant-detail-panel">
            <div className="detail-header">
              <div>
                <h3>{selectedAsset.name}</h3>
                <span className="detail-zone">{selectedAsset.layout.zone} • {selectedAsset.type}</span>
              </div>
              <button className="detail-close" onClick={() => setSelectedAsset(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="detail-health-ring">
              <svg viewBox="0 0 120 120" className="health-ring-svg">
                <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                <circle
                  cx="60" cy="60" r="50" fill="none"
                  stroke={getHealthColor(selectedAsset.health_score)}
                  strokeWidth="8"
                  strokeDasharray={`${(selectedAsset.health_score / 100) * 314} 314`}
                  strokeLinecap="round"
                  transform="rotate(-90 60 60)"
                  className="health-ring-progress"
                />
              </svg>
              <div className="health-ring-text">
                <div className="health-ring-value" style={{ color: getHealthColor(selectedAsset.health_score) }}>
                  {Math.round(selectedAsset.health_score)}%
                </div>
                <div className="health-ring-label">{getHealthStatus(selectedAsset.health_score)}</div>
              </div>
            </div>

            <div className="detail-info-grid">
              <div className="detail-info-item">
                <span className="detail-info-label">Criticality</span>
                <span className={`badge badge-${selectedAsset.criticality?.toLowerCase()}`}>{selectedAsset.criticality}</span>
              </div>
              <div className="detail-info-item">
                <span className="detail-info-label">Status</span>
                <span className="detail-info-value">{selectedAsset.status || 'Active'}</span>
              </div>
            </div>

            {/* Recent Incidents */}
            <div className="detail-section">
              <h4><AlertTriangle size={14} /> Recent Incidents</h4>
              {incidents.length === 0 ? (
                <div className="detail-empty">No recent incidents</div>
              ) : (
                incidents.slice(0, 3).map((inc, i) => (
                  <div key={i} className="detail-incident">
                    <span className={`incident-dot ${inc.severity?.toLowerCase()}`} />
                    <div>
                      <div className="incident-title">{inc.title}</div>
                      <div className="incident-meta">{inc.severity} • {inc.status}</div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Connected Assets */}
            <div className="detail-section">
              <h4><Activity size={14} /> Connected Assets</h4>
              <div className="connected-assets">
                {(selectedAsset.layout.connections || []).length === 0 ? (
                  <div className="detail-empty">End of process line</div>
                ) : (
                  (selectedAsset.layout.connections || []).map(connId => (
                    <span key={connId} className="connected-tag" onClick={() => {
                      const a = plantNodes.find(n => n.id === connId);
                      if (a) selectAsset(a);
                    }}>
                      {connId} →
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
