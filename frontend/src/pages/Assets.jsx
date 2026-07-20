/**
 * Assets Page — View all industrial equipment with health scores.
 */

import { useState, useEffect } from 'react';
import { Cog, MapPin, Calendar, AlertTriangle, Activity } from 'lucide-react';
import { assetAPI } from '../services/api';

export default function Assets() {
  const [assets, setAssets] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadAssets(); }, []);

  async function loadAssets() {
    try {
      const res = await assetAPI.list();
      setAssets(res.data.assets);
    } catch (err) {
      console.error('Failed to load assets:', err);
    } finally {
      setLoading(false);
    }
  }

  async function selectAsset(asset) {
    setSelectedAsset(asset);
    try {
      const res = await assetAPI.getIncidents(asset.id);
      setIncidents(res.data.incidents);
    } catch (err) {
      setIncidents([]);
    }
  }

  function getHealthColor(score) {
    if (score >= 80) return 'var(--accent-success)';
    if (score >= 60) return 'var(--accent-secondary)';
    return 'var(--accent-danger)';
  }

  if (loading) {
    return <div className="page-content"><div className="spinner spinner-lg" style={{ margin: '48px auto' }} /></div>;
  }

  return (
    <div className="page-content">
      <div style={{ display: 'grid', gridTemplateColumns: selectedAsset ? '1fr 1fr' : '1fr', gap: 'var(--space-lg)' }}>
        {/* Asset List */}
        <div>
          <div className="section-title" style={{ marginBottom: 'var(--space-lg)' }}>
            <h2>Equipment Inventory ({assets.length})</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            {assets.map((asset, i) => (
              <div
                key={asset.id}
                className="card animate-fade-in"
                style={{
                  cursor: 'pointer',
                  animationDelay: `${i * 0.05}s`,
                  border: selectedAsset?.id === asset.id ? '1px solid var(--accent-primary)' : undefined,
                  background: selectedAsset?.id === asset.id ? 'rgba(59, 130, 246, 0.05)' : undefined,
                }}
                onClick={() => selectAsset(asset)}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                    <div style={{
                      width: 44, height: 44,
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(59, 130, 246, 0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--accent-primary)'
                    }}>
                      <Cog size={22} />
                    </div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-primary)', fontSize: '0.9rem' }}>
                        {asset.id}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{asset.name}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 700, color: getHealthColor(asset.health_score) }}>
                      {asset.health_score}%
                    </div>
                    <span className={`badge badge-${asset.criticality?.toLowerCase()}`}>{asset.criticality}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-lg)', marginTop: 'var(--space-md)', fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={14} /> {asset.location}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Cog size={14} /> {asset.type}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><AlertTriangle size={14} /> {asset.incident_count} incidents</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Asset Detail Panel */}
        {selectedAsset && (
          <div className="animate-slide-in">
            <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
              <h2 style={{ marginBottom: 'var(--space-lg)' }}>
                <Activity size={20} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                {selectedAsset.id} — Details
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
                {[
                  ['Type', selectedAsset.type],
                  ['Location', selectedAsset.location],
                  ['Status', selectedAsset.status],
                  ['Criticality', selectedAsset.criticality],
                  ['Manufacturer', selectedAsset.manufacturer || '—'],
                  ['Install Date', selectedAsset.install_date || '—'],
                  ['Last Maintenance', selectedAsset.last_maintenance || '—'],
                  ['Next Scheduled', selectedAsset.next_scheduled || '—'],
                ].map(([label, value]) => (
                  <div key={label} style={{ padding: 'var(--space-sm) 0', borderBottom: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 500, marginTop: 2 }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Incident History */}
            <div className="card">
              <h3 style={{ marginBottom: 'var(--space-md)' }}>Incident History ({incidents.length})</h3>
              {incidents.length === 0 ? (
                <div className="empty-state" style={{ padding: 'var(--space-lg)' }}>
                  <p>No incidents recorded for this asset.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                  {incidents.map((inc) => (
                    <div key={inc.id} style={{
                      padding: 'var(--space-md)',
                      background: 'var(--bg-tertiary)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{inc.title}</div>
                        <span className={`badge badge-${inc.severity?.toLowerCase()}`}>{inc.severity}</span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                        {inc.description?.substring(0, 120)}...
                      </div>
                      <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-sm)', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                        <span><Calendar size={12} /> {inc.incident_date}</span>
                        <span>⏱ {inc.downtime_hours}h downtime</span>
                        <span className={`badge badge-${inc.status === 'Closed' ? 'success' : inc.status === 'Open' ? 'danger' : 'warning'}`} style={{ fontSize: '0.65rem' }}>
                          {inc.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
