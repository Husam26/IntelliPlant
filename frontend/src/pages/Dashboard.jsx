/**
 * Dashboard Page — The main overview page showing key metrics.
 * 
 * Displays:
 * 1. Stat cards (documents, assets, incidents, compliance rate)
 * 2. Asset health overview (mini cards with health bars)
 * 3. Recent incident timeline
 * 4. Risk scores summary
 */

import { useState, useEffect } from 'react';
import {
  FileStack, Cog, AlertTriangle, ShieldCheck,
  Activity, TrendingUp, Clock, Zap
} from 'lucide-react';
import { analyticsAPI, assetAPI } from '../services/api';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const [overview, setOverview] = useState(null);
  const [assets, setAssets] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [riskScores, setRiskScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const [overviewRes, assetsRes, timelineRes, riskRes] = await Promise.all([
        analyticsAPI.getOverview(),
        assetAPI.list(),
        analyticsAPI.getTimeline(),
        analyticsAPI.getRiskScores(),
      ]);
      setOverview(overviewRes.data);
      setAssets(assetsRes.data.assets);
      setTimeline(timelineRes.data.timeline);
      setRiskScores(riskRes.data.risk_scores);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  }

  function getHealthClass(score) {
    if (score >= 80) return 'good';
    if (score >= 60) return 'warning';
    return 'danger';
  }

  function getSeverityBadge(severity) {
    const cls = severity?.toLowerCase() || 'low';
    return `badge badge-${cls}`;
  }

  if (loading) {
    return (
      <div className="page-content">
        <div className="stats-grid">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="skeleton" style={{ height: '100px', borderRadius: '16px' }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      {/* Stat Cards */}
      <div className="stats-grid">
        <div className="stat-card stagger-1">
          <div className="stat-icon blue"><FileStack size={24} /></div>
          <div className="stat-info">
            <div className="stat-label">Total Documents</div>
            <div className="stat-value">{overview?.total_documents || 0}</div>
            <div className="stat-change positive">{overview?.documents_processed || 0} processed</div>
          </div>
        </div>

        <div className="stat-card stagger-2">
          <div className="stat-icon green"><Cog size={24} /></div>
          <div className="stat-info">
            <div className="stat-label">Assets Monitored</div>
            <div className="stat-value">{overview?.total_assets || 0}</div>
            <div className="stat-change positive">Avg Health: {overview?.avg_health_score || 0}%</div>
          </div>
        </div>

        <div className="stat-card stagger-3">
          <div className="stat-icon amber"><AlertTriangle size={24} /></div>
          <div className="stat-info">
            <div className="stat-label">Total Incidents</div>
            <div className="stat-value">{overview?.total_incidents || 0}</div>
            <div className="stat-change negative">{overview?.open_incidents || 0} open</div>
          </div>
        </div>

        <div className="stat-card stagger-4">
          <div className="stat-icon purple"><ShieldCheck size={24} /></div>
          <div className="stat-info">
            <div className="stat-label">Compliance Rate</div>
            <div className="stat-value">{overview?.compliance_rate || 0}%</div>
            <div className="stat-change negative">{overview?.critical_alerts || 0} alerts</div>
          </div>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="dashboard-grid">
        {/* Asset Health Overview */}
        <div className="card">
          <div className="section-title">
            <h2><Activity size={20} style={{ marginRight: 8, verticalAlign: 'middle' }} /> Asset Health</h2>
          </div>
          <div className="asset-grid">
            {assets.map((asset) => (
              <div key={asset.id} className="asset-card">
                <div className="asset-card-header">
                  <span className="asset-id">{asset.id}</span>
                  <span className={`badge badge-${asset.criticality?.toLowerCase()}`}>
                    {asset.criticality}
                  </span>
                </div>
                <div className="asset-name">{asset.name}</div>
                <div className="health-bar">
                  <div
                    className={`health-bar-fill ${getHealthClass(asset.health_score)}`}
                    style={{ width: `${asset.health_score}%` }}
                  />
                </div>
                <div className={`health-score`} style={{
                  color: asset.health_score >= 80 ? 'var(--accent-success)' :
                         asset.health_score >= 60 ? 'var(--accent-secondary)' : 'var(--accent-danger)'
                }}>
                  {asset.health_score}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Incidents Timeline */}
        <div className="card">
          <div className="section-title">
            <h2><Clock size={20} style={{ marginRight: 8, verticalAlign: 'middle' }} /> Recent Incidents</h2>
          </div>
          <div className="timeline">
            {timeline.slice(0, 5).map((item) => (
              <div key={item.id} className="timeline-item">
                <div className="timeline-date">
                  {item.date ? new Date(item.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : 'N/A'}
                </div>
                <div className="timeline-content">
                  <div className="timeline-title">{item.title}</div>
                  <div className="timeline-desc">{item.asset_name}</div>
                  <div className="timeline-meta">
                    <span className={getSeverityBadge(item.severity)}>{item.severity}</span>
                    <span className="badge badge-info">{item.category}</span>
                    {item.downtime_hours > 0 && (
                      <span className="badge badge-warning">{item.downtime_hours}h downtime</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Risk Scores */}
      <div className="card" style={{ marginTop: 'var(--space-lg)' }}>
        <div className="section-title">
          <h2><Zap size={20} style={{ marginRight: 8, verticalAlign: 'middle' }} /> Risk Assessment</h2>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="doc-table">
            <thead>
              <tr>
                <th>Asset</th>
                <th>Criticality</th>
                <th>Health</th>
                <th>Incidents</th>
                <th>Compliance Issues</th>
                <th>Risk Score</th>
                <th>Risk Level</th>
              </tr>
            </thead>
            <tbody>
              {riskScores.map((item) => (
                <tr key={item.asset_id}>
                  <td>
                    <span className="font-mono" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>
                      {item.asset_id}
                    </span>
                    <span style={{ marginLeft: 8, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      {item.asset_name}
                    </span>
                  </td>
                  <td><span className={`badge badge-${item.criticality?.toLowerCase()}`}>{item.criticality}</span></td>
                  <td>
                    <span style={{
                      color: item.health_score >= 80 ? 'var(--accent-success)' :
                             item.health_score >= 60 ? 'var(--accent-secondary)' : 'var(--accent-danger)',
                      fontWeight: 600
                    }}>
                      {item.health_score}%
                    </span>
                  </td>
                  <td>{item.incident_count}</td>
                  <td>{item.overdue_compliance}</td>
                  <td>
                    <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{item.risk_score}</span>
                  </td>
                  <td><span className={`badge badge-${item.risk_level?.toLowerCase()}`}>{item.risk_level}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
