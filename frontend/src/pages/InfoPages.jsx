import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Lock, 
  FileText, 
  Activity, 
  CheckCircle2, 
  ArrowLeft, 
  Sun, 
  Moon, 
  Server, 
  Cpu, 
  Radio, 
  Clock, 
  Globe, 
  KeyRound,
  FileCheck
} from 'lucide-react';
import '../styles/Landing.css';

function InfoLayout({ title, subtitle, icon: Icon, badge, children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('ip-theme') || 
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });

  useEffect(() => {
    localStorage.setItem('ip-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="ip-landing" data-theme={theme}>
      {/* Top Header */}
      <nav className="lp-nav" style={{ position: 'relative', zIndex: 10 }}>
        <div className="lp-container lp-nav-inner w-full">
          <Link to="/" className="lp-nav-logo">
            <div className="lp-nav-mark">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 16V8h4a2 2 0 0 1 0 4H7" />
                <path d="M15 8v8" />
                <path d="M15 12h3a2 2 0 0 0 0-4h-3" />
              </svg>
            </div>
            <div className="lp-nav-wordmark">
              <span className="lp-nav-name">IntelliPlant</span>
              <span className="lp-nav-sub">The Registry</span>
            </div>
          </Link>

          <div className="lp-nav-actions">
            <button 
              className="lp-theme-toggle" 
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <Link to="/" className="lp-btn lp-btn-secondary">
              <ArrowLeft size={16} /> Back to Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content Container */}
      <main className="lp-container" style={{ padding: '3.5rem 1.5rem 5rem' }}>
        <div style={{ maxWidth: '840px', margin: '0 auto' }}>
          {/* Header Banner */}
          <div style={{
            background: 'var(--lp-surface)',
            border: '1px solid var(--lp-border-strong)',
            borderRadius: 'var(--lp-radius-lg)',
            padding: '2.5rem',
            marginBottom: '2rem',
            boxShadow: 'var(--lp-shadow-md)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: '12px',
                background: 'var(--lp-accent-soft)',
                border: '1px solid var(--lp-accent-border)',
                color: 'var(--lp-accent)',
                display: 'grid',
                placeItems: 'center'
              }}>
                <Icon size={22} />
              </div>
              <span style={{
                fontFamily: 'var(--lp-font-mono)',
                fontSize: '0.6875rem',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--lp-accent)',
                background: 'var(--lp-accent-soft)',
                border: '1px solid var(--lp-accent-border)',
                padding: '0.25rem 0.65rem',
                borderRadius: '999px'
              }}>
                {badge}
              </span>
            </div>

            <h1 className="lp-display" style={{ fontSize: '2.25rem', color: 'var(--lp-text)', marginBottom: '0.75rem' }}>
              {title}
            </h1>
            <p style={{ color: 'var(--lp-text-muted)', fontSize: '1.05rem', lineHeight: 1.6 }}>
              {subtitle}
            </p>
          </div>

          {/* Body Content Card */}
          <div style={{
            background: 'var(--lp-surface)',
            border: '1px solid var(--lp-border)',
            borderRadius: 'var(--lp-radius-lg)',
            padding: '2.5rem',
            boxShadow: 'var(--lp-shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem'
          }}>
            {children}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="lp-footer">
        <div className="lp-container lp-footer-inner">
          <div className="lp-footer-copy">
            &copy; {new Date().getFullYear()} IntelliPlant Inc. All rights reserved.
          </div>
          <div className="lp-footer-links">
            <Link to="/privacy" className="lp-footer-link">Privacy</Link>
            <Link to="/terms" className="lp-footer-link">Terms</Link>
            <Link to="/security" className="lp-footer-link">Security</Link>
            <Link to="/status" className="lp-footer-link">System Status</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function PrivacyPage() {
  return (
    <InfoLayout 
      title="Privacy Policy & Data Governance" 
      subtitle="How IntelliPlant protects, isolates, and governs your industrial telemetry, P&IDs, and equipment documentation."
      icon={Lock}
      badge="ISO 27001 & SOC 2 TYPE II"
    >
      <section style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--lp-text)' }}>1. Data Ownership & Customer Privacy</h2>
        <p style={{ color: 'var(--lp-text-muted)', lineHeight: 1.7 }}>
          At IntelliPlant, we adhere to strict industrial data governance. All P&ID diagrams, SCADA sensor telemetry streams, equipment manuals, and maintenance logs uploaded or integrated into IntelliPlant remain the sole property of your facility organization.
        </p>
      </section>

      <section style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--lp-text)' }}>2. Zero Foundation Model Training Guarantee</h2>
        <p style={{ color: 'var(--lp-text-muted)', lineHeight: 1.7 }}>
          Your facility data and document embeddings are never used to train public or foundational LLM models. All AI Copilot vector indices are strictly isolated in tenant-specific sandboxes with zero cross-tenant data leakage.
        </p>
      </section>

      <section style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--lp-text)' }}>3. Encryption at Rest & In-Transit</h2>
        <p style={{ color: 'var(--lp-text-muted)', lineHeight: 1.7 }}>
          All telemetry payloads are encrypted in transit using TLS 1.3 with AES-256 GCM encryption at rest. Cryptographic keys are rotated automatically every 90 days or managed via enterprise AWS KMS / Azure Key Vault integrations.
        </p>
      </section>

      <section style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--lp-text)' }}>4. Telemetry Retention & Purge Rights</h2>
        <p style={{ color: 'var(--lp-text-muted)', lineHeight: 1.7 }}>
          Facility administrators can configure automated data retention lifecycles (e.g., 30-day, 90-day, or 7-year audit retention). Upon request or contract termination, all vector indices and stored SCADA logs are cryptographically erased within 7 business days.
        </p>
      </section>
    </InfoLayout>
  );
}

export function TermsPage() {
  return (
    <InfoLayout 
      title="Terms of Service" 
      subtitle="The operational terms and service level agreements governing your facility's use of IntelliPlant."
      icon={FileCheck}
      badge="INDUSTRIAL SLA 99.99%"
    >
      <section style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--lp-text)' }}>1. Platform License & Access Scope</h2>
        <p style={{ color: 'var(--lp-text-muted)', lineHeight: 1.7 }}>
          Subject to subscription terms, IntelliPlant grants your enterprise a non-exclusive, non-transferable license to access the IntelliPlant Knowledge Intelligence Platform, Digital Twin engine, and AI Copilot services for industrial facility operations.
        </p>
      </section>

      <section style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--lp-text)' }}>2. 99.99% Operational Uptime SLA</h2>
        <p style={{ color: 'var(--lp-text-muted)', lineHeight: 1.7 }}>
          IntelliPlant guarantees a 99.99% annual uptime service level agreement (SLA) for real-time telemetry processing and SCADA Modbus-TCP gateway connections. Service credits apply for any unplanned downtime exceeding 4.38 minutes per month.
        </p>
      </section>

      <section style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--lp-text)' }}>3. Responsible Human-in-the-Loop Operations</h2>
        <p style={{ color: 'var(--lp-text-muted)', lineHeight: 1.7 }}>
          While AI Copilot insights provide verified citations from OEM equipment manuals, plant operators and certified safety engineers remain responsible for performing physical equipment maintenance, lockout/tagout procedures, and override decisions.
        </p>
      </section>
    </InfoLayout>
  );
}

export function SecurityPage() {
  return (
    <InfoLayout 
      title="Enterprise Security Architecture" 
      subtitle="Defending critical infrastructure with Zero-Trust architecture, Air-Gapped deployment, and SCADA gateway isolation."
      icon={ShieldCheck}
      badge="ZERO TRUST ARCHITECTURE"
    >
      <section style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--lp-text)' }}>1. On-Premise & Air-Gapped Deployments</h2>
        <p style={{ color: 'var(--lp-text-muted)', lineHeight: 1.7 }}>
          For nuclear, chemical, and high-security refineries, IntelliPlant supports full on-premise Kubernetes deployments (K3s/OpenShift) operating in zero-egress, air-gapped network environments without external internet connectivity.
        </p>
      </section>

      <section style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--lp-text)' }}>2. SCADA / OT Network Isolation</h2>
        <p style={{ color: 'var(--lp-text-muted)', lineHeight: 1.7 }}>
          SCADA, OPC-UA, and Modbus-TCP telemetry gateways utilize read-only unidirectional data diodes (Purdue Model Level 3 to Level 4 bridging), ensuring no control commands can be written back into OT programmable logic controllers (PLCs).
        </p>
      </section>

      <section style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--lp-text)' }}>3. Continuous Vulnerability Management</h2>
        <p style={{ color: 'var(--lp-text-muted)', lineHeight: 1.7 }}>
          IntelliPlant undergoes quarterly third-party penetration testing by certified CREST/SANS security auditors. Automated static code analysis (SAST) and container vulnerability scanning run on every build commit.
        </p>
      </section>
    </InfoLayout>
  );
}

export function StatusPage() {
  const [systems] = useState([
    { name: 'Telemetry Ingestion Gateway', status: 'Operational', uptime: '100%', latency: '24ms' },
    { name: 'AI Copilot RAG Indexer', status: 'Operational', uptime: '99.99%', latency: '140ms' },
    { name: 'SCADA Modbus-TCP Connectors', status: 'Operational', uptime: '100%', latency: '12ms' },
    { name: 'Digital Twin Rendering Engine', status: 'Operational', uptime: '100%', latency: '18ms' },
    { name: 'ISO 55000 Compliance Guard', status: 'Operational', uptime: '100%', latency: '35ms' },
  ]);

  return (
    <InfoLayout 
      title="Real-Time System Operational Status" 
      subtitle="Live global telemetry status and infrastructure health across all active plant facilities."
      icon={Activity}
      badge="ALL SYSTEMS NORMAL"
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem 1.25rem',
        borderRadius: '10px',
        background: 'var(--lp-accent-soft)',
        border: '1px solid var(--lp-accent-border)',
        color: 'var(--lp-accent)',
        fontWeight: 600,
        fontSize: '0.9rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'currentColor', boxShadow: '0 0 10px currentColor' }}></span>
          All Systems Operational & Synced
        </div>
        <span style={{ fontFamily: 'var(--lp-font-mono)', fontSize: '0.75rem' }}>Updated 1 min ago</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--lp-text)' }}>Core Infrastructure Nodes</h2>
        
        {systems.map((sys, idx) => (
          <div key={idx} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.875rem 1.125rem',
            borderRadius: '8px',
            background: 'var(--lp-inset)',
            border: '1px solid var(--lp-border)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <CheckCircle2 size={16} style={{ color: 'var(--lp-accent)' }} />
              <span style={{ fontWeight: 550, color: 'var(--lp-text)', fontSize: '0.9rem' }}>{sys.name}</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <span style={{ fontFamily: 'var(--lp-font-mono)', fontSize: '0.75rem', color: 'var(--lp-text-muted)' }}>Latency: {sys.latency}</span>
              <span style={{ fontFamily: 'var(--lp-font-mono)', fontSize: '0.75rem', color: 'var(--lp-accent)', fontWeight: 600 }}>{sys.uptime}</span>
              <span style={{
                fontSize: '0.65rem',
                fontFamily: 'var(--lp-font-mono)',
                fontWeight: 700,
                color: 'var(--lp-accent)',
                background: 'var(--lp-accent-soft)',
                padding: '0.15rem 0.5rem',
                borderRadius: '4px'
              }}>
                OPERATIONAL
              </span>
            </div>
          </div>
        ))}
      </div>
    </InfoLayout>
  );
}
