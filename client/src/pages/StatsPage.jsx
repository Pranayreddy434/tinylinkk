
import React, { useEffect, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { fetchLinkStats } from '../api';

export default function StatsPage() {
  const { code } = useParams();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError('');
      setNotFound(false);

      try {
        const data = await fetchLinkStats(code);
        if (!mounted) return;
        setStats(data);
      } catch (err) {
        if (!mounted) return;
        if (err.status === 404) {
          setNotFound(true);
        } else {
          setError('Failed to load stats. Please try again.');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [code]);

  const baseUrl = window.location.origin;
  const shortUrl = `${baseUrl}/${code}`;

  function formatDate(value) {
    if (!value) return '—';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '—';
    return d.toLocaleString();
  }

  if (loading) {
    return (
      <div className="stats-container">
        <div className="loading-stats">
          <div className="loading-spinner-large"></div>
          <h3>Loading Statistics...</h3>
          <p>Fetching data for /{code}</p>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="stats-container">
        <div className="not-found-card">
          <div className="not-found-icon">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h2>Link Not Found</h2>
          <p>No link exists for code <strong>{code}</strong></p>
          <RouterLink to="/" className="back-btn">
            Back to Dashboard
          </RouterLink>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="stats-container">
        <div className="error-stats">
          <div className="error-icon-large">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h3>Error Loading Stats</h3>
          <p>{error}</p>
          <RouterLink to="/" className="back-btn">
            Back to Dashboard
          </RouterLink>
        </div>
      </div>
    );
  }

  return (
    <div className="stats-container">
      {/* Background Elements */}
      <div className="stats-bg">
        <div className="bg-pulse bg-pulse-1"></div>
        <div className="bg-pulse bg-pulse-2"></div>
        <div className="bg-waves"></div>
      </div>

      <div className="stats-card">
        <div className="stats-header">
          <div className="header-main">
            <h1 className="stats-title">
              /{stats.code}
              <span className="stats-badge">Active</span>
            </h1>
            <p className="stats-subtitle">{shortUrl}</p>
          </div>
          <RouterLink to="/" className="back-btn">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back
          </RouterLink>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon clicks">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.total_clicks ?? 0}</div>
              <div className="stat-label">Total Clicks</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon recent">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">{formatDate(stats.last_clicked)}</div>
              <div className="stat-label">Last Clicked</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon created">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">{formatDate(stats.created_at)}</div>
              <div className="stat-label">Created At</div>
            </div>
          </div>
        </div>

        <div className="target-url-section">
          <h3 className="section-title">Target URL</h3>
          <a href={shortUrl} target="_blank" rel="noreferrer" className="target-url">
            {stats.url}
          </a>
        </div>

        {stats.total_clicks > 0 && (
          <div className="activity-section">
            <h3 className="section-title">Activity Overview</h3>
            <div className="activity-chart">
              <div className="chart-bar" style={{ height: '100%' }}>
                <div 
                  className="chart-fill"
                  style={{ height: `${Math.min(100, (stats.total_clicks / 100) * 100)}%` }}
                ></div>
              </div>
              <div className="chart-labels">
                <span>Low</span>
                <span>Medium</span>
                <span>High</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .stats-container {
          min-height: 100vh;
          padding: 2rem 1rem;
          position: relative;
        }

        .stats-bg {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: -1;
          pointer-events: none;
        }

        .bg-pulse {
          position: absolute;
          border-radius: 50%;
          background: conic-gradient(from 45deg, #667eea, #764ba2, #667eea);
          animation: pulse 4s ease-in-out infinite;
          opacity: 0.1;
        }

        .bg-pulse-1 {
          width: 200px;
          height: 200px;
          top: 20%;
          right: 10%;
          animation-delay: 0s;
        }

        .bg-pulse-2 {
          width: 150px;
          height: 150px;
          bottom: 20%;
          left: 10%;
          background: conic-gradient(from 135deg, #f093fb, #f5576c, #f093fb);
          animation-delay: 2s;
        }

        .bg-waves {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 30% 30%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 70% 70%, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.1; }
          50% { transform: scale(1.1); opacity: 0.15; }
        }

        .loading-stats,
        .not-found-card,
        .error-stats {
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 4rem 2rem;
          text-align: center;
          max-width: 500px;
          margin: 2rem auto;
          color: rgba(255, 255, 255, 0.8);
        }

        .loading-spinner-large {
          width: 64px;
          height: 64px;
          border: 4px solid rgba(255, 255, 255, 0.1);
          border-left: 4px solid #a5b4fc;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 2rem;
        }

        .not-found-icon,
        .error-icon-large {
          width: 80px;
          height: 80px;
          color: #f87171;
          margin: 0 auto 1.5rem;
        }

        .not-found-card h2,
        .error-stats h3 {
          color: white;
          margin: 0 0 1rem 0;
        }

        .stats-card {
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 2.5rem;
          max-width: 800px;
          margin: 0 auto;
          box-shadow: 
            0 25px 50px -12px rgba(0, 0, 0, 0.5),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        .stats-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 3rem;
          gap: 2rem;
        }

        .header-main {
          flex: 1;
        }

        .stats-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: white;
          margin: 0 0 0.5rem 0;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .stats-badge {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .stats-subtitle {
          color: rgba(255, 255, 255, 0.7);
          margin: 0;
          font-size: 1.1rem;
        }

        .back-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.9);
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.3s ease;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .back-btn:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
        }

        .back-btn svg {
          width: 1.25rem;
          height: 1.25rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          background: rgba(255, 255, 255, 0.08);
          transform: translateY(-4px);
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .stat-icon.clicks {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
        }

        .stat-icon.recent {
          background: linear-gradient(135deg, #8b5cf6, #7c3aed);
        }

        .stat-icon.created {
          background: linear-gradient(135deg, #10b981, #059669);
        }

        .stat-icon svg {
          width: 24px;
          height: 24px;
          color: white;
        }

        .stat-content {
          flex: 1;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: white;
          margin-bottom: 0.25rem;
        }

        .stat-label {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .target-url-section,
        .activity-section {
          margin-bottom: 2rem;
        }

        .section-title {
          color: white;
          font-size: 1.25rem;
          margin: 0 0 1rem 0;
          font-weight: 600;
        }

        .target-url {
          display: block;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 1rem 1.25rem;
          color: rgba(255, 255, 255, 0.9);
          text-decoration: none;
          word-break: break-all;
          transition: all 0.3s ease;
        }

        .target-url:hover {
          background: rgba(255, 255, 255, 0.08);
          color: #a5b4fc;
        }

        .activity-chart {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 1.5rem;
          display: flex;
          align-items: flex-end;
          gap: 1rem;
          height: 120px;
        }

        .chart-bar {
          flex: 1;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          position: relative;
          overflow: hidden;
          min-height: 40px;
        }

        .chart-fill {
          background: linear-gradient(to top, #3b82f6, #8b5cf6);
          border-radius: 8px;
          transition: height 1s ease;
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
        }

        .chart-labels {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.875rem;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .stats-container {
            padding: 1rem 0.5rem;
          }

          .stats-card {
            padding: 1.5rem;
          }

          .stats-header {
            flex-direction: column;
            align-items: stretch;
          }

          .stats-title {
            font-size: 2rem;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .back-btn {
            align-self: flex-start;
          }
        }
      `}</style>
    </div>
  );
}