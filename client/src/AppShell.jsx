import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function AppShell({ children }) {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="app">
      {/* Animated Background Elements */}
      <div className="background-elements">
        <div className="bg-orb bg-orb-1"></div>
        <div className="bg-orb bg-orb-2"></div>
        <div className="bg-orb bg-orb-3"></div>
        <div className="bg-grid"></div>
        <div className="bg-shine"></div>
      </div>

      <header className={`app-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="header-container">
          <Link to="/" className="logo">
            <div className="logo-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <span className="logo-text">TinyLink</span>
            <div className="logo-pulse"></div>
          </Link>
          
          <nav className="nav">
            <Link
              to="/"
              className={
                location.pathname === '/' ? 'nav-link active' : 'nav-link'
              }
            >
              <span className="nav-icon">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
              </span>
              <span className="nav-text">Dashboard</span>
              <div className="nav-glow"></div>
            </Link>
          </nav>
        </div>
        
        {/* Header Background Effect */}
        <div className="header-backdrop"></div>
      </header>

      <main className="app-main">
        <div className="main-content">
          {children}
        </div>
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-text">
            <span>TinyLink &copy; {new Date().getFullYear()}</span>
            <span className="footer-separator">•</span>
            <span>Shorten URLs in style</span>
          </div>
          <div className="footer-links">
            <div className="footer-wave"></div>
          </div>
        </div>
        <div className="footer-backdrop"></div>
      </footer>

      <style>{`
        .app {
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
        }

        /* Background Elements */
        .background-elements {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: -1;
          pointer-events: none;
        }

        .bg-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          opacity: 0.15;
          animation: float 8s ease-in-out infinite;
        }

        .bg-orb-1 {
          width: 300px;
          height: 300px;
          top: 10%;
          left: 5%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          animation-delay: 0s;
        }

        .bg-orb-2 {
          width: 200px;
          height: 200px;
          top: 60%;
          right: 10%;
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          animation-delay: 2s;
        }

        .bg-orb-3 {
          width: 150px;
          height: 150px;
          bottom: 20%;
          left: 15%;
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          animation-delay: 4s;
        }

        .bg-grid {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            linear-gradient(rgba(99, 102, 241, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.05) 1px, transparent 1px);
          background-size: 50px 50px;
          mask-image: radial-gradient(ellipse at center, black 40%, transparent 80%);
        }

        .bg-shine {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.03),
            transparent
          );
          animation: shine 8s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-20px) rotate(120deg);
          }
          66% {
            transform: translateY(10px) rotate(240deg);
          }
        }

        @keyframes shine {
          0% {
            left: -100%;
          }
          50% {
            left: 100%;
          }
          100% {
            left: 100%;
          }
        }

        /* Header Styles */
        .app-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .app-header.scrolled {
          background: rgba(15, 23, 42, 0.95);
          backdrop-filter: blur(30px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          border-bottom-color: rgba(255, 255, 255, 0.15);
        }

        .header-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-backdrop {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            135deg,
            rgba(102, 126, 234, 0.1) 0%,
            transparent 50%,
            rgba(118, 75, 162, 0.1) 100%
          );
          z-index: -1;
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .app-header:hover .header-backdrop {
          opacity: 1;
        }

        /* Logo Styles */
        .logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
          position: relative;
          padding: 0.5rem;
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .logo:hover {
          transform: translateY(-2px);
        }

        .logo-icon {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
          animation: icon-float 3s ease-in-out infinite;
        }

        .logo-icon svg {
          width: 18px;
          height: 18px;
          color: white;
        }

        .logo-text {
          font-size: 1.5rem;
          font-weight: 800;
          background: linear-gradient(135deg, #fff 0%, #a5b4fc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.025em;
        }

        .logo-pulse {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(102, 126, 234, 0.3);
          animation: logo-pulse 2s ease-out infinite;
        }

        @keyframes icon-float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-4px);
          }
        }

        @keyframes logo-pulse {
          0% {
            width: 0;
            height: 0;
            opacity: 1;
          }
          100% {
            width: 80px;
            height: 80px;
            opacity: 0;
          }
        }

        /* Navigation Styles */
        .nav {
          display: flex;
          align-items: center;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
          color: rgba(255, 255, 255, 0.7);
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          font-weight: 500;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .nav-link:hover {
          color: rgba(255, 255, 255, 0.9);
          background: rgba(255, 255, 255, 0.05);
          transform: translateY(-2px);
        }

        .nav-link.active {
          color: white;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2));
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .nav-icon {
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .nav-icon svg {
          width: 100%;
          height: 100%;
        }

        .nav-glow {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          transition: left 0.6s ease;
        }

        .nav-link:hover .nav-glow {
          left: 100%;
        }

        /* Main Content Styles */
        .app-main {
          padding-top: 80px;
          min-height: calc(100vh - 160px);
        }

        .main-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          animation: content-appear 0.6s ease-out;
        }

        @keyframes content-appear {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Footer Styles */
        .app-footer {
          position: relative;
          background: rgba(15, 23, 42, 0.9);
          backdrop-filter: blur(20px);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          overflow: hidden;
        }

        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          z-index: 2;
        }

        .footer-text {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.95rem;
        }

        .footer-separator {
          color: rgba(255, 255, 255, 0.3);
        }

        .footer-links {
          position: relative;
        }

        .footer-wave {
          width: 100px;
          height: 20px;
          background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.3), transparent);
          border-radius: 50%;
          animation: wave 3s ease-in-out infinite;
        }

        .footer-backdrop {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            135deg,
            transparent 0%,
            rgba(102, 126, 234, 0.05) 50%,
            transparent 100%
          );
          z-index: 1;
        }

        @keyframes wave {
          0%, 100% {
            transform: scaleX(1);
            opacity: 0.5;
          }
          50% {
            transform: scaleX(1.2);
            opacity: 1;
          }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .header-container {
            padding: 1rem;
          }

          .main-content {
            padding: 1rem;
          }

          .footer-content {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }

          .logo-text {
            font-size: 1.25rem;
          }

          .nav-link {
            padding: 0.5rem 1rem;
          }

          .bg-orb {
            filter: blur(40px);
          }

          .bg-orb-1 {
            width: 200px;
            height: 200px;
          }

          .bg-orb-2 {
            width: 150px;
            height: 150px;
          }

          .bg-orb-3 {
            width: 100px;
            height: 100px;
          }
        }

        @media (max-width: 480px) {
          .header-container {
            flex-direction: column;
            gap: 1rem;
          }

          .logo {
            justify-content: center;
          }

          .nav-link .nav-text {
            display: none;
          }

          .nav-link {
            padding: 0.75rem;
          }

          .nav-icon {
            width: 24px;
            height: 24px;
          }
        }
      `}</style>
    </div>
  );
}