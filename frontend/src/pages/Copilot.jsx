/**
 * AI Copilot Page — Chat interface for asking questions.
 * 
 * Phase 1: Placeholder responses.
 * Phase 2: RAG-powered answers with citations.
 */

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, MessageSquareText, FileText } from 'lucide-react';
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

export default function Copilot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
      setMessages(prev => [...prev, {
        role: 'assistant',
        message: '❌ Sorry, I encountered an error. Please try again.',
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
    <div className="page-content" style={{ padding: 0, display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)' }}>
      <div className="copilot-container" style={{ flex: 1, background: 'var(--bg-primary)', borderRadius: 'var(--radius-lg)', margin: 'var(--space-lg)', border: '1px solid var(--border-color)' }}>
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
                <div className="chat-bubble">
                  <div className="spinner" style={{ margin: '4px auto' }} />
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
