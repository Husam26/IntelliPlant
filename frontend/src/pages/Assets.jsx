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
    if (score >= 80) return 'var(--ip-accent)';
    if (score >= 60) return 'var(--ip-warning)';
    return 'var(--ip-danger)';
  }

  function getSeverityBadge(severity) {
    const cls = severity?.toLowerCase() || 'info';
    if (cls === 'high' || cls === 'critical') return 'ip-badge ip-badge-danger';
    if (cls === 'medium') return 'ip-badge ip-badge-warning';
    if (cls === 'low') return 'ip-badge ip-badge-good';
    return `ip-badge ip-badge-info`;
  }

  if (loading) {
    return <div className="page-content flex-row" style={{ justifyContent: 'center' }}><div className="spinner spinner-lg" style={{ color: 'var(--ip-accent)', margin: '48px auto' }} /></div>;
  }

  return (
    <div className="page-content">
      <div style={{ display: 'grid', gridTemplateColumns: selectedAsset ? '1fr 1fr' : '1fr', gap: '1.5rem' }}>
        {/* Asset List */}
        <div>
          <div className="section-title" style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--ip-border)', paddingBottom: '0.75rem' }}>
            <h2 style={{ fontFamily: 'var(--ip-font-display)', fontSize: '1.25rem', color: 'var(--ip-text)' }}>Equipment Inventory ({assets.length})</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {assets.map((asset, i) => (
              <div
                key={asset.id}
                className="ip-card ip-card-link"
                style={{
                  padding: '1.25rem',
                  animation: `ip-fade-in 0.3s var(--ip-ease) ${i * 0.05}s both`,
                  borderColor: selectedAsset?.id === asset.id ? 'var(--ip-accent)' : undefined,
                  background: selectedAsset?.id === asset.id ? 'var(--ip-accent-soft)' : undefined,
                }}
                onClick={() => selectAsset(asset)}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: 44, height: 44,
                      borderRadius: 'var(--ip-radius-sm)',
                      background: 'var(--ip-info-soft)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--ip-info)',
                      border: '1px solid var(--ip-info-border)'
                    }}>
                      <Cog size={22} />
                    </div>
                    <div>
                      <div style={{ fontFamily: 'var(--ip-font-mono)', fontWeight: 600, color: 'var(--ip-text)', fontSize: '0.9rem' }}>
                        {asset.id}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--ip-text-muted)' }}>{asset.name}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'var(--ip-font-mono)', fontSize: '1.5rem', fontWeight: 600, color: getHealthColor(asset.health_score) }}>
                      {asset.health_score}%
                    </div>
                    <span className={getSeverityBadge(asset.criticality)}>{asset.criticality}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', fontSize: '0.8125rem', color: 'var(--ip-text-faint)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={14} /> {asset.location}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Cog size={14} /> {asset.type}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><AlertTriangle size={14} /> {asset.incident_count} incidents</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Asset Details Sidebar */}
        {selectedAsset && (
          <div className="ip-panel" style={{ padding: '1.5rem', height: 'fit-content', position: 'sticky', top: '100px', animation: 'ip-fade-in 0.3s var(--ip-ease)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--ip-font-display)', fontSize: '1.5rem', color: 'var(--ip-text)' }}>{selectedAsset.id}</h3>
                <p style={{ color: 'var(--ip-text-muted)' }}>{selectedAsset.name}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.6875rem', textTransform: 'uppercase', color: 'var(--ip-text-faint)', letterSpacing: '0.08em', fontFamily: 'var(--ip-font-mono)' }}>Health Score</div>
                <div style={{ fontFamily: 'var(--ip-font-mono)', fontSize: '2rem', fontWeight: 600, color: getHealthColor(selectedAsset.health_score), lineHeight: 1 }}>
                  {selectedAsset.health_score}%
                </div>
              </div>
            </div>

            <div className="ip-inset" style={{ padding: '1rem', marginBottom: '1.5rem' }}>
              <h4 style={{ fontFamily: 'var(--ip-font-mono)', fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ip-text-faint)', marginBottom: '0.75rem' }}>Details</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.875rem' }}>
                <div>
                  <div style={{ color: 'var(--ip-text-muted)' }}>Location</div>
                  <div style={{ color: 'var(--ip-text)', fontWeight: 500 }}>{selectedAsset.location}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--ip-text-muted)' }}>Type</div>
                  <div style={{ color: 'var(--ip-text)', fontWeight: 500 }}>{selectedAsset.type}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--ip-text-muted)' }}>Manufacturer</div>
                  <div style={{ color: 'var(--ip-text)', fontWeight: 500 }}>{selectedAsset.manufacturer || 'Unknown'}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--ip-text-muted)' }}>Install Date</div>
                  <div style={{ color: 'var(--ip-text)', fontWeight: 500 }}>{selectedAsset.installation_date ? new Date(selectedAsset.installation_date).toLocaleDateString() : '—'}</div>
                </div>
              </div>
            </div>

            <h4 style={{ fontFamily: 'var(--ip-font-display)', fontSize: '1.125rem', color: 'var(--ip-text)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Activity size={18} /> Recent Incidents
            </h4>
            
            {incidents.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--ip-text-muted)', background: 'var(--ip-inset)', borderRadius: 'var(--ip-radius-sm)', border: '1px solid var(--ip-border)' }}>
                No incidents reported for this asset.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {incidents.map(inc => (
                  <div key={inc.id} className="ip-inset" style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontWeight: 600, color: 'var(--ip-text)', fontSize: '0.875rem' }}>{inc.title}</span>
                      <span className={getSeverityBadge(inc.severity)}>{inc.severity}</span>
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--ip-text-muted)', marginBottom: 8 }}>{inc.description}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--ip-text-faint)', fontFamily: 'var(--ip-font-mono)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={12} /> {new Date(inc.date).toLocaleDateString()}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><AlertTriangle size={12} /> {inc.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
