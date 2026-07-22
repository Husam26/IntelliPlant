import React, { useState } from 'react';
import { 
  Activity, 
  Zap, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Cpu, 
  Search, 
  Radio, 
  TrendingUp, 
  Layers, 
  ArrowUpRight,
  Gauge
} from 'lucide-react';

export default function HeroMockup() {
  const [activeFrame, setActiveFrame] = useState('LIVE');

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: 'var(--lp-surface-2)',
      color: 'var(--lp-text)',
      display: 'flex',
      flexDirection: 'column',
      fontSize: '0.75rem',
      fontFamily: 'var(--lp-font-sans, system-ui, sans-serif)',
      userSelect: 'none',
      overflow: 'hidden',
      border: '1px solid var(--lp-border-strong)',
      borderRadius: 'var(--lp-radius-xl)',
      boxShadow: 'var(--lp-shadow-lg)'
    }}>
      {/* Top Header Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.625rem 1rem',
        background: 'var(--lp-surface)',
        borderBottom: '1px solid var(--lp-border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div style={{ display: 'flex', gap: '0.35rem' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444', display: 'inline-block' }}></span>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }}></span>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
          </div>
          <div style={{ height: 12, width: 1, background: 'var(--lp-border)' }}></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.05em', color: 'var(--lp-text)' }}>
            <Radio size={12} style={{ color: 'var(--lp-accent)' }} />
            <span>UNIT 04 • CATALYTIC CRACKER</span>
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'var(--lp-inset)',
          padding: '0.25rem 0.625rem',
          borderRadius: '6px',
          border: '1px solid var(--lp-border)',
          color: 'var(--lp-text-muted)',
          fontSize: '0.65rem'
        }}>
          <Search size={12} />
          <span>Search P&IDs, tags (P-101, C-401)...</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.25rem 0.6rem',
            borderRadius: '12px',
            background: 'var(--lp-accent-soft)',
            border: '1px solid var(--lp-accent-border)',
            color: 'var(--lp-accent)',
            fontSize: '0.625rem',
            fontWeight: 600,
            letterSpacing: '0.04em'
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', boxShadow: '0 0 6px currentColor' }}></span>
            TELEMETRY LIVE
          </span>
        </div>
      </div>

      {/* Main Grid Content */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '220px 1fr',
        flex: 1,
        minHeight: 0,
        background: 'var(--lp-bg)'
      }}>
        {/* Left Sidebar: Asset Telemetry List */}
        <div style={{
          borderRight: '1px solid var(--lp-border)',
          background: 'var(--lp-surface)',
          padding: '0.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.625rem',
          overflow: 'hidden'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.1rem' }}>
            <span style={{ fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--lp-text-muted)', fontWeight: 600 }}>
              Critical Assets (4)
            </span>
            <span style={{ fontSize: '0.6rem', color: 'var(--lp-accent)', fontFamily: 'var(--lp-font-mono)', fontWeight: 600 }}>
              100% HEALTH
            </span>
          </div>

          {/* Asset Item 1 */}
          <div style={{
            padding: '0.5rem 0.625rem',
            borderRadius: '8px',
            background: 'var(--lp-accent-soft)',
            border: '1px solid var(--lp-accent-border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontWeight: 600, fontSize: '0.725rem', color: 'var(--lp-text)' }}>Compressor C-401</div>
              <span style={{ fontSize: '0.625rem', fontWeight: 700, color: 'var(--lp-accent)', fontFamily: 'var(--lp-font-mono)' }}>98.4%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.6rem', color: 'var(--lp-text-muted)' }}>
              <span>Vibration: 1.2 mm/s</span>
              <span style={{ color: 'var(--lp-accent)', fontWeight: 600 }}>Optimal</span>
            </div>
            <div style={{ width: '100%', height: '4px', background: 'rgba(0,0,0,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ width: '98.4%', height: '100%', background: 'var(--lp-accent)', borderRadius: '2px' }}></div>
            </div>
          </div>

          {/* Asset Item 2 */}
          <div style={{
            padding: '0.5rem 0.625rem',
            borderRadius: '8px',
            background: 'var(--lp-surface-2)',
            border: '1px solid var(--lp-border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontWeight: 600, fontSize: '0.725rem', color: 'var(--lp-text)' }}>Feed Pump P-102</div>
              <span style={{ fontSize: '0.625rem', fontWeight: 700, color: 'var(--lp-accent)', fontFamily: 'var(--lp-font-mono)' }}>100%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.6rem', color: 'var(--lp-text-muted)' }}>
              <span>Flow: 420 L/min</span>
              <span>Nominal</span>
            </div>
            <div style={{ width: '100%', height: '4px', background: 'var(--lp-inset)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ width: '100%', height: '100%', background: 'var(--lp-accent)', borderRadius: '2px' }}></div>
            </div>
          </div>

          {/* Asset Item 3 */}
          <div style={{
            padding: '0.5rem 0.625rem',
            borderRadius: '8px',
            background: 'var(--lp-warning-soft)',
            border: '1px solid rgba(245, 158, 11, 0.35)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontWeight: 600, fontSize: '0.725rem', color: 'var(--lp-text)' }}>Turbine T-202</div>
              <span style={{ fontSize: '0.625rem', fontWeight: 700, color: 'var(--lp-warning)', fontFamily: 'var(--lp-font-mono)' }}>WARN</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.6rem', color: 'var(--lp-warning)' }}>
              <span>Seal Temp: 84°C</span>
              <span>High Temp</span>
            </div>
            <div style={{ width: '100%', height: '4px', background: 'rgba(245, 158, 11, 0.15)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ width: '84%', height: '100%', background: 'var(--lp-warning)', borderRadius: '2px' }}></div>
            </div>
          </div>

          {/* Asset Item 4 */}
          <div style={{
            padding: '0.5rem 0.625rem',
            borderRadius: '8px',
            background: 'var(--lp-surface-2)',
            border: '1px solid var(--lp-border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontWeight: 600, fontSize: '0.725rem', color: 'var(--lp-text)' }}>Reactor Vessel R-101</div>
              <span style={{ fontSize: '0.625rem', fontWeight: 700, color: 'var(--lp-accent)', fontFamily: 'var(--lp-font-mono)' }}>99.1%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.6rem', color: 'var(--lp-text-muted)' }}>
              <span>Pressure: 42.1 PSI</span>
              <span>Stable</span>
            </div>
            <div style={{ width: '100%', height: '4px', background: 'var(--lp-inset)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ width: '99%', height: '100%', background: 'var(--lp-accent)', borderRadius: '2px' }}></div>
            </div>
          </div>

          {/* AI Insight Box */}
          <div style={{
            marginTop: 'auto',
            padding: '0.625rem 0.75rem',
            borderRadius: '8px',
            background: 'var(--lp-inset)',
            border: '1px solid var(--lp-border)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--lp-accent)', fontWeight: 600, fontSize: '0.65rem' }}>
                <Cpu size={12} />
                <span>AI COPILOT</span>
              </div>
              <span style={{ fontSize: '0.55rem', background: 'var(--lp-accent-soft)', color: 'var(--lp-accent)', padding: '0.1rem 0.35rem', borderRadius: '4px', fontWeight: 600 }}>ACTIVE</span>
            </div>
            <p style={{ fontSize: '0.6rem', color: 'var(--lp-text-muted)', margin: '0.35rem 0 0', lineHeight: 1.4 }}>
              Compressor C-401 seal maintenance scheduled in 14 days. ISO 55000: Compliant.
            </p>
          </div>
        </div>

        {/* Right Dashboard Body: Charts & Visuals */}
        <div style={{
          padding: '0.875rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          overflow: 'hidden',
          background: 'var(--lp-surface-2)'
        }}>
          {/* Top Metric Cards Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.625rem' }}>
            <div style={{
              background: 'var(--lp-surface)',
              padding: '0.625rem 0.75rem',
              borderRadius: '8px',
              border: '1px solid var(--lp-border)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: 'var(--lp-shadow-sm)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--lp-text-muted)', fontSize: '0.6rem', fontWeight: 500 }}>System Efficiency</span>
                <span style={{ fontSize: '0.55rem', color: 'var(--lp-accent)', background: 'var(--lp-accent-soft)', padding: '0.1rem 0.35rem', borderRadius: '4px', fontWeight: 600 }}>+1.4%</span>
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--lp-accent)', marginTop: '0.25rem', fontFamily: 'var(--lp-font-mono)' }}>96.8%</div>
            </div>

            <div style={{
              background: 'var(--lp-surface)',
              padding: '0.625rem 0.75rem',
              borderRadius: '8px',
              border: '1px solid var(--lp-border)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: 'var(--lp-shadow-sm)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--lp-text-muted)', fontSize: '0.6rem', fontWeight: 500 }}>Telemetry Stream</span>
                <span style={{ fontSize: '0.55rem', color: 'var(--lp-text-muted)', background: 'var(--lp-inset)', padding: '0.1rem 0.35rem', borderRadius: '4px', fontWeight: 500 }}>0ms LAG</span>
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--lp-text)', marginTop: '0.25rem', fontFamily: 'var(--lp-font-mono)' }}>14,280 <span style={{ fontSize: '0.65rem', fontWeight: 500, color: 'var(--lp-text-muted)' }}>/sec</span></div>
            </div>

            <div style={{
              background: 'var(--lp-surface)',
              padding: '0.625rem 0.75rem',
              borderRadius: '8px',
              border: '1px solid var(--lp-border)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: 'var(--lp-shadow-sm)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--lp-text-muted)', fontSize: '0.6rem', fontWeight: 500 }}>Safety Audits</span>
                <ShieldCheck size={12} style={{ color: 'var(--lp-accent)' }} />
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--lp-text)', marginTop: '0.25rem', fontFamily: 'var(--lp-font-mono)' }}>100% <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--lp-accent)' }}>PASS</span></div>
            </div>
          </div>

          {/* Telemetry Chart Simulation */}
          <div style={{
            flex: 1,
            background: 'var(--lp-surface)',
            borderRadius: '8px',
            border: '1px solid var(--lp-border)',
            padding: '0.75rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            boxShadow: 'var(--lp-shadow-sm)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 600, fontSize: '0.7rem', color: 'var(--lp-text)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <TrendingUp size={14} style={{ color: 'var(--lp-accent)' }} />
                <span>Real-Time Vibration & Thermal Frequency Analysis</span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                {['1M', '5M', '1H', 'LIVE'].map((tf) => (
                  <button 
                    key={tf}
                    onClick={() => setActiveFrame(tf)}
                    style={{
                      border: 'none',
                      background: activeFrame === tf ? 'var(--lp-accent)' : 'var(--lp-inset)',
                      color: activeFrame === tf ? '#ffffff' : 'var(--lp-text-muted)',
                      padding: '0.15rem 0.4rem',
                      borderRadius: '4px',
                      fontSize: '0.55rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontFamily: 'var(--lp-font-mono)'
                    }}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            {/* SVG Wave Chart */}
            <div style={{ width: '100%', height: '85px', marginTop: '0.5rem', position: 'relative' }}>
              <svg width="100%" height="100%" viewBox="0 0 400 85" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--lp-accent)" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="var(--lp-accent)" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Gridlines */}
                <line x1="0" y1="20" x2="400" y2="20" stroke="var(--lp-border)" strokeDasharray="3 3" />
                <line x1="0" y1="45" x2="400" y2="45" stroke="var(--lp-border)" strokeDasharray="3 3" />
                <line x1="0" y1="70" x2="400" y2="70" stroke="var(--lp-border)" strokeDasharray="3 3" />

                {/* Area Fill */}
                <path 
                  d="M0 65 Q 50 25, 100 48 T 200 20 T 300 52 T 400 15 L 400 85 L 0 85 Z" 
                  fill="url(#chartGradient)" 
                />

                {/* Secondary Reference Line */}
                <path 
                  d="M0 72 Q 60 40, 120 55 T 240 35 T 340 60 T 400 30" 
                  fill="none" 
                  stroke="var(--lp-border-strong)" 
                  strokeWidth="1.5" 
                  strokeDasharray="4 2"
                />

                {/* Main Active Wave Line */}
                <path 
                  d="M0 65 Q 50 25, 100 48 T 200 20 T 300 52 T 400 15" 
                  fill="none" 
                  stroke="var(--lp-accent)" 
                  strokeWidth="2.5" 
                />

                {/* Pulsing indicator point */}
                <circle cx="400" cy="15" r="4" fill="var(--lp-accent)" />
                <circle cx="400" cy="15" r="8" fill="var(--lp-accent)" opacity="0.3" />
              </svg>
            </div>

            {/* Bottom Status Bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '0.4rem',
              borderTop: '1px solid var(--lp-border)',
              fontSize: '0.625rem',
              color: 'var(--lp-text-muted)'
            }}>
              <span style={{ fontFamily: 'var(--lp-font-mono)', fontSize: '0.58rem' }}>SCADA / Modbus-TCP Gateway 192.168.1.104</span>
              <span style={{ color: 'var(--lp-accent)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <CheckCircle2 size={11} /> Zero Anomalies Detected
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

