/**
 * Insights Page — Pattern detection & recurring failure analysis.
 */

import { useState, useEffect } from 'react';
import { TrendingUp, AlertTriangle, Repeat, Lightbulb } from 'lucide-react';
import { analyticsAPI } from '../services/api';

export default function Insights() {
  const [patterns, setPatterns] = useState([]);
  const [riskScores, setRiskScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInsights();
  }, []);

  async function loadInsights() {
    try {
      const [patternsRes, riskRes] = await Promise.all([
        analyticsAPI.getPatterns(),
        analyticsAPI.getRiskScores(),
      ]);
      setPatterns(patternsRes.data.patterns);
      setRiskScores(riskRes.data.risk_scores);
    } catch (err) {
      console.error('Failed to load insights:', err);
    } finally {
      setLoading(false);
    }
  }

  function getSeverityBadge(severity) {
    const cls = severity?.toLowerCase() || 'info';
    if (cls === 'high' || cls === 'critical') return 'ip-badge ip-badge-danger';
    if (cls === 'medium') return 'ip-badge ip-badge-warning';
    if (cls === 'low') return 'ip-badge ip-badge-good';
    return `ip-badge ip-badge-info`;
  }

  if (loading) {
    return <div className="page-content flex-row" style={{ justifyContent: 'center' }}><div className="spinner spinner-lg" style={{ margin: '48px auto', color: 'var(--ip-accent)' }} /></div>;
  }

  return (
    <div className="page-content">
      {/* Patterns Section */}
      <div className="section-title" style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--ip-border)', paddingBottom: '0.75rem' }}>
        <h2 style={{ fontFamily: 'var(--ip-font-display)', fontSize: '1.25rem', color: 'var(--ip-text)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Repeat size={20} /> Recurring Failure Patterns
        </h2>
      </div>

      {patterns.length === 0 ? (
        <div className="ip-panel" style={{ marginBottom: '2rem' }}>
          <div className="empty-state" style={{ textAlign: 'center', padding: '4rem', color: 'var(--ip-text-muted)' }}>
            <TrendingUp size={48} style={{ marginBottom: '1rem', color: 'var(--ip-text-faint)' }} />
            <h3 style={{ fontFamily: 'var(--ip-font-display)', fontSize: '1.25rem', color: 'var(--ip-text)' }}>No Patterns Detected Yet</h3>
            <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>Upload more documents to enable pattern detection.</p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
          {patterns.map((pattern, i) => (
            <div key={i} className="ip-panel animate-fade-in" style={{ padding: '1.5rem', animationDelay: `${i * 0.1}s` }}>
              <div style={{ display: 'flex', alignItems: 'start', gap: '1rem' }}>
                <div style={{
                  width: 44, height: 44,
                  borderRadius: 'var(--ip-radius-sm)',
                  background: 'var(--ip-warning-soft)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--ip-warning)', flexShrink: 0,
                  border: '1px solid var(--ip-warning-border)'
                }}>
                  <AlertTriangle size={22} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <div>
                      <span style={{ fontFamily: 'var(--ip-font-mono)', fontWeight: 600, color: 'var(--ip-text)', marginRight: 8 }}>
                        {pattern.asset_id}
                      </span>
                      <span style={{ fontWeight: 500, color: 'var(--ip-text-muted)' }}>{pattern.asset_name}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <span className={getSeverityBadge(pattern.severity)}>{pattern.severity}</span>
                      <span className="ip-badge ip-badge-warning">{pattern.occurrence_count}x occurrences</span>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--ip-text-muted)', marginBottom: '0.75rem' }}>
                    {pattern.description}
                  </div>
                  <div style={{
                    display: 'flex', alignItems: 'start', gap: '0.5rem',
                    padding: '1rem',
                    background: 'var(--ip-accent-soft)',
                    border: '1px solid var(--ip-accent-border)',
                    borderRadius: 'var(--ip-radius-sm)',
                  }}>
                    <Lightbulb size={16} style={{ color: 'var(--ip-accent)', flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontSize: '0.8125rem', color: 'var(--ip-accent)' }}>
                      <strong style={{ fontWeight: 600 }}>Recommendation:</strong> {pattern.recommendation}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Predictive Risk Section */}
      <div className="section-title" style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--ip-border)', paddingBottom: '0.75rem', marginTop: '2rem' }}>
        <h2 style={{ fontFamily: 'var(--ip-font-display)', fontSize: '1.25rem', color: 'var(--ip-text)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <TrendingUp size={20} /> Predictive Risk Analysis
        </h2>
      </div>

      <div className="ip-panel p-4">
        <table className="ip-table">
          <thead>
            <tr>
              <th>Asset</th>
              <th>Risk Score</th>
              <th>Risk Level</th>
              <th>Primary Risk Factor</th>
            </tr>
          </thead>
          <tbody>
            {riskScores.map((item, i) => (
              <tr key={i}>
                <td>
                  <span className="ip-mono" style={{ color: 'var(--ip-text)', fontWeight: 600 }}>{item.asset_id}</span>
                  <span style={{ marginLeft: 8, color: 'var(--ip-text-muted)', fontSize: '0.85rem' }}>{item.asset_name}</span>
                </td>
                <td><span className="ip-mono" style={{ fontWeight: 700 }}>{item.risk_score}</span></td>
                <td><span className={getSeverityBadge(item.risk_level)}>{item.risk_level}</span></td>
                <td style={{ color: 'var(--ip-text-muted)', fontSize: '0.875rem' }}>{item.primary_risk_factor || 'N/A'}</td>
              </tr>
            ))}
            {riskScores.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', color: 'var(--ip-text-muted)', padding: '2rem' }}>
                  No risk data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
