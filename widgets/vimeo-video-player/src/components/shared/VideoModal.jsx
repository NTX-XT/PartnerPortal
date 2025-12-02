/**
 * VideoModal Component
 * Displays a Vimeo video in a modal overlay with branded header
 */

import React, { useEffect, useRef } from 'react';
import { buildVimeoEmbedUrl } from '../../services/vimeoApi';

const VideoModal = ({ video, onClose }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    // Prevent body scrolling when modal is open
    document.body.style.overflow = 'hidden';

    // Handle escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === modalRef.current) {
      onClose();
    }
  };

  if (!video) return null;

  const embedUrl = buildVimeoEmbedUrl(video.videoId, video.hash, {
    autoplay: true,
    title: true,
    byline: true,
    portrait: false
  });

  return (
    <div 
      className="video-modal-container"
      ref={modalRef}
      onClick={handleBackdropClick}
    >
      <div className="video-modal-content">
        <div className="video-modal-header">
          <div className="video-modal-branding">
            <svg 
              width="28" 
              height="28" 
              viewBox="0 0 24 24" 
              fill="white"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M23 7l-7 5 7 5V7z"/>
              <rect x="1" y="5" width="15" height="14" rx="2" fill="white"/>
            </svg>
            <span className="video-modal-title">Video Player</span>
          </div>
          
          <button 
            className="video-modal-close"
            onClick={onClose}
            aria-label="Close video"
          >
            ×
          </button>
        </div>
        
        <div className="video-modal-player">
          <iframe
            src={embedUrl}
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title={video.title}
          />
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
