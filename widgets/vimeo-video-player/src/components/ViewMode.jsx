/**
 * ViewMode Component - Vimeo Video Player Widget
 * Displays videos in a responsive grid with modal playback
 */

import React, { useState, useEffect } from 'react';
import VideoCard from './shared/VideoCard';
import VideoModal from './shared/VideoModal';
import { LoadingState, ErrorState, EmptyState } from './shared/LoadingState';
import { parseVimeoUrl, fetchVimeoMetadata } from '../services/vimeoApi';
import { fetchImpartnerData } from '../services/impartnerApi';
import '../styles/view.css';

const ViewMode = (props) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      setLoading(true);
      setError(null);

      let videoData = [];

      // Check if videos are provided via data attribute
      if (props.videos) {
        videoData = typeof props.videos === 'string' 
          ? JSON.parse(props.videos) 
          : props.videos;
      } 
      // Check if API endpoint is provided
      else if (props.apiEndpoint) {
        const response = await fetchImpartnerData(props.apiEndpoint);
        videoData = response.data || response;
      }
      // Fallback to demo data
      else {
        videoData = getDemoVideos();
      }

      // Process videos to extract Vimeo IDs and fetch metadata
      const processedVideos = await Promise.all(
        videoData.map(async (video) => {
          const { videoId, hash } = parseVimeoUrl(video.url || video.vimeoUrl);
          
          // Try to fetch metadata if thumbnail not provided
          let metadata = {};
          if (!video.thumbnail && videoId) {
            try {
              const vimeoUrl = hash 
                ? `https://vimeo.com/${videoId}/${hash}`
                : `https://vimeo.com/${videoId}`;
              metadata = await fetchVimeoMetadata(vimeoUrl) || {};
            } catch (err) {
              console.warn('Could not fetch metadata for video:', videoId);
            }
          }

          return {
            id: video.id || videoId,
            videoId,
            hash,
            title: video.title || metadata.title || `Video ${videoId}`,
            description: video.description || metadata.description || '',
            thumbnail: video.thumbnail || metadata.thumbnail || null,
            duration: video.duration || metadata.duration || null,
            category: video.category || '',
            tags: video.tags || []
          };
        })
      );

      setVideos(processedVideos.filter(v => v.videoId));
      setError(null);
    } catch (err) {
      console.error('Error loading videos:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
  };

  const handleCloseModal = () => {
    setSelectedVideo(null);
  };

  // Demo data for testing
  const getDemoVideos = () => {
    return [
      {
        id: 'demo1',
        url: 'https://vimeo.com/76979871',
        title: 'Sample Vimeo Video',
        description: 'This is a demo video for testing the widget',
        category: 'Demo'
      }
    ];
  };

  if (loading) {
    return <LoadingState message="Loading videos..." />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={loadVideos} />;
  }

  if (videos.length === 0) {
    return <EmptyState message="No videos available" icon="🎬" />;
  }

  return (
    <div className="vimeo-widget-container">
      <div className="vimeo-widget-header">
        <h3 className="widget-title">
          {props.title || 'Video Library'}
        </h3>
        <button 
          onClick={loadVideos} 
          className="refresh-btn"
          aria-label="Refresh videos"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
          </svg>
          Refresh
        </button>
      </div>

      <div className="video-grid">
        {videos.map((video) => (
          <VideoCard 
            key={video.id}
            video={video}
            onClick={handleVideoClick}
          />
        ))}
      </div>

      {selectedVideo && (
        <VideoModal 
          video={selectedVideo}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default ViewMode;
