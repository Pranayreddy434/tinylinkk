
import React, { useState } from 'react';
import { createLink } from '../api';

const CODE_REGEX = /^[A-Za-z0-9]{6,8}$/;

export default function LinkForm({ onCreated }) {
  const [url, setUrl] = useState('');
  const [code, setCode] = useState('');
  const [urlError, setUrlError] = useState('');
  const [codeError, setCodeError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [apiError, setApiError] = useState('');

  function validate() {
    let valid = true;
    setUrlError('');
    setCodeError('');
    setApiError('');
    setSuccessMsg('');

    if (!url.trim()) {
      setUrlError('URL is required');
      valid = false;
    } else {
      try {
        const u = new URL(url.trim());
        if (!['http:', 'https:'].includes(u.protocol)) {
          setUrlError('URL must start with http:// or https://');
          valid = false;
        }
      } catch {
        setUrlError('Please enter a valid URL');
        valid = false;
      }
    }

    if (code.trim()) {
      if (!CODE_REGEX.test(code.trim())) {
        setCodeError('Code must be 6–8 characters [A-Za-z0-9]');
        valid = false;
      }
    }

    return valid;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const result = await createLink({ url: url.trim(), code: code.trim() || undefined });
      setSuccessMsg(`Created: ${result.shortUrl}`);
      setUrl('');
      setCode('');
      if (onCreated) onCreated(result);
    } catch (err) {
      if (err.status === 409) {
        setCodeError('That short code is already taken');
      } else {
        setApiError(err.message || 'Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="link-form-container">
      {/* Background Images */}
      <div className="background-images">
        <div className="bg-circle bg-circle-1"></div>
        <div className="bg-circle bg-circle-2"></div>
        <div className="bg-circle bg-circle-3"></div>
        <div className="bg-shape bg-shape-1"></div>
        <div className="bg-shape bg-shape-2"></div>
        <div className="bg-pattern"></div>
      </div>

      <form onSubmit={handleSubmit} className="link-form">
        <div className="form-header">
          <div className="header-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <h2 className="form-title">Shorten Your URL</h2>
          <p className="form-subtitle">Create custom short links in seconds</p>
        </div>

        <div className="form-content">
          <div className="input-group">
            <div className="input-wrapper">
              <label htmlFor="url" className="input-label">
                <svg className="label-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                </svg>
                Destination URL *
              </label>
              <input
                id="url"
                className={`input-field ${urlError ? 'input-error' : ''}`}
                type="url"
                placeholder="https://example.com/very/long/url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              {urlError && (
                <div className="error-message">
                  <svg className="error-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {urlError}
                </div>
              )}
            </div>

            <div className="input-wrapper">
              <label htmlFor="code" className="input-label">
                <svg className="label-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
                Custom Code
                <span className="optional-badge">Optional</span>
              </label>
              <input
                id="code"
                className={`input-field ${codeError ? 'input-error' : ''}`}
                type="text"
                placeholder="Enter 6-8 characters"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              {codeError && (
                <div className="error-message">
                  <svg className="error-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {codeError}
                </div>
              )}
            </div>
          </div>

          <button 
            type="submit" 
            className={`submit-button ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="spinner" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                </svg>
                Creating Short Link...
              </>
            ) : (
              <>
                <svg className="button-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Shorten URL
              </>
            )}
          </button>
        </div>

        {apiError && (
          <div className="api-error">
            <svg className="api-error-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {apiError}
          </div>
        )}

        {successMsg && (
          <div className="success-message">
            <svg className="success-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div>
              <strong>Success!</strong>
              <div className="success-url">{successMsg.replace('Created: ', '')}</div>
            </div>
          </div>
        )}
      </form>

      <style >{`
        .link-form-container {
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
          padding: 0 1rem;
          position: relative;
          overflow: hidden;
        }

        .background-images {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: -1;
          opacity: 0.15;
        }

        .bg-circle {
          position: absolute;
          border-radius: 50%;
          background: conic-gradient(from 45deg, #667eea, #764ba2, #667eea);
          animation: float 6s ease-in-out infinite;
        }

        .bg-circle-1 {
          width: 120px;
          height: 120px;
          top: -40px;
          right: -40px;
          animation-delay: 0s;
        }

        .bg-circle-2 {
          width: 80px;
          height: 80px;
          bottom: 60px;
          left: -20px;
          background: conic-gradient(from 135deg, #f093fb, #f5576c, #f093fb);
          animation-delay: 2s;
        }

        .bg-circle-3 {
          width: 60px;
          height: 60px;
          top: 50%;
          right: 30%;
          background: conic-gradient(from 270deg, #4facfe, #00f2fe, #4facfe);
          animation-delay: 4s;
        }

        .bg-shape {
          position: absolute;
          background: linear-gradient(45deg, transparent 40%, #667eea, transparent 60%);
          animation: float 8s ease-in-out infinite;
        }

        .bg-shape-1 {
          width: 100px;
          height: 100px;
          top: 20%;
          left: 10%;
          clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
          animation-delay: 1s;
        }

        .bg-shape-2 {
          width: 80px;
          height: 80px;
          bottom: 20%;
          right: 10%;
          clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
          transform: rotate(45deg);
          animation-delay: 3s;
        }

        .bg-pattern {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            radial-gradient(circle at 25% 25%, rgba(120, 119, 198, 0.3) 2px, transparent 2px),
            radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
          background-size: 50px 50px, 30px 30px;
          background-position: 0 0, 25px 25px;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }

        .link-form {
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 2.5rem;
          box-shadow: 
            0 25px 50px -12px rgba(0, 0, 0, 0.5),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          position: relative;
          overflow: hidden;
        }

        .link-form::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        }

        .form-header {
          text-align: center;
          margin-bottom: 2.5rem;
          position: relative;
        }

        .header-icon {
          width: 64px;
          height: 64px;
          margin: 0 auto 1.5rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 32px rgba(102, 126, 234, 0.4);
        }

        .header-icon svg {
          width: 32px;
          height: 32px;
          color: white;
        }

        .form-title {
          font-size: 2rem;
          font-weight: 700;
          color: white;
          margin: 0 0 0.5rem 0;
          line-height: 1.2;
          background: linear-gradient(135deg, #fff 0%, #a5b4fc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .form-subtitle {
          color: rgba(255, 255, 255, 0.7);
          font-size: 1.1rem;
          margin: 0;
          font-weight: 400;
        }

        .form-content {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .input-group {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }

        @media (min-width: 640px) {
          .input-group {
            grid-template-columns: 2fr 1fr;
          }
        }

        .input-wrapper {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .input-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.9);
          font-size: 0.95rem;
        }

        .label-icon {
          width: 1rem;
          height: 1rem;
          color: #a5b4fc;
        }

        .optional-badge {
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.7);
          padding: 0.2rem 0.6rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 500;
          margin-left: auto;
        }

        .input-field {
          width: 100%;
          padding: 1rem 1.25rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          background: rgba(15, 23, 42, 0.6);
          color: white;
          font-size: 1rem;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .input-field::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .input-field:focus {
          outline: none;
          border-color: #a5b4fc;
          background: rgba(15, 23, 42, 0.8);
          box-shadow: 0 0 0 3px rgba(165, 180, 252, 0.1);
        }

        .input-field.input-error {
          border-color: #f87171;
          background: rgba(248, 113, 113, 0.05);
        }

        .error-message {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #f87171;
          font-size: 0.875rem;
          font-weight: 500;
          margin-top: 0.25rem;
        }

        .error-icon {
          width: 1rem;
          height: 1rem;
          flex-shrink: 0;
        }

        .submit-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          width: 100%;
          padding: 1.25rem 2rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
          position: relative;
          overflow: hidden;
        }

        .submit-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }

        .submit-button:hover:not(:disabled)::before {
          left: 100%;
        }

        .submit-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6);
        }

        .submit-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .submit-button.loading {
          background: linear-gradient(135deg, #4b5563, #374151);
        }

        .button-icon {
          width: 1.25rem;
          height: 1.25rem;
        }

        .spinner {
          width: 1.25rem;
          height: 1.25rem;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .api-error {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.25rem;
          background: rgba(248, 113, 113, 0.1);
          border: 1px solid rgba(248, 113, 113, 0.3);
          border-radius: 12px;
          color: #f87171;
          margin-top: 1.5rem;
          backdrop-filter: blur(10px);
        }

        .api-error-icon {
          width: 1.25rem;
          height: 1.25rem;
          flex-shrink: 0;
        }

        .success-message {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1.25rem;
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.3);
          border-radius: 12px;
          color: #4ade80;
          margin-top: 1.5rem;
          backdrop-filter: blur(10px);
        }

        .success-icon {
          width: 1.5rem;
          height: 1.5rem;
          flex-shrink: 0;
        }

        .success-url {
          font-family: 'Monaco', 'Consolas', monospace;
          font-size: 0.9rem;
          margin-top: 0.25rem;
          color: white;
          word-break: break-all;
        }
      `}</style>
    </div>
  );
}