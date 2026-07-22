/**
 * PlantMap Page — Interactive Digital Twin of the Industrial Plant.
 * 
 * FULLY DYNAMIC: Users can add, drag, and remove assets via the UI.
 * No hardcoded positions — everything comes from the database.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { Activity, AlertTriangle, X, Zap, Thermometer, Droplets, Wind, Plus, Trash2, GripVertical } from 'lucide-react';
import { assetAPI, analyticsAPI } from '../services/api';
import '../styles/PlantMap.css';

const ASSET_TYPE_ICONS = {
  Pump: Droplets,
  Exchanger: Thermometer,
  Valve: Activity,
  Compressor: Wind,
  Motor: Zap,
  Tank: Activity,
  Equipment: Zap,
};

function getHealthColor(score) {
  if (score >= 80) return 'var(--ip-accent)';
  if (score >= 60) return 'var(--ip-warning)';
  return 'var(--ip-danger)';
}

function getHealthSoftColor(score) {
  if (score >= 80) return 'var(--ip-accent-soft)';
  if (score >= 60) return 'var(--ip-warning-soft)';
  return 'var(--ip-danger-soft)';
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
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [dragState, setDragState] = useState(null);
  const mapRef = useRef(null);

  // Form state for adding a new asset
  const [newAsset, setNewAsset] = useState({
    id: '', name: '', type: 'Pump', location: '', criticality: 'Medium', health_score: 85,
  });
  const [selectedConnections, setSelectedConnections] = useState([]);

  useEffect(() => {
    loadPlantData();
  }, []);

  async function loadPlantData() {
    try {
      const res = await assetAPI.list();
      setAssets(res.data.assets || []);
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

  async function handleAddAsset(e) {
    e.preventDefault();
    try {
      // Auto-assign position in a grid pattern based on existing count
      const count = assets.length;
      const col = count % 4;
      const row = Math.floor(count / 4);
      const x_pos = 15 + col * 22;
      const y_pos = 35 + row * 25;

      await assetAPI.create({
        ...newAsset,
        x_pos, y_pos,
        connections: selectedConnections.join(','),
      });
      setShowAddModal(false);
      setNewAsset({ id: '', name: '', type: 'Pump', location: '', criticality: 'Medium', health_score: 85 });
      setSelectedConnections([]);
      loadPlantData();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to add asset');
    }
  }

  async function handleDeleteAsset(assetId) {
    if (!confirm(`Delete asset ${assetId}?`)) return;
    try {
      await assetAPI.delete(assetId);
      setSelectedAsset(null);
      loadPlantData();
    } catch (err) {
      alert('Failed to delete asset');
    }
  }

  // --- Drag & Drop Logic ---
  const dragRef = useRef(null);  // Use ref for immediate access (no React batching delay)
  const didDragRef = useRef(false);

  const handleMouseDown = useCallback((e, asset) => {
    e.preventDefault();
    const rect = mapRef.current.getBoundingClientRect();
    didDragRef.current = false;
    dragRef.current = {
      assetId: asset.id,
      startX: e.clientX,
      startY: e.clientY,
      origX: asset.x_pos,
      origY: asset.y_pos,
      mapWidth: rect.width,
      mapHeight: rect.height,
    };

    const handleMouseMove = (ev) => {
      const ds = dragRef.current;
      if (!ds) return;
      const distX = Math.abs(ev.clientX - ds.startX);
      const distY = Math.abs(ev.clientY - ds.startY);
      // Only start dragging after 5px movement threshold
      if (distX < 5 && distY < 5) return;
      didDragRef.current = true;
      setDragState(ds); // Trigger visual drag state

      const dx = ((ev.clientX - ds.startX) / ds.mapWidth) * 100;
      const dy = ((ev.clientY - ds.startY) / ds.mapHeight) * 100;
      const newX = Math.max(5, Math.min(95, ds.origX + dx));
      const newY = Math.max(10, Math.min(90, ds.origY + dy));
      setAssets(prev => prev.map(a =>
        a.id === ds.assetId ? { ...a, x_pos: newX, y_pos: newY } : a
      ));
    };

    const handleMouseUp = async (ev) => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      const ds = dragRef.current;
      dragRef.current = null;
      setDragState(null);

      if (!didDragRef.current) {
        // No drag happened — treat as a click to open detail panel
        selectAsset(asset);
        return;
      }

      // Save new position
      if (ds) {
        const dx = ((ev.clientX - ds.startX) / ds.mapWidth) * 100;
        const dy = ((ev.clientY - ds.startY) / ds.mapHeight) * 100;
        const newX = Math.max(5, Math.min(95, ds.origX + dx));
        const newY = Math.max(10, Math.min(90, ds.origY + dy));
        try {
          await assetAPI.updatePosition(ds.assetId, newX, newY);
        } catch (err) {
          console.error('Failed to save position:', err);
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, [assets]);

  // Build connection lines from the connections field
  const connectionLines = [];
  assets.forEach(asset => {
    const conns = (asset.connections || '').split(',').map(s => s.trim()).filter(Boolean);
    conns.forEach(targetId => {
      const target = assets.find(a => a.id === targetId);
      if (target) {
        connectionLines.push({ from: asset, to: target, key: `${asset.id}-${targetId}` });
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
        <button className="ip-btn ip-btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={18} /> Add Asset
        </button>
      </div>

      <div className="plant-map-container" ref={mapRef}>
        {/* SVG Connections */}
        <svg className="plant-connections-svg">
          {connectionLines.map(conn => (
            <g key={conn.key}>
              <line className="connection-line"
                x1={`${conn.from.x_pos}%`} y1={`${conn.from.y_pos}%`}
                x2={`${conn.to.x_pos}%`} y2={`${conn.to.y_pos}%`}
              />
              <line className="connection-flow"
                x1={`${conn.from.x_pos}%`} y1={`${conn.from.y_pos}%`}
                x2={`${conn.to.x_pos}%`} y2={`${conn.to.y_pos}%`}
              />
            </g>
          ))}
        </svg>

        {/* Drag hint */}
        {assets.length > 0 && !selectedAsset && (
          <div className="drag-hint">
            <GripVertical size={14} /> Drag assets to reposition them on the map
          </div>
        )}

        {/* Asset Nodes */}
        {assets.map(node => {
          const IconComp = ASSET_TYPE_ICONS[node.type] || Zap;
          const healthColor = getHealthColor(node.health_score);
          const healthSoftColor = getHealthSoftColor(node.health_score);
          const isSelected = selectedAsset?.id === node.id;
          const isDragging = dragState?.assetId === node.id;

          return (
            <div
              key={node.id}
              className={`plant-node ${getGlowClass(node.health_score)} ${isSelected ? 'selected' : ''} ${isDragging ? 'dragging' : ''}`}
              style={{
                left: `${node.x_pos}%`,
                top: `${node.y_pos}%`,
                borderColor: healthColor,
              }}
              onMouseDown={(e) => handleMouseDown(e, node)}
            >
              <div className="node-pulse" style={{ borderColor: healthColor }} />
              <div className="node-icon" style={{ background: healthSoftColor }}>
                <IconComp size={22} color={healthColor} />
              </div>
              <div className="node-label">{node.id}</div>
              <div className="node-health" style={{ color: healthColor }}>
                {Math.round(node.health_score)}%
              </div>
            </div>
          );
        })}

        {/* Empty State */}
        {assets.length === 0 && (
          <div className="plant-empty-state">
            <Zap size={48} />
            <h3>No assets on the plant map</h3>
            <p>Click "Add Asset" to start building your Digital Twin</p>
          </div>
        )}

        {/* Detail Panel */}
        {selectedAsset && (
          <div className="plant-detail-panel">
            <div className="detail-header">
              <div>
                <h3>{selectedAsset.name}</h3>
                <span className="detail-zone">{selectedAsset.location} • {selectedAsset.type}</span>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button className="detail-close danger" onClick={() => handleDeleteAsset(selectedAsset.id)} title="Delete asset">
                  <Trash2 size={16} />
                </button>
                <button className="detail-close" onClick={() => setSelectedAsset(null)}>
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="detail-health-ring">
              <svg viewBox="0 0 120 120" className="health-ring-svg">
                <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                <circle cx="60" cy="60" r="50" fill="none"
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
                <span className={`ip-badge ip-badge-${selectedAsset.criticality?.toLowerCase() === 'high' || selectedAsset.criticality?.toLowerCase() === 'critical' ? 'danger' : selectedAsset.criticality?.toLowerCase() === 'medium' ? 'warning' : 'good'}`}>{selectedAsset.criticality}</span>
              </div>
              <div className="detail-info-item">
                <span className="detail-info-label">Status</span>
                <span className="detail-info-value">{selectedAsset.status || 'Active'}</span>
              </div>
            </div>

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

            {/* Edit Connections */}
            <div className="detail-section">
              <h4><Activity size={14} /> Process Flow Connections</h4>
              <div className="connections-picker">
                {assets.filter(a => a.id !== selectedAsset.id).map(a => {
                  const currentConns = (selectedAsset.connections || '').split(',').map(s => s.trim()).filter(Boolean);
                  const isConnected = currentConns.includes(a.id);
                  return (
                    <label key={a.id} className={`connection-chip ${isConnected ? 'active' : ''}`}>
                      <input type="checkbox" checked={isConnected}
                        onChange={async (e) => {
                          let newConns;
                          if (e.target.checked) {
                            newConns = [...currentConns, a.id];
                          } else {
                            newConns = currentConns.filter(c => c !== a.id);
                          }
                          const connStr = newConns.join(',');
                          // Update locally
                          setAssets(prev => prev.map(ast =>
                            ast.id === selectedAsset.id ? { ...ast, connections: connStr } : ast
                          ));
                          setSelectedAsset(prev => ({ ...prev, connections: connStr }));
                          // Save to backend
                          try {
                            await assetAPI.updateConnections(selectedAsset.id, connStr);
                          } catch (err) {
                            console.error('Failed to update connections:', err);
                          }
                        }} />
                      <span className="chip-dot" style={{ background: getHealthColor(a.health_score) }} />
                      {a.id}
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Asset Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Asset</h3>
              <button className="detail-close" onClick={() => setShowAddModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleAddAsset} className="modal-form">
              <div className="form-group">
                <label>Asset ID</label>
                <input type="text" placeholder="e.g. P-201" value={newAsset.id}
                  onChange={e => setNewAsset({...newAsset, id: e.target.value.toUpperCase()})} required />
              </div>
              <div className="form-group">
                <label>Asset Name</label>
                <input type="text" placeholder="e.g. Centrifugal Pump 201" value={newAsset.name}
                  onChange={e => setNewAsset({...newAsset, name: e.target.value})} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Type</label>
                  <select value={newAsset.type} onChange={e => setNewAsset({...newAsset, type: e.target.value})}>
                    <option>Pump</option>
                    <option>Compressor</option>
                    <option>Exchanger</option>
                    <option>Motor</option>
                    <option>Valve</option>
                    <option>Tank</option>
                    <option>Equipment</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Criticality</label>
                  <select value={newAsset.criticality} onChange={e => setNewAsset({...newAsset, criticality: e.target.value})}>
                    <option>Critical</option>
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Location / Zone</label>
                  <input type="text" placeholder="e.g. Unit A" value={newAsset.location}
                    onChange={e => setNewAsset({...newAsset, location: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Health Score</label>
                  <input type="number" min="0" max="100" value={newAsset.health_score}
                    onChange={e => setNewAsset({...newAsset, health_score: parseInt(e.target.value) || 85})} />
                </div>
              </div>
              {assets.length > 0 && (
                <div className="form-group">
                  <label>Connect to (Process Flow Lines)</label>
                  <div className="connections-picker">
                    {assets.map(a => (
                      <label key={a.id} className={`connection-chip ${selectedConnections.includes(a.id) ? 'active' : ''}`}>
                        <input type="checkbox" checked={selectedConnections.includes(a.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedConnections([...selectedConnections, a.id]);
                            } else {
                              setSelectedConnections(selectedConnections.filter(c => c !== a.id));
                            }
                          }} />
                        <span className="chip-dot" style={{ background: getHealthColor(a.health_score) }} />
                        {a.id}
                      </label>
                    ))}
                  </div>
                </div>
              )}
              <button type="submit" className="ip-btn ip-btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                <Plus size={18} /> Add to Plant Map
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
