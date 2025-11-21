
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

export default function LinksTable({ links, onDelete }) {
  const [filter, setFilter] = useState('');
  const [copyingCode, setCopyingCode] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [bulkAction, setBulkAction] = useState('');

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    let result = links;
    
    if (q) {
      result = result.filter(
        (l) =>
          l.code.toLowerCase().includes(q) ||
          (l.url && l.url.toLowerCase().includes(q))
      );
    }

    // Sorting
    if (sortConfig.key) {
      result = [...result].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [links, filter, sortConfig]);

  function handleSort(key) {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  }

  function formatDate(value) {
    if (!value) return '—';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '—';
    return d.toLocaleString();
  }

  async function handleCopy(shortUrl, code) {
    try {
      setCopyingCode(code);
      await navigator.clipboard.writeText(shortUrl);
    } catch (err) {
      console.error('Copy failed:', err);
      alert('Copy failed. You can manually copy the link.');
    } finally {
      setTimeout(() => setCopyingCode(null), 800);
    }
  }

  function handleRowSelect(code) {
    setSelectedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(code)) {
        newSet.delete(code);
      } else {
        newSet.add(code);
      }
      return newSet;
    });
  }

  function handleSelectAll() {
    setSelectedRows(prev => 
      prev.size === filtered.length ? new Set() : new Set(filtered.map(l => l.code))
    );
  }

  function handleBulkAction() {
    if (bulkAction === 'delete' && selectedRows.size > 0) {
      if (window.confirm(`Delete ${selectedRows.size} selected links? This cannot be undone.`)) {
        selectedRows.forEach(code => onDelete(code));
        setSelectedRows(new Set());
        setBulkAction('');
      }
    }
  }

  const baseUrl = window.location.origin;

  return (
    <div className="advanced-card">
      <div className="card-header">
        <div className="header-content">
          <div className="title-section">
            <h2 className="card-title">All Links</h2>
            <p className="card-subtitle">
              {links.length === 0
                ? 'No links yet. Create your first one above.'
                : `${links.length} total link${links.length > 1 ? 's' : ''}`}
              {filter && filtered.length !== links.length && 
                ` • ${filtered.length} match${filtered.length > 1 ? 'es' : ''}`
              }
            </p>
          </div>
          
          <div className="header-actions">
            <div className="search-wrapper">
              <svg className="search-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
              <input
                className="search-input"
                placeholder="Filter by code or URL..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
              {filter && (
                <button 
                  className="clear-search"
                  onClick={() => setFilter('')}
                >
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {selectedRows.size > 0 && (
          <div className="bulk-actions">
            <div className="bulk-info">
              <span>{selectedRows.size} selected</span>
            </div>
            <select 
              className="bulk-select"
              value={bulkAction}
              onChange={(e) => setBulkAction(e.target.value)}
            >
              <option value="">Bulk actions...</option>
              <option value="delete">Delete selected</option>
            </select>
            <button 
              className="bulk-apply"
              onClick={handleBulkAction}
              disabled={!bulkAction}
            >
              Apply
            </button>
            <button 
              className="bulk-clear"
              onClick={() => setSelectedRows(new Set())}
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {links.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <h3>No links created yet</h3>
          <p>Create your first short link to get started</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3>No results found</h3>
          <p>Try adjusting your search filter</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="advanced-table">
            <thead>
              <tr>
                <th className="select-column">
                  <input
                    type="checkbox"
                    checked={selectedRows.size === filtered.length && filtered.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th 
                  className={`sortable ${sortConfig.key === 'code' ? 'sorted' : ''}`}
                  onClick={() => handleSort('code')}
                >
                  Short Code
                  {sortConfig.key === 'code' && (
                    <span className="sort-indicator">
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                <th>Target URL</th>
                <th 
                  className={`sortable ${sortConfig.key === 'total_clicks' ? 'sorted' : ''}`}
                  onClick={() => handleSort('total_clicks')}
                >
                  Clicks
                  {sortConfig.key === 'total_clicks' && (
                    <span className="sort-indicator">
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                <th 
                  className={`sortable ${sortConfig.key === 'last_clicked' ? 'sorted' : ''}`}
                  onClick={() => handleSort('last_clicked')}
                >
                  Last Clicked
                  {sortConfig.key === 'last_clicked' && (
                    <span className="sort-indicator">
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((link, index) => {
                const shortUrl = `${baseUrl}/${link.code}`;
                const isSelected = selectedRows.has(link.code);
                
                return (
                  <tr 
                    key={link.code} 
                    className={isSelected ? 'selected' : ''}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <td className="select-column">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleRowSelect(link.code)}
                      />
                    </td>
                    <td>
                      <div className="code-cell">
                        <span className="code-badge">{link.code}</span>
                        <button
                          className="copy-btn-small"
                          onClick={() => handleCopy(shortUrl, link.code)}
                          title="Copy short URL"
                        >
                          {copyingCode === link.code ? (
                            <svg className="check-icon" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg className="copy-icon" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                              <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </td>
                    <td>
                      <a
                        href={shortUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="url-link"
                        title={link.url}
                      >
                        {link.url}
                      </a>
                    </td>
                    <td>
                      <div className="clicks-cell">
                        <span className="clicks-count">{link.total_clicks ?? 0}</span>
                        {link.total_clicks > 0 && (
                          <div className="clicks-bar">
                            <div 
                              className="clicks-fill"
                              style={{ 
                                width: `${Math.min((link.total_clicks / Math.max(...filtered.map(l => l.total_clicks || 1))) * 100, 100)}%` 
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className="date-cell">{formatDate(link.last_clicked)}</span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn copy-btn"
                          onClick={() => handleCopy(shortUrl, link.code)}
                        >
                          {copyingCode === link.code ? (
                            <>
                              <svg className="btn-icon" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              Copied!
                            </>
                          ) : (
                            <>
                              <svg className="btn-icon" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                              </svg>
                              Copy
                            </>
                          )}
                        </button>
                        <Link
                          to={`/code/${link.code}`}
                          className="action-btn stats-btn"
                        >
                          <svg className="btn-icon" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                          </svg>
                          Stats
                        </Link>
                        <button
                          className="action-btn delete-btn"
                          onClick={() => onDelete(link.code)}
                        >
                          <svg className="btn-icon" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <style>{`
        .advanced-card {
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          overflow: hidden;
        }

        .card-header {
          padding: 2rem 2rem 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .header-content {
          display: flex;
          justify-content: between;
          align-items: flex-start;
          gap: 2rem;
        }

        .title-section {
          flex: 1;
        }

        .card-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: white;
          margin: 0 0 0.5rem 0;
          background: linear-gradient(135deg, #fff 0%, #a5b4fc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .card-subtitle {
          color: rgba(255, 255, 255, 0.7);
          margin: 0;
        }

        .header-actions {
          min-width: 300px;
        }

        .search-wrapper {
          position: relative;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          width: 1.25rem;
          height: 1.25rem;
          color: rgba(255, 255, 255, 0.5);
        }

        .search-input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 3rem;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          color: white;
          font-size: 0.95rem;
          transition: all 0.3s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: #a5b4fc;
          box-shadow: 0 0 0 3px rgba(165, 180, 252, 0.1);
        }

        .clear-search {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.5);
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 4px;
          transition: all 0.2s ease;
        }

        .clear-search:hover {
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.8);
        }

        .clear-search svg {
          width: 1rem;
          height: 1rem;
        }

        .bulk-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 0 0;
          margin-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .bulk-info {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.9rem;
        }

        .bulk-select {
          padding: 0.5rem 1rem;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          color: white;
          font-size: 0.9rem;
        }

        .bulk-apply, .bulk-clear {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 8px;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .bulk-apply {
          background: #ef4444;
          color: white;
        }

        .bulk-apply:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .bulk-clear {
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.8);
        }

        .empty-state {
          padding: 4rem 2rem;
          text-align: center;
          color: rgba(255, 255, 255, 0.7);
        }

        .empty-icon {
          width: 64px;
          height: 64px;
          margin: 0 auto 1.5rem;
          color: rgba(255, 255, 255, 0.3);
        }

        .empty-icon svg {
          width: 100%;
          height: 100%;
        }

        .empty-state h3 {
          color: white;
          margin: 0 0 0.5rem 0;
          font-size: 1.25rem;
        }

        .table-container {
          overflow-x: auto;
        }

        .advanced-table {
          width: 100%;
          border-collapse: collapse;
        }

        .advanced-table th {
          padding: 1rem 1.5rem;
          text-align: left;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.9);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.05);
          user-select: none;
        }

        .advanced-table td {
          padding: 1rem 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          color: rgba(255, 255, 255, 0.8);
        }

        .advanced-table tr {
          transition: all 0.2s ease;
          animation: slideIn 0.3s ease-out both;
        }

        .advanced-table tr:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .advanced-table tr.selected {
          background: rgba(59, 130, 246, 0.1);
          border-left: 3px solid #3b82f6;
        }

        .select-column {
          width: 40px;
          text-align: center;
        }

        .select-column input {
          accent-color: #a5b4fc;
        }

        .sortable {
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
        }

        .sortable:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .sortable.sorted {
          color: #a5b4fc;
        }

        .sort-indicator {
          margin-left: 0.5rem;
          font-weight: bold;
        }

        .code-cell {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .code-badge {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.85rem;
          font-family: 'Monaco', 'Consolas', monospace;
        }

        .copy-btn-small {
          background: rgba(255, 255, 255, 0.1);
          border: none;
          border-radius: 6px;
          padding: 0.25rem;
          cursor: pointer;
          transition: all 0.2s ease;
          opacity: 0;
        }

        .code-cell:hover .copy-btn-small {
          opacity: 1;
        }

        .copy-btn-small:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .copy-icon, .check-icon {
          width: 0.875rem;
          height: 0.875rem;
        }

        .check-icon {
          color: #10b981;
        }

        .url-link {
          color: rgba(255, 255, 255, 0.9);
          text-decoration: none;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          line-height: 1.4;
          transition: color 0.2s ease;
        }

        .url-link:hover {
          color: #a5b4fc;
        }

        .clicks-cell {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .clicks-count {
          font-weight: 600;
          color: white;
          min-width: 2rem;
        }

        .clicks-bar {
          flex: 1;
          height: 4px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
          overflow: hidden;
          max-width: 80px;
        }

        .clicks-fill {
          height: 100%;
          background: linear-gradient(90deg, #10b981, #34d399);
          border-radius: 2px;
          transition: width 0.5s ease;
        }

        .date-cell {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.7);
        }

        .action-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.75rem;
          border: none;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          text-decoration: none;
        }

        .btn-icon {
          width: 1rem;
          height: 1rem;
        }

        .copy-btn {
          background: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
          border: 1px solid rgba(59, 130, 246, 0.2);
        }

        .copy-btn:hover {
          background: rgba(59, 130, 246, 0.2);
        }

        .stats-btn {
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.2);
        }

        .stats-btn:hover {
          background: rgba(16, 185, 129, 0.2);
        }

        .delete-btn {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.2);
        }

        .delete-btn:hover {
          background: rgba(239, 68, 68, 0.2);
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            gap: 1rem;
          }
          
          .header-actions {
            min-width: auto;
            width: 100%;
          }

          .action-buttons {
            flex-direction: column;
          }

          .advanced-table {
            font-size: 0.875rem;
          }

          .advanced-table th,
          .advanced-table td {
            padding: 0.75rem 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}