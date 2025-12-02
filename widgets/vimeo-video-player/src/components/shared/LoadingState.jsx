/**
 * Loading and Error State Components
 */

import React from 'react';

export const LoadingState = ({ message = 'Loading videos...' }) => (
  <div className="loading-state">
    <div className="loading-spinner"></div>
    <span className="loading-message">{message}</span>
  </div>
);

export const ErrorState = ({ error, onRetry }) => (
  <div className="error-state">
    <div className="error-icon">⚠️</div>
    <h4 className="error-title">Error Loading Videos</h4>
    <p className="error-message">
      {error?.message || 'An unknown error occurred'}
    </p>
    {onRetry && (
      <button onClick={onRetry} className="error-retry-btn">
        Try Again
      </button>
    )}
  </div>
);

export const EmptyState = ({ message = 'No videos available', icon = '🎬' }) => (
  <div className="empty-state">
    <div className="empty-icon">{icon}</div>
    <p className="empty-message">{message}</p>
  </div>
);
