/**
 * Vimeo API Integration Service
 * Handles parsing Vimeo URLs and fetching video metadata
 */

/**
 * Parses a Vimeo URL to extract video ID and hash (if present)
 * @param {string} url - The Vimeo URL
 * @returns {object} - Object with videoId and hash properties
 */
export function parseVimeoUrl(url) {
  if (!url || typeof url !== 'string') {
    return { videoId: null, hash: null };
  }
  
  try {
    // Handle h= parameter format (from embed codes)
    if (url.includes('?h=') || url.includes('&h=')) {
      try {
        const urlObj = new URL(url);
        const pathParts = urlObj.pathname.split('/');
        const videoId = pathParts[pathParts.length - 1];
        const hash = urlObj.searchParams.get('h');
        
        if (videoId && hash) {
          return { videoId, hash };
        }
      } catch (e) {
        // URL parsing failed, continue with other methods
      }
    }
    
    // First, check for direct ID/hash format (no URL)
    if (url.match(/^\d+\/[a-zA-Z0-9]+$/)) {
      const [id, hash] = url.split('/');
      return { videoId: id, hash: hash };
    }
    
    // Handle URLs with ID/hash format
    const idHashPattern = /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)\/([a-zA-Z0-9]+)/;
    const idHashMatch = url.match(idHashPattern);
    if (idHashMatch) {
      return {
        videoId: idHashMatch[1],
        hash: idHashMatch[2]
      };
    }
    
    // Handle standard Vimeo URLs
    const patterns = [
      /vimeo\.com\/(\d+)/,                   // vimeo.com/123456789
      /vimeo\.com\/video\/(\d+)/,            // vimeo.com/video/123456789
      /player\.vimeo\.com\/video\/(\d+)/     // player.vimeo.com/video/123456789
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        // Check if there's an h= parameter in the URL
        try {
          const urlObj = new URL(url);
          const hash = urlObj.searchParams.get('h');
          return {
            videoId: match[1],
            hash: hash
          };
        } catch (e) {
          // If URL parsing fails, just return the video ID
          return {
            videoId: match[1],
            hash: null
          };
        }
      }
    }
    
    return { videoId: null, hash: null };
  } catch (error) {
    console.error('Error parsing Vimeo URL:', error);
    return { videoId: null, hash: null };
  }
}

/**
 * Builds a Vimeo embed URL with proper parameters
 * @param {string} videoId - The Vimeo video ID
 * @param {string} hash - Optional hash for private videos
 * @param {object} options - Playback options
 * @returns {string} - Complete embed URL
 */
export function buildVimeoEmbedUrl(videoId, hash = null, options = {}) {
  const vimeoParams = new URLSearchParams({
    autoplay: options.autoplay !== undefined ? (options.autoplay ? 1 : 0) : 0,
    loop: options.loop !== undefined ? (options.loop ? 1 : 0) : 0,
    title: options.title !== undefined ? (options.title ? 1 : 0) : 0,
    byline: options.byline !== undefined ? (options.byline ? 1 : 0) : 0,
    portrait: options.portrait !== undefined ? (options.portrait ? 1 : 0) : 0,
    dnt: 1 // Do Not Track
  });
  
  if (hash) {
    vimeoParams.append('h', hash);
  }
  
  return `https://player.vimeo.com/video/${videoId}?${vimeoParams.toString()}`;
}

/**
 * Gets thumbnail URL for a Vimeo video
 * @param {string} videoId - The Vimeo video ID
 * @param {string} size - Thumbnail size (small, medium, large)
 * @returns {string} - Thumbnail URL
 */
export function getVimeoThumbnail(videoId, size = 'medium') {
  // Note: This requires CORS-enabled access to Vimeo's API
  // For production, consider pre-fetching thumbnails or using Vimeo API
  const sizes = {
    small: '200x150',
    medium: '640x360',
    large: '1280x720'
  };
  
  return `https://vumbnail.com/${videoId}_${sizes[size] || sizes.medium}.jpg`;
}

/**
 * Fetches video metadata from Vimeo oEmbed API
 * @param {string} videoUrl - The Vimeo video URL
 * @returns {Promise<object>} - Video metadata
 */
export async function fetchVimeoMetadata(videoUrl) {
  try {
    const oEmbedUrl = `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(videoUrl)}`;
    const response = await fetch(oEmbedUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch video metadata: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      title: data.title,
      description: data.description,
      thumbnail: data.thumbnail_url,
      duration: data.duration,
      author: data.author_name,
      width: data.width,
      height: data.height
    };
  } catch (error) {
    console.error('Error fetching Vimeo metadata:', error);
    return null;
  }
}
