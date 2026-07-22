import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Factory, 
  Moon, 
  Sun, 
  ArrowRight,
  ShieldCheck,
  Activity,
  Bot,
  FileStack,
  Zap,
  User,
  FileText,
  TrendingUp,
  CheckCircle2,
  Cpu,
  Radio,
  Sparkles
} from 'lucide-react';
import WhiteboardBioluminescent from '../components/WhiteboardBioluminescent';
import HeroMockup from '../components/HeroMockup';
import '../styles/Landing.css';

export default function Landing() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('ip-theme') || 
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });

  const [isTheming, setIsTheming] = useState(false);

  useEffect(() => {
    localStorage.setItem('ip-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setIsTheming(true);
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    setTimeout(() => setIsTheming(false), 450); 
  };

  return (
    <div className="ip-landing" data-theme={theme} data-theming={isTheming ? '' : undefined}>
      {/* Background layer */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <WhiteboardBioluminescent 
          colors={theme === 'dark' ? ['#0c7a5b', '#2fbe93', '#45cfa5'] : ['#e5f2ec', '#b3ddca', '#0c7a5b']} 
          autoIntensity={theme === 'dark' ? 1.5 : 0.8}
        />
      </div>
      
      {/* Navigation */}
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
          
          <div className="lp-nav-links">
            <a href="#platform" className="lp-nav-link">Platform</a>
            <a href="#copilot" className="lp-nav-link">AI Copilot</a>
            <a href="#compliance" className="lp-nav-link">Compliance</a>
          </div>

          <div className="lp-nav-actions">
            <button 
              className="lp-theme-toggle" 
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <Link to="/dashboard" className="lp-btn lp-btn-secondary">
              Sign In
            </Link>
            <Link to="/dashboard" className="lp-btn lp-btn-primary">
              Access Console
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="lp-hero">
        <div className="lp-container lp-hero-inner">
          <div className="lp-hero-content lp-animate">
            <div className="lp-hero-eyebrow lp-eyebrow">
              <div className="lp-hero-eyebrow-dot"></div>
              Knowledge Intelligence Platform
            </div>
            <h1 className="lp-hero-title lp-display">
              Operate your plant with <span className="lp-hero-title-accent">certainty.</span>
            </h1>
            <p className="lp-hero-sub">
              IntelliPlant unifies your P&IDs, sensor telemetry, and maintenance logs into a single verifiable source of truth. Find answers, not documents.
            </p>
            <div className="lp-hero-ctas">
              <Link to="/dashboard" className="lp-btn lp-btn-primary">
                Open Dashboard <ArrowRight size={16} />
              </Link>
              <a href="#platform" className="lp-btn lp-btn-secondary">
                Explore platform
              </a>
            </div>
            
            <div className="lp-hero-trust lp-animate-delay-2">
              <div className="lp-hero-trust-dots">
                <span></span><span></span><span></span>
              </div>
              <span className="lp-hero-trust-text">Trusted by 24+ industrial facilities worldwide</span>
            </div>
          </div>

          <div className="lp-hero-visual lp-animate-delay-1">
            <div className="lp-hero-img-wrap">
              <HeroMockup />
            </div>
            
            {/* Floating Card 1: Compliance Status */}
            <div className="lp-hero-float-card lp-hero-float-compliance">
              <div className="lp-hero-float-header">
                <div className="lp-hero-float-icon">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <div className="lp-hero-float-label">Compliance Guard</div>
                  <div className="lp-hero-float-value-badge">
                    <span className="lp-hero-float-dot green"></span>
                    99.8% Verified
                  </div>
                </div>
              </div>

              <div className="lp-hero-float-meters">
                <div className="lp-hero-float-meter-row">
                  <span>ISO 55000 Asset Mgmt</span>
                  <span className="lp-hero-float-meter-val">100%</span>
                </div>
                <div className="lp-hero-float-bar"><div className="lp-hero-float-fill" style={{ width: '100%' }}></div></div>

                <div className="lp-hero-float-meter-row">
                  <span>OSHA Safety Protocols</span>
                  <span className="lp-hero-float-meter-val">100%</span>
                </div>
                <div className="lp-hero-float-bar"><div className="lp-hero-float-fill" style={{ width: '100%' }}></div></div>
              </div>

              <div className="lp-hero-float-footer">
                <CheckCircle2 size={12} className="lp-hero-float-accent-icon" />
                <span>0 Audit Flags • Live Audit Active</span>
              </div>
            </div>
            
            {/* Floating Card 2: Plant Efficiency & Sparkline */}
            <div className="lp-hero-float-card lp-hero-float-card-2 lp-hero-float-efficiency">
              <div className="lp-hero-float-header">
                <div className="lp-hero-float-icon">
                  <Zap size={18} />
                </div>
                <div className="lp-hero-float-title-group">
                  <div className="lp-hero-float-label">Plant Efficiency</div>
                  <div className="lp-hero-float-main-value">
                    +3.4%
                    <span className="lp-hero-float-tag">OPTIMIZED</span>
                  </div>
                </div>
              </div>

              {/* Sparkline Graph */}
              <div className="lp-hero-float-sparkline">
                <svg width="100%" height="36" viewBox="0 0 160 36" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="floatSparkGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--lp-accent)" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="var(--lp-accent)" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path d="M0 28 Q 30 22, 60 18 T 120 10 T 160 4 L 160 36 L 0 36 Z" fill="url(#floatSparkGradient)" />
                  <path d="M0 28 Q 30 22, 60 18 T 120 10 T 160 4" fill="none" stroke="var(--lp-accent)" strokeWidth="2.5" />
                  <circle cx="160" cy="4" r="3.5" fill="var(--lp-accent)" />
                </svg>
              </div>

              <div className="lp-hero-float-chips">
                <span className="lp-hero-float-chip">Energy: -4.2% kWh</span>
                <span className="lp-hero-float-chip">Output: +12.8k bpd</span>
              </div>
            </div>

            {/* Floating Card 3: AI Copilot Pill */}
            <div className="lp-hero-float-card lp-hero-float-card-3 lp-hero-float-ai">
              <div className="lp-hero-float-ai-pill">
                <Bot size={14} className="lp-hero-float-ai-icon" />
                <span>AI Copilot Monitoring 1.2M Sensors</span>
                <span className="lp-hero-float-live-dot"></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="lp-stats">
        <div className="lp-container lp-stats-grid">
          <div className="lp-stat">
            <div className="lp-stat-value lp-num">1.2M</div>
            <div className="lp-stat-label">Sensors Monitored</div>
          </div>
          <div className="lp-stat">
            <div className="lp-stat-value lp-num">99.99%</div>
            <div className="lp-stat-label">Uptime SLA</div>
          </div>
          <div className="lp-stat">
            <div className="lp-stat-value lp-num">124k+</div>
            <div className="lp-stat-label">Documents Indexed</div>
          </div>
          <div className="lp-stat">
            <div className="lp-stat-value lp-num">0</div>
            <div className="lp-stat-label">Unplanned Outages</div>
          </div>
        </div>
      </section>

      {/* Bento Grid */}
      <section id="platform" className="lp-features lp-container">
        <div className="lp-section-header">
          <h2 className="lp-section-title lp-display">The industrial operating system.</h2>
          <p className="lp-section-sub">
            A comprehensive suite of tools designed specifically for modern plant operations, combining real-time telemetry with deep document intelligence.
          </p>
        </div>

        <div className="lp-bento">
          {/* Card 1: Wide Feature (Digital Twin) */}
          <div className="lp-bento-card lp-bento-wide">
            <div className="lp-bento-tag">
              <Radio size={13} /> Digital Twin • Live Telemetry
            </div>
            <h3 className="lp-bento-title">Real-time asset visibility & digital twin.</h3>
            <p className="lp-bento-body">
              Map your entire facility into a living digital twin. Instantly monitor the real-time health of pumps, compressors, and turbines, correlated directly with maintenance logs and P&ID tags.
            </p>

            {/* Visual Node Telemetry Preview */}
            <div className="lp-bento-twin-widget">
              <div className="lp-bento-twin-node active">
                <span className="lp-bento-twin-dot green"></span>
                <span>Compressor C-401</span>
                <span className="val">98.4%</span>
              </div>
              <div className="lp-bento-twin-node active">
                <span className="lp-bento-twin-dot green"></span>
                <span>Feed Pump P-102</span>
                <span className="val">100%</span>
              </div>
              <div className="lp-bento-twin-node warn">
                <span className="lp-bento-twin-dot amber"></span>
                <span>Turbine T-202</span>
                <span className="val warn-val">84°C</span>
              </div>
            </div>

            <div className="lp-bento-chips">
              <div className="lp-bento-chip">
                <div className="lp-bento-chip-dot"></div> Telemetry Sync
              </div>
              <div className="lp-bento-chip">
                <div className="lp-bento-chip-dot"></div> 2D/3D Mapping
              </div>
              <div className="lp-bento-chip">
                <div className="lp-bento-chip-dot"></div> Fault Detection
              </div>
            </div>
          </div>

          {/* Card 2: Medium Feature (Smart Documents) */}
          <div className="lp-bento-card">
            <div className="lp-bento-tag">
              <FileStack size={13} /> Intelligence • Industrial RAG
            </div>
            <h3 className="lp-bento-title">Smart Documents & P&IDs.</h3>
            <p className="lp-bento-body">
              Automatically index manuals, schematics, and P&IDs. AI links document paragraphs directly to physical equipment tags in seconds.
            </p>

            {/* Document Extraction Widget */}
            <div className="lp-bento-doc-widget">
              <FileText size={14} className="lp-bento-doc-icon" />
              <div className="lp-bento-doc-info">
                <div className="lp-bento-doc-title">104-MAN-C401.pdf</div>
                <div className="lp-bento-doc-tag">Linked to Tag #C-401 • Sec 4.2</div>
              </div>
            </div>

            <div className="lp-bento-chips">
              <div className="lp-bento-chip">
                <div className="lp-bento-chip-dot"></div> Semantic Search
              </div>
              <div className="lp-bento-chip">
                <div className="lp-bento-chip-dot"></div> AI Extraction
              </div>
              <div className="lp-bento-chip">
                <div className="lp-bento-chip-dot"></div> Auto-Linking
              </div>
            </div>
          </div>

          {/* Card 3: Medium Feature (Compliance Guard) */}
          <div className="lp-bento-card">
            <div className="lp-bento-tag">
              <ShieldCheck size={13} /> Safety • Continuous Audit
            </div>
            <h3 className="lp-bento-title">Automated Compliance Guard.</h3>
            <p className="lp-bento-body">
              Automated tracking of regulatory requirements and safety standards across your facility. Never miss a safety audit again.
            </p>

            {/* Meter Widget */}
            <div className="lp-bento-meter-widget">
              <div className="lp-bento-meter-row">
                <span>ISO 55000 Audit Status</span>
                <span className="lp-bento-meter-val">100% PASS</span>
              </div>
              <div className="lp-bento-meter-bar">
                <div className="lp-bento-meter-fill" style={{ width: '100%' }}></div>
              </div>
            </div>

            <div className="lp-bento-chips">
              <div className="lp-bento-chip">
                <div className="lp-bento-chip-dot"></div> Audit Ready
              </div>
              <div className="lp-bento-chip">
                <div className="lp-bento-chip-dot"></div> Gap Analysis
              </div>
              <div className="lp-bento-chip">
                <div className="lp-bento-chip-dot"></div> Live Tracking
              </div>
            </div>
          </div>

          {/* Card 4: Wide Feature (Predictive Insights) */}
          <div className="lp-bento-card lp-bento-wide">
            <div className="lp-bento-tag">
              <TrendingUp size={13} /> Analytics • Predictive ML
            </div>
            <h3 className="lp-bento-title">Predictive Anomaly Detection.</h3>
            <p className="lp-bento-body">
              AI pattern recognition identifies thermal and vibration anomalies before they become failures, giving engineers 14+ days advance notice.
            </p>

            {/* Predictive Risk Widget */}
            <div className="lp-bento-risk-widget">
              <div className="lp-bento-risk-metric">
                <div className="val">0.02%</div>
                <div className="lbl">30-Day Outage Risk</div>
              </div>
              <div className="lp-bento-risk-pill">
                <CheckCircle2 size={12} /> Zero Anomalies
              </div>
            </div>

            <div className="lp-bento-chips">
              <div className="lp-bento-chip">
                <div className="lp-bento-chip-dot"></div> Anomaly Detection
              </div>
              <div className="lp-bento-chip">
                <div className="lp-bento-chip-dot"></div> Risk Prediction
              </div>
              <div className="lp-bento-chip">
                <div className="lp-bento-chip-dot"></div> Usage Trends
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Copilot Section */}
      <section id="copilot" className="lp-copilot">
        <div className="lp-container lp-copilot-inner">
          <div className="lp-chat-preview">
            <div className="lp-chat-header">
              <div className="lp-chat-header-main">
                <div className="lp-chat-header-icon">
                  <Bot size={18} />
                </div>
                <div>
                  <div className="lp-chat-header-title">IntelliPlant Copilot</div>
                  <div className="lp-chat-header-sub">
                    <span className="lp-chat-header-dot"></span> ONLINE • READY
                  </div>
                </div>
              </div>
            </div>

            <div className="lp-chat-body">
              <div className="lp-chat-msg lp-chat-msg-user">
                <div className="lp-chat-msg-avatar">
                  <User size={14} />
                </div>
                <div className="lp-chat-bubble">
                  What is the procedure to replace the mechanical seal on Compressor C-401?
                </div>
              </div>
              
              <div className="lp-chat-msg">
                <div className="lp-chat-msg-avatar">
                  <Bot size={14} />
                </div>
                <div>
                  <div className="lp-chat-bubble">
                    <span style={{ fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>
                      To replace mechanical seal on Compressor C-401, follow OEM procedure:
                    </span>
                    <div className="lp-chat-step-list">
                      <div className="lp-chat-step-item">
                        <span className="lp-chat-step-num">1</span>
                        <span>Isolate and depressurize the compressor assembly.</span>
                      </div>
                      <div className="lp-chat-step-item">
                        <span className="lp-chat-step-num">2</span>
                        <span>Remove the flexible coupling and seal housing plate.</span>
                      </div>
                      <div className="lp-chat-step-item">
                        <span className="lp-chat-step-num">3</span>
                        <span>Extract the old mechanical seal & inspect drive shaft.</span>
                      </div>
                      <div className="lp-chat-step-item">
                        <span className="lp-chat-step-num">4</span>
                        <span>Install new seal assembly (Part #MS-401-A) to torque spec.</span>
                      </div>
                    </div>
                  </div>
                  <div className="lp-chat-citation">
                    <FileText size={13} /> Document ID: 104-MAN-C401 • Section 4.2
                  </div>
                </div>
              </div>
            </div>

            <div className="lp-chat-footer">
              <div className="lp-chat-input-fake">
                <span>Ask a question about your plant equipment or P&IDs...</span>
                <span className="lp-chat-kbd">⌘K</span>
              </div>
              <button className="lp-chat-send-btn" aria-label="Send query">
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          <div className="lp-copilot-content">
            <div className="lp-eyebrow mb-2">Industrial RAG</div>
            <h2 className="lp-copilot-title lp-display">Talk to your facility.</h2>
            <p className="lp-copilot-body">
              Stop digging through binders and shared drives. The AI Copilot is trained on your exact equipment manuals, historical logs, and P&IDs, delivering precise answers with verifiable citations.
            </p>
            
            <div className="lp-copilot-features">
              <div className="lp-copilot-feature">
                <div className="lp-copilot-feature-icon">
                  <ShieldCheck size={14} />
                </div>
                <div className="lp-copilot-feature-text">
                  <strong>Verifiable citations.</strong> Every answer links directly to the source document and page number.
                </div>
              </div>
              <div className="lp-copilot-feature">
                <div className="lp-copilot-feature-icon">
                  <Factory size={14} />
                </div>
                <div className="lp-copilot-feature-text">
                  <strong>Context aware.</strong> It knows the current real-time telemetry of the asset you're asking about.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="lp-cta">
        <div className="lp-container lp-cta-inner">
          <div className="lp-cta-mark">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--lp-accent-contrast)' }}>
              <path d="M7 16V8h4a2 2 0 0 1 0 4H7" />
              <path d="M15 8v8" />
              <path d="M15 12h3a2 2 0 0 0 0-4h-3" />
            </svg>
          </div>
          <h2 className="lp-cta-title lp-display">Ready to upgrade your operations?</h2>
          <p className="lp-cta-body">
            Join the industrial facilities using IntelliPlant to reduce downtime and ensure rigorous compliance.
          </p>
          <div className="lp-cta-actions">
            <Link to="/dashboard" className="lp-btn lp-btn-primary">
              Access the Console <ArrowRight size={16} />
            </Link>
            <a href="mailto:sales@intelliplant.com" className="lp-btn lp-btn-secondary">
              Contact Sales
            </a>
          </div>
          <div className="lp-cta-note">SSO and On-Premise deployments available</div>
        </div>
      </section>

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
