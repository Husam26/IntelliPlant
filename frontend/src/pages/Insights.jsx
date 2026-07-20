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

  if (loading) {
    return <div className="page-content"><div className="spinner spinner-lg" style={{ margin: '48px auto' }} /></div>;
  }

  return (
    <div className="page-content">
      {/* Patterns Section */}
      <div className="section-title">
        <h2><Repeat size={20} style={{ marginRight: 8, verticalAlign: 'middle' }} /> Recurring Failure Patterns</h2>
      </div>

      {patterns.length === 0 ? (
        <div className="card" style={{ marginBottom: 'var(--space-xl)' }}>
          <div className="empty-state">
            <TrendingUp size={48} />
            <h3>No Patterns Detected Yet</h3>
            <p>Upload more documents to enable pattern detection.</p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
          {patterns.map((pattern, i) => (
            <div key={i} className="card animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
              <div style={{ display: 'flex', alignItems: 'start', gap: 'var(--space-md)' }}>
                <div style={{
                  width: 44, height: 44,
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(245, 158, 11, 0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--accent-secondary)', flexShrink: 0
                }}>
                  <AlertTriangle size={22} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-sm)' }}>
                    <div>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-primary)', marginRight: 8 }}>
                        {pattern.asset_id}
                      </span>
                      <span style={{ fontWeight: 600 }}>{pattern.asset_name}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                      <span className={`badge badge-${pattern.severity?.toLowerCase()}`}>{pattern.severity}</span>
                      <span className="badge badge-warning">{pattern.occurrence_count}x occurrences</span>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-sm)' }}>
                    {pattern.description}
                  </div>
                  <div style={{
                    display: 'flex', alignItems: 'start', gap: 'var(--space-sm)',
                    padding: 'var(--space-md)',
                    background: 'rgba(16, 185, 129, 0.05)',
                    border: '1px solid rgba(16, 185, 129, 0.15)',
                    borderRadius: 'var(--radius-md)',
                  }}>
                    <Lightbulb size={16} style={{ color: 'var(--accent-success)', flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontSize: '0.85rem', color: 'var(--accent-success)' }}>
                      <strong>Recommendation:</strong> {pattern.recommendation}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Risk Heatmap */}
      <div className="section-title">
        <h2><TrendingUp size={20} style={{ marginRight: 8, verticalAlign: 'middle' }} /> Risk Heatmap</h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-md)' }}>
        {riskScores.map((item, i) => {
          const riskColor = item.risk_score >= 80 ? 'var(--accent-danger)' :
                           item.risk_score >= 50 ? 'var(--accent-secondary)' :
                           item.risk_score >= 25 ? 'var(--accent-primary)' : 'var(--accent-success)';
          return (
            <div key={item.asset_id} className="card animate-fade-in" style={{
              animationDelay: `${i * 0.05}s`,
              borderColor: `${riskColor}33`,
              textAlign: 'center',
            }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-primary)', fontSize: '0.9rem' }}>
                {item.asset_id}
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: riskColor, margin: 'var(--space-sm) 0' }}>
                {item.risk_score}
              </div>
              <span className={`badge badge-${item.risk_level?.toLowerCase()}`}>{item.risk_level}</span>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 'var(--space-sm)' }}>
                {item.incident_count} incidents · {item.overdue_compliance} overdue
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
