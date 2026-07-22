/**
 * Documents Page — Upload, browse, and manage industrial documents.
 * 
 * Features:
 * 1. Drag-and-drop upload zone with visual feedback
 * 2. File type validation
 * 3. Upload progress tracking
 * 4. Document list with category filters and search
 * 5. Processing status indicators
 * 6. Delete functionality
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Upload, Search, FileText, File, Trash2,
  CheckCircle2, Loader, AlertCircle, Filter
} from 'lucide-react';
import { documentAPI } from '../services/api';
import '../styles/Documents.css';

const CATEGORIES = ['All', 'SOP', 'Incident Report', 'Maintenance Report', 'Compliance Report', 'Equipment Manual'];

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadDocuments();
  }, [activeCategory, searchQuery]);

  // Poll for processing status updates
  useEffect(() => {
    const hasProcessing = documents.some(d => d.processing_status === 'pending' || d.processing_status === 'processing');
    if (!hasProcessing) return;

    const interval = setInterval(loadDocuments, 3000);
    return () => clearInterval(interval);
  }, [documents]);

  async function loadDocuments() {
    try {
      const params = {};
      if (activeCategory !== 'All') params.category = activeCategory;
      if (searchQuery) params.search = searchQuery;

      const res = await documentAPI.list(params);
      setDocuments(res.data.documents);
    } catch (err) {
      console.error('Failed to load documents:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(files) {
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    for (const file of files) {
      try {
        setUploadProgress(30);
        await documentAPI.upload(file);
        setUploadProgress(100);
      } catch (err) {
        console.error('Upload failed:', err);
        alert(`Failed to upload ${file.name}: ${err.response?.data?.detail || err.message}`);
      }
    }

    setTimeout(() => {
      setUploading(false);
      setUploadProgress(0);
      loadDocuments();
    }, 500);
  }

  async function handleDelete(id, filename) {
    if (!confirm(`Delete "${filename}"? This cannot be undone.`)) return;

    try {
      await documentAPI.delete(id);
      loadDocuments();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  }

  // Drag and drop handlers
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    handleUpload(e.dataTransfer.files);
  }, []);

  function formatFileSize(bytes) {
    if (!bytes) return '—';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  function getStatusIndicator(status) {
    switch (status) {
      case 'ready':
        return <span className="processing-indicator" style={{ color: 'var(--ip-accent)' }}><CheckCircle2 size={14} /> Ready</span>;
      case 'processing':
        return <span className="processing-indicator" style={{ color: 'var(--ip-info)' }}><div className="spinner" /> Processing</span>;
      case 'pending':
        return <span className="processing-indicator" style={{ color: 'var(--ip-warning)' }}><Loader size={14} /> Pending</span>;
      case 'failed':
        return <span className="processing-indicator" style={{ color: 'var(--ip-danger)' }}><AlertCircle size={14} /> Failed</span>;
      default:
        return <span className="processing-indicator">{status}</span>;
    }
  }

  function getCategoryBadge(category) {
    if (!category) return null;
    const colors = {
      'SOP': 'info',
      'Incident Report': 'danger',
      'Maintenance Report': 'warning',
      'Compliance Report': 'good',
      'Equipment Manual': 'neutral',
    };
    const c = colors[category] || 'info';
    return <span className={`ip-badge ${c !== 'neutral' ? `ip-badge-${c}` : ''}`}>{category}</span>;
  }


  return (
    <div className="page-content">
      {/* Upload Zone */}
      <div
        className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload size={48} />
        <h3>Drop documents here or <span className="browse-btn">browse</span></h3>
        <p>Supports PDF, DOCX, XLSX, TXT • Max 50MB per file</p>

        {uploading && (
          <div className="upload-progress">
            <div className="upload-status">Uploading...</div>
            <div className="progress-bar-container">
              <div className="progress-bar" style={{ width: `${uploadProgress}%` }} />
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.docx,.doc,.xlsx,.xls,.txt,.csv"
          style={{ display: 'none' }}
          onChange={(e) => handleUpload(e.target.files)}
        />
      </div>

      {/* Toolbar */}
      <div className="doc-toolbar">
        <div className="doc-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="doc-filters">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Document Table */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
          <div className="spinner spinner-lg" style={{ color: 'var(--ip-accent)' }} />
        </div>
      ) : documents.length === 0 ? (
        <div className="empty-state" style={{ textAlign: 'center', padding: '4rem', color: 'var(--ip-text-muted)' }}>
          <FileText size={48} style={{ marginBottom: '1rem', color: 'var(--ip-text-faint)' }} />
          <h3 style={{ fontFamily: 'var(--ip-font-display)', fontSize: '1.25rem', color: 'var(--ip-text)' }}>No Documents Yet</h3>
          <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>Upload industrial documents to get started with AI-powered analysis.</p>
        </div>
      ) : (
        <table className="ip-table">
          <thead>
            <tr>
              <th>Filename</th>
              <th>Category</th>
              <th>Size</th>
              <th>Pages</th>
              <th>Chunks</th>
              <th>Status</th>
              <th>Uploaded</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc.id}>
                <td>
                  <div className="doc-name">
                    <FileText size={18} />
                    <span style={{ maxWidth: 300, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{doc.filename}</span>
                  </div>
                </td>
                <td>{getCategoryBadge(doc.doc_category)}</td>
                <td><span style={{ fontFamily: 'var(--ip-font-mono)', fontSize: '0.8125rem' }}>{formatFileSize(doc.file_size)}</span></td>
                <td style={{ fontFamily: 'var(--ip-font-mono)' }}>{doc.page_count || '—'}</td>
                <td style={{ fontFamily: 'var(--ip-font-mono)' }}>{doc.chunk_count || '—'}</td>
                <td>{getStatusIndicator(doc.processing_status)}</td>
                <td style={{ fontSize: '0.8125rem', color: 'var(--ip-text-muted)' }}>
                  {doc.upload_date ? new Date(doc.upload_date).toLocaleDateString() : '—'}
                </td>
                <td>
                  <button
                    className="action-btn delete"
                    onClick={(e) => { e.stopPropagation(); handleDelete(doc.id, doc.filename); }}
                    title="Delete document"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
