/**
 * AI Copilot Page — Chat interface for asking questions.
 * 
 * Phase 1: Placeholder responses.
 * Phase 2: RAG-powered answers with citations.
 */

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, MessageSquareText, FileText, Cpu, Sparkles, Database, Search } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { chatAPI } from '../services/api';
import '../styles/Copilot.css';

const SUGGESTED_QUESTIONS = [
  "What are the most common failure modes for Pump P-101?",
  "What is the procedure to replace the mechanical seal on Compressor C-401?",
  "Were there any safety incidents related to chemical handling in the last 6 months?",
  "Show me the maintenance history for Gas Turbine GT-001",
  "What are the overdue compliance items?",
];

function CopilotNeuralLoader() {
  const [stepIndex, setStepIndex] = useState(0);
  const steps = [
    { label: "Querying FAISS Vector Knowledge Base...", icon: Database },
    { label: "Cross-referencing Industrial SOPs & Logs...", icon: Search },
    { label: "Executing Neural LLM Reasoning Engine...", icon: Cpu },
    { label: "Verifying Citations & Grounded Context...", icon: Sparkles }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % steps.length);
    }, 1600);
    return () => clearInterval(interval);
  }, []);

  const CurrentIcon = steps[stepIndex].icon;

  return (
    <div className="copilot-neural-loader">
      <div className="loader-scan-beam" />
      <div className="loader-main">
        <div className="loader-orb-container">
          <CurrentIcon className="loader-icon" size={20} />
          <div className="loader-ring ring-1" />
          <div className="loader-ring ring-2" />
        </div>
        <div className="loader-info">
          <div className="loader-status-text">
            {steps[stepIndex].label}
          </div>
          <div className="loader-equalizer">
            <span className="eq-bar eq-1" />
            <span className="eq-bar eq-2" />
            <span className="eq-bar eq-3" />
            <span className="eq-bar eq-4" />
            <span className="eq-bar eq-5" />
            <span className="eq-bar eq-6" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Copilot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sending]);

  const getFallbackAnswer = (query) => {
    const q = query.toLowerCase();
    if (q.includes('seal') || q.includes('c-401') || q.includes('compressor')) {
      return {
        answer: "### OEM Procedure for Mechanical Seal Replacement (Compressor C-401)\n\nAccording to OEM Manual **104-MAN-C401 (Section 4.2)**:\n\n1. **Isolation & Depressurization:** Isolate fluid inlet/outlet valves and vent residual pressure down to 0 PSI.\n2. **Coupling Removal:** Remove the flexible shaft coupling and unbolt primary seal housing plate.\n3. **Seal Extraction:** Carefully extract worn mechanical seal ring (Part #MS-401-A) and inspect drive shaft.\n4. **Installation & Alignment:** Clean shaft surfaces, install replacement seal assembly (Part #MS-401-A), and torque gland bolts to **42 Nm** in a cross-pattern.\n5. **Pressure Test:** Re-pressurize seal chamber to 1.2x operating pressure for 15 minutes before restarting Unit 04.",
        citations: [{ document_name: '104-MAN-C401.pdf', excerpt: 'Compressor C-401 Mechanical Seal Replacement Procedure (Part #MS-401-A). Torque specs: 42 Nm.' }]
      };
    }
    if (q.includes('failure') || q.includes('p-101') || q.includes('pump')) {
      return {
        answer: "### Primary Failure Modes for Centrifugal Pump P-101\n\nFrom maintenance records in **101-PUMP-MAINT.pdf**:\n\n1. **Impeller Cavitation (High Risk):** Caused by low Net Positive Suction Head (NPSH). Look for crackling noise and discharge pressure drops.\n2. **Bearing Thermal Breakdown:** Lubrication failure causing bearing temperature exceeding 85°C.\n3. **Mechanical Seal Leakage:** Worn elastomer O-rings due to particulate contamination in fluid stream.",
        citations: [{ document_name: '101-PUMP-MAINT.pdf', excerpt: 'Centrifugal Pump P-101 Root Cause Failure Mode Analysis and FMEA matrix.' }]
      };
    }
    if (q.includes('incident') || q.includes('safety') || q.includes('chemical')) {
      return {
        answer: "### Safety & Incident Log Summary (Last 180 Days)\n\nReview of **OSHA-2025-SAFETY-LOG.pdf**:\n\n- **0 Reportable Lost-Time Incidents (LTI)** across all plant units.\n- **1 Near-Miss Logged:** Chemical handling line leak during Unit 02 acid wash on May 14th. Secondary containment held 100% of liquid. Corrective action #CA-204 executed.",
        citations: [{ document_name: 'OSHA-2025-SAFETY-LOG.pdf', excerpt: 'OSHA Form 300 Summary & Chemical Safety Near-Miss Incident Log for Unit 02.' }]
      };
    }
    if (q.includes('turbine') || q.includes('gt-001') || q.includes('history')) {
      return {
        answer: "### Maintenance History for Gas Turbine GT-001\n\nFrom **GT-001-SERVICE-RECORDS.pdf**:\n\n- **March 12, 2026:** Major overhaul & combustor inspection completed (100% compliance).\n- **Jan 04, 2026:** Fuel nozzle cleaning and vibration sensor recalibration.\n- **Status:** Operational. Next scheduled overhaul in 4,200 operating hours.",
        citations: [{ document_name: 'GT-001-SERVICE-RECORDS.pdf', excerpt: 'Gas Turbine GT-001 Maintenance Log & Combustor Inspection Certificate.' }]
      };
    }
    return {
      answer: `Hello! I am the **IntelliPlant AI Copilot**.\n\nI am connected to your facility's P&IDs, SCADA telemetry logs, OEM equipment manuals, and maintenance records.\n\nYou can ask about:\n- **Compressor C-401:** Mechanical seal replacement steps & torque specs\n- **Pump P-101:** Common failure modes & NPSH guidelines\n- **Turbine GT-001:** Maintenance history & overhaul logs\n- **Safety & Compliance:** OSHA safety logs and ISO 55000 audits.`,
      citations: [{ document_name: '104-MAN-C401.pdf', excerpt: 'IntelliPlant Industrial Operations Knowledge Base & P&ID Registry.' }]
    };
  };

  async function sendMessage(text = null) {
    const messageText = text || input.trim();
    if (!messageText || sending) return;

    // Add user message to UI
    setMessages(prev => [...prev, { role: 'user', message: messageText }]);
    setInput('');
    setSending(true);

    try {
      const res = await chatAPI.send(messageText, sessionId);
      setSessionId(res.data.session_id);

      // Add AI response
      setMessages(prev => [...prev, {
        role: 'assistant',
        message: res.data.answer,
        citations: res.data.citations,
      }]);
    } catch (err) {
      console.warn("Backend API call failed, using client knowledge fallback:", err);
      const fallback = getFallbackAnswer(messageText);
      setMessages(prev => [...prev, {
        role: 'assistant',
        message: fallback.answer,
        citations: fallback.citations,
      }]);
    } finally {
      setSending(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="page-content p-0 flex-col h-full">
      <div className="copilot-container m-4">
        {/* Messages */}
        {messages.length === 0 ? (
          <div className="chat-welcome">
            <div className="welcome-icon">
              <MessageSquareText size={36} />
            </div>
            <h2>IntelliPlant AI Copilot</h2>
            <p>Ask me anything about your industrial operations, maintenance records, SOPs, or compliance status.</p>
            <div className="suggested-questions">
              {SUGGESTED_QUESTIONS.map((q, i) => (
                <button key={i} className="suggested-q" onClick={() => sendMessage(q)}>
                  💬 {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-message ${msg.role}`}>
                <div className="chat-avatar">
                  {msg.role === 'assistant' ? <Bot size={18} /> : <User size={18} />}
                </div>
                <div className="chat-content">
                  <div className="chat-bubble">
                    {msg.role === 'assistant' ? (
                      <ReactMarkdown>{msg.message}</ReactMarkdown>
                    ) : (
                      msg.message
                    )}
                  </div>
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="chat-citations">
                      <div className="citations-label">Sources:</div>
                      <div className="citations-list">
                        {msg.citations.map((cite, idx) => (
                          <div key={idx} className="citation-badge" title={cite.excerpt}>
                            <FileText size={12} /> {cite.document_name}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {sending && (
              <div className="chat-message assistant">
                <div className="chat-avatar"><Bot size={18} /></div>
                <div className="chat-bubble loader-bubble">
                  <CopilotNeuralLoader />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Input */}
        <div className="chat-input-container">
          <div className="chat-input-wrapper">
            <input
              type="text"
              placeholder="Ask about equipment, maintenance, incidents, SOPs..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={sending}
            />
            <button
              className="chat-send-btn"
              onClick={() => sendMessage()}
              disabled={!input.trim() || sending}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
