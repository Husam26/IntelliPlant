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
      case 'Compliant': return <CheckCircle2 size={16} style={{ color: 'var(--ip-accent)' }} />;
      case 'Non-Compliant': return <XCircle size={16} style={{ color: 'var(--ip-danger)' }} />;
      case 'Overdue': return <AlertTriangle size={16} style={{ color: 'var(--ip-danger)' }} />;
      case 'Due Soon': return <Clock size={16} style={{ color: 'var(--ip-warning)' }} />;
      default: return null;
    }
  }

  function getStatusBadge(status) {
    const map = {
      'Compliant': 'good', 'Non-Compliant': 'danger',
      'Overdue': 'danger', 'Due Soon': 'warning'
    };
    const c = map[status] || 'info';
    return `ip-badge ip-badge-${c}`;
  }

  if (loading) {
    return <div className="page-content flex-row" style={{ justifyContent: 'center' }}><div className="spinner spinner-lg" style={{ margin: '48px auto', color: 'var(--ip-accent)' }} /></div>;
  }

  return (
    <div className="page-content">
      {/* Summary Cards */}
      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        <div className="ip-panel stat-card stagger-1">
          <div className="stat-icon green"><ShieldCheck size={24} /></div>
          <div className="stat-info">
            <div className="stat-label">Compliance Rate</div>
            <div className="stat-value">{compliance?.compliance_rate || 0}%</div>
          </div>
        </div>
        <div className="ip-panel stat-card stagger-2">
          <div className="stat-icon blue"><CheckCircle2 size={24} /></div>
          <div className="stat-info">
            <div className="stat-label">Compliant</div>
            <div className="stat-value">{compliance?.compliant || 0}</div>
          </div>
        </div>
        <div className="ip-panel stat-card stagger-3">
          <div className="stat-icon red"><XCircle size={24} /></div>
          <div className="stat-info">
            <div className="stat-label">Non-Compliant</div>
            <div className="stat-value">{compliance?.non_compliant || 0}</div>
          </div>
        </div>
        <div className="ip-panel stat-card stagger-4">
          <div className="stat-icon amber"><AlertTriangle size={24} /></div>
          <div className="stat-info">
            <div className="stat-label">Total Checks</div>
            <div className="stat-value">{compliance?.total || 0}</div>
          </div>
        </div>
      </div>

      {/* Compliance Table */}
      <div className="ip-panel p-4">
        <h2 style={{ marginBottom: '1.5rem', fontFamily: 'var(--ip-font-display)', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: 8 }}>
          <ShieldCheck size={20} />
          Compliance Records
        </h2>
        <table className="ip-table">
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
            {compliance?.records?.map((record, i) => (
              <tr key={i} className="animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                <td>
                  <span className="ip-mono" style={{ color: 'var(--ip-text)', fontWeight: 600 }}>{record.asset_id}</span>
                </td>
                <td>{record.requirement}</td>
                <td><span className="ip-mono" style={{ color: 'var(--ip-text-muted)' }}>{record.sop_reference}</span></td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {getStatusIcon(record.status)}
                    <span className={getStatusBadge(record.status)}>{record.status}</span>
                  </div>
                </td>
                <td>
                  <span className={`ip-badge ip-badge-${record.risk_level?.toLowerCase() === 'high' ? 'danger' : record.risk_level?.toLowerCase() === 'medium' ? 'warning' : 'good'}`}>
                    {record.risk_level}
                  </span>
                </td>
                <td style={{ color: 'var(--ip-text-muted)', fontSize: '0.8125rem' }}>{record.last_checked ? new Date(record.last_checked).toLocaleDateString() : '—'}</td>
                <td style={{ color: 'var(--ip-text)', fontWeight: 500, fontSize: '0.8125rem' }}>{record.next_due ? new Date(record.next_due).toLocaleDateString() : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
