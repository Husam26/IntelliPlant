/**
 * Compliance Page — Compliance tracking and gap analysis.
 */

import { useState, useEffect } from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { analyticsAPI } from '../services/api';

export default function Compliance() {
  const [compliance, setCompliance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCompliance();
  }, []);

  async function loadCompliance() {
    try {
      const res = await analyticsAPI.getCompliance();
      setCompliance(res.data);
    } catch (err) {
      console.error('Failed to load compliance:', err);
    } finally {
      setLoading(false);
    }
  }

  function getStatusIcon(status) {
    switch (status) {
      case 'Compliant': return <CheckCircle2 size={16} style={{ color: 'var(--accent-success)' }} />;
      case 'Non-Compliant': return <XCircle size={16} style={{ color: 'var(--accent-danger)' }} />;
      case 'Overdue': return <AlertTriangle size={16} style={{ color: 'var(--accent-danger)' }} />;
      case 'Due Soon': return <Clock size={16} style={{ color: 'var(--accent-secondary)' }} />;
      default: return null;
    }
  }

  function getStatusBadge(status) {
    const map = {
      'Compliant': 'success', 'Non-Compliant': 'danger',
      'Overdue': 'danger', 'Due Soon': 'warning'
    };
    return `badge badge-${map[status] || 'info'}`;
  }

  if (loading) {
    return <div className="page-content"><div className="spinner spinner-lg" style={{ margin: '48px auto' }} /></div>;
  }

  return (
    <div className="page-content">
      {/* Summary Cards */}
      <div className="stats-grid" style={{ marginBottom: 'var(--space-xl)' }}>
        <div className="stat-card stagger-1">
          <div className="stat-icon green"><ShieldCheck size={24} /></div>
          <div className="stat-info">
            <div className="stat-label">Compliance Rate</div>
            <div className="stat-value">{compliance?.compliance_rate || 0}%</div>
          </div>
        </div>
        <div className="stat-card stagger-2">
          <div className="stat-icon blue"><CheckCircle2 size={24} /></div>
          <div className="stat-info">
            <div className="stat-label">Compliant</div>
            <div className="stat-value">{compliance?.compliant || 0}</div>
          </div>
        </div>
        <div className="stat-card stagger-3">
          <div className="stat-icon red"><XCircle size={24} /></div>
          <div className="stat-info">
            <div className="stat-label">Non-Compliant</div>
            <div className="stat-value">{compliance?.non_compliant || 0}</div>
          </div>
        </div>
        <div className="stat-card stagger-4">
          <div className="stat-icon amber"><AlertTriangle size={24} /></div>
          <div className="stat-info">
            <div className="stat-label">Total Checks</div>
            <div className="stat-value">{compliance?.total || 0}</div>
          </div>
        </div>
      </div>

      {/* Compliance Table */}
      <div className="card">
        <h2 style={{ marginBottom: 'var(--space-lg)' }}>
          <ShieldCheck size={20} style={{ marginRight: 8, verticalAlign: 'middle' }} />
          Compliance Records
        </h2>
        <table className="doc-table">
          <thead>
            <tr>
              <th>Asset</th>
              <th>Requirement</th>
              <th>SOP Ref</th>
              <th>Status</th>
              <th>Risk</th>
              <th>Last Checked</th>
              <th>Next Due</th>
            </tr>
          </thead>
          <tbody>
            {compliance?.records?.map((rec) => (
              <tr key={rec.id}>
                <td>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--accent-primary)' }}>
                    {rec.asset_id}
                  </span>
                </td>
                <td style={{ maxWidth: 300 }}>{rec.requirement}</td>
                <td><span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{rec.sop_reference}</span></td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {getStatusIcon(rec.status)}
                    <span className={getStatusBadge(rec.status)}>{rec.status}</span>
                  </div>
                </td>
                <td><span className={`badge badge-${rec.risk_level?.toLowerCase()}`}>{rec.risk_level}</span></td>
                <td style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{rec.last_checked || '—'}</td>
                <td style={{ fontSize: '0.8rem', color: rec.status === 'Overdue' ? 'var(--accent-danger)' : 'var(--text-tertiary)', fontWeight: rec.status === 'Overdue' ? 600 : 400 }}>
                  {rec.next_due || '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
