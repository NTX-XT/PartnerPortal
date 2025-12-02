/**
 * VideoCard Component
 * Displays a single video as a card with thumbnail and play button
 */

import React from 'react';

const VideoCard = ({ video, onClick }) => {
  const handleClick = () => {
    onClick(video);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(video);
    }
  };

  return (
    <div 
      className="video-card"
      onClick={handleClick}
      onKeyPress={handleKeyPress}
      tabIndex={0}
      role="button"
      aria-label={`Play video: ${video.title}`}
    >
      <div className="video-thumbnail">
        {video.thumbnail ? (
          <img 
            src={video.thumbnail} 
            alt={video.title}
            loading="lazy"
          />
        ) : (
          <div className="thumbnail-placeholder">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="currentColor"
              width="48"
              height="48"
            >
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        )}
        
        <div className="play-overlay">
          <div className="play-button">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="white"
              width="48"
              height="48"
            >
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
      </div>
      
      <div className="video-info">
        <h3 className="video-title">{video.title}</h3>
        {video.description && (
          <p className="video-description">{video.description}</p>
        )}
        {video.duration && (
          <span className="video-duration">{formatDuration(video.duration)}</span>
        )}
      </div>
    </div>
  );
};

// Helper function to format duration
function formatDuration(seconds) {
  if (!seconds) return '';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

export default VideoCard;
