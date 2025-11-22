// client/src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { fetchLinks, deleteLink } from '../api';
import LinkForm from '../components/LinkForm';
import LinksTable from '../components/LinksTable';

export default function Dashboard() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  async function load() {
    setLoading(true);
    setLoadError('');
    try {
      const data = await fetchLinks();
      setLinks(data);
    } catch (err) {
      setLoadError('Failed to load links. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(code) {
    try {
      await deleteLink(code);
      setLinks((prev) => prev.filter((l) => l.code !== code));
    } catch (err) {
      alert('Failed to delete link');
    }
  }

  function handleCreated(newLink) {
    setLinks((prev) => [{
      code: newLink.code,
      url: newLink.url,
      total_clicks: newLink.total_clicks,
      last_clicked: newLink.last_clicked,
      created_at: new Date().toISOString(), // or you can add created_at in POST response later
      shortUrl: newLink.shortUrl,           // ✅ IMPORTANT
    }, ...prev]);
  }

  return (
    <div className="dashboard-container">
      {/* Background Elements */}
      <div className="dashboard-bg">
        <div className="bg-floating bg-floating-1"></div>
        <div className="bg-floating bg-floating-2"></div>
        <div className="bg-floating bg-floating-3"></div>
        <div className="bg-network"></div>
      </div>

      <div className="dashboard-content">
        <div className="welcome-section">
          <h1 className="welcome-title">URL Shortener</h1>
          <p className="welcome-subtitle">
            Create short, memorable links and track their performance
          </p>
        </div>

        <LinkForm onCreated={handleCreated} />

        {loading ? (
          <div className="loading-card">
            <div className="loading-spinner"></div>
            <p>Loading your links...</p>
          </div>
        ) : loadError ? (
          <div className="error-card">
            <div className="error-icon">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="error-content">
              <h3>Failed to Load Links</h3>
              <p>{loadError}</p>
              <button className="retry-btn" onClick={load}>
                Try Again
              </button>
            </div>
          </div>
        ) : (
          <LinksTable links={links} onDelete={handleDelete} />
        )}
      </div>

      <style>{`
        .dashboard-container {
          min-height: 100vh;
          position: relative;
          padding: 2rem 1rem;
        }

        .dashboard-bg {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: -1;
          pointer-events: none;
        }

        .bg-floating {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          opacity: 0.1;
          animation: float 6s ease-in-out infinite;
        }

        .bg-floating-1 {
          width: 300px;
          height: 300px;
          top: 10%;
          left: 10%;
          background: linear-gradient(135deg, #667eea, #764ba2);
          animation-delay: 0s;
        }

        .bg-floating-2 {
          width: 200px;
          height: 200px;
          top: 60%;
          right: 10%;
          background: linear-gradient(135deg, #f093fb, #f5576c);
          animation-delay: 2s;
        }

        .bg-floating-3 {
          width: 150px;
          height: 150px;
          bottom: 20%;
          left: 20%;
          background: linear-gradient(135deg, #4facfe, #00f2fe);
          animation-delay: 4s;
        }

        .bg-network {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            radial-gradient(circle at 25% 25%, rgba(120, 119, 198, 0.1) 2px, transparent 2px),
            radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
          background-size: 50px 50px, 30px 30px;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }

        .dashboard-content {
          max-width: 1200px;
          margin: 0 auto;
        }

        .welcome-section {
          text-align: center;
          margin-bottom: 3rem;
        }

        .welcome-title {
          font-size: 3rem;
          font-weight: 800;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0 0 1rem 0;
        }

        .welcome-subtitle {
          font-size: 1.25rem;
          color: rgba(38, 37, 37, 0.7);
          margin: 0;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .loading-card {
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 3rem 2rem;
          text-align: center;
          color: rgba(255, 255, 255, 0.7);
        }

        .loading-spinner {
          width: 48px;
          height: 48px;
          border: 3px solid rgba(255, 255, 255, 0.1);
          border-left: 3px solid #a5b4fc;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }

        .error-card {
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 24px;
          padding: 2rem;
          display: flex;
          align-items: center;
          gap: 1.5rem;
          color: rgba(255, 255, 255, 0.9);
        }

        .error-icon {
          width: 48px;
          height: 48px;
          color: #f87171;
          flex-shrink: 0;
        }

        .error-icon svg {
          width: 100%;
          height: 100%;
        }

        .error-content {
          flex: 1;
        }

        .error-content h3 {
          margin: 0 0 0.5rem 0;
          color: white;
        }

        .error-content p {
          margin: 0 0 1rem 0;
          color: rgba(255, 255, 255, 0.7);
        }

        .retry-btn {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .retry-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .dashboard-container {
            padding: 1rem 0.5rem;
          }

          .welcome-title {
            font-size: 2rem;
          }

          .welcome-subtitle {
            font-size: 1.1rem;
          }

          .error-card {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}
