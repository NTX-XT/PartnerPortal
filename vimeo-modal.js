/**
 * VimeoModal - A lightweight JavaScript utility to open Vimeo links in a frameless modal window
 * 
 * This function creates a modal window with minimal branded styling and a close button.
 * It's designed to be used within a partner portal to display Vimeo content without navigating away.
 */

// Configuration options - customize these values
const MODAL_CONFIG = {
    brandColor: '#FF6B00', // Nintex orange color
    brandLogo: 'https://ntxtemplatestorage.blob.core.windows.net/partner/VimeoIcon.png', // Vimeo Icon URL
    borderWidth: '3px',
    borderRadius: '8px',
    zIndex: 9999, // Make sure it appears above other elements
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Semi-transparent background
    headerHeight: '60px'  // Taller header to match screenshot
  };
  
  /**
   * Creates the modal container in the DOM if it doesn't already exist
   */
  function createVimeoModal() {
    // Check if modal already exists
    if (document.getElementById('vimeo-modal-container')) {
      return;
    }
    
    // Create container
    const modalContainer = document.createElement('div');
    modalContainer.id = 'vimeo-modal-container';
    modalContainer.style.cssText = `
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: ${MODAL_CONFIG.backgroundColor};
      z-index: ${MODAL_CONFIG.zIndex};
      justify-content: center;
      align-items: center;
    `;
    
    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.id = 'vimeo-modal-content';
    modalContent.style.cssText = `
      position: relative;
      width: 80%;
      max-width: 80%;
      background-color: #000;
      border: ${MODAL_CONFIG.borderWidth} solid ${MODAL_CONFIG.brandColor};
      border-radius: ${MODAL_CONFIG.borderRadius};
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
    `;
    
    // Create header
    const modalHeader = document.createElement('div');
    modalHeader.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px;
      height: ${MODAL_CONFIG.headerHeight};
      background-color: ${MODAL_CONFIG.brandColor};
      border-top-left-radius: ${MODAL_CONFIG.borderRadius};
      border-top-right-radius: ${MODAL_CONFIG.borderRadius};
      position: relative;
    `;
    
    // Create a container for the logo and title
    const brandingContainer = document.createElement('div');
    brandingContainer.style.cssText = `
      display: flex;
      align-items: center;
      gap: 12px;
    `;
    
    // Add logo
    const brandLogo = document.createElement('img');
    brandLogo.src = MODAL_CONFIG.brandLogo;
    brandLogo.alt = 'Nintex Video';
    brandLogo.style.cssText = `
      height: 28px;
      width: auto;
    `;
    brandLogo.onerror = function() {
      // If image fails to load, hide it gracefully
      this.style.display = 'none';
    };
    brandingContainer.appendChild(brandLogo);
    
    // Add Nintex title text
    const brandTitle = document.createElement('span');
    brandTitle.textContent = 'Nintex Video';
    brandTitle.style.cssText = `
      color: white;
      font-size: 18px;
      font-weight: 500;
      font-family: Arial, sans-serif;
    `;
    brandingContainer.appendChild(brandTitle);
    
    // Add branding container to header
    modalHeader.appendChild(brandingContainer);
    
    // Add close button
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '&times;'; // × symbol
    closeButton.style.cssText = `
      background: none;
      border: none;
      color: white;
      font-size: 32px;
      font-weight: 300;
      cursor: pointer;
      padding: 0;
      line-height: 1;
      opacity: 0.9;
      transition: opacity 0.2s ease;
    `;
    closeButton.onmouseover = function() {
      this.style.opacity = '1';
    };
    closeButton.onmouseout = function() {
      this.style.opacity = '0.9';
    };
    closeButton.onclick = closeVimeoModal;
    modalHeader.appendChild(closeButton);
    
    // Create iframe container
    const iframeContainer = document.createElement('div');
    iframeContainer.id = 'vimeo-iframe-container';
    iframeContainer.style.cssText = `
      position: relative;
      padding-bottom: 56.25%; /* 16:9 aspect ratio */
      height: 0;
      overflow: hidden;
    `;
    
    // Assemble modal
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(iframeContainer);
    modalContainer.appendChild(modalContent);
    
    // Add click event to close when clicking outside the modal
    modalContainer.addEventListener('click', function(event) {
      if (event.target === modalContainer) {
        closeVimeoModal();
      }
    });
    
    // Add keydown event to close on Escape key
    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape' && modalContainer.style.display === 'flex') {
        closeVimeoModal();
      }
    });
    
    // Add to DOM
    document.body.appendChild(modalContainer);
  }
  
  /**
   * Opens a Vimeo link in the modal
   * @param {string} vimeoUrl - The Vimeo URL to be opened
   * @param {object} options - Optional configuration options
   */
  function openVimeoInModal(vimeoUrl, options = {}) {
    // Make sure modal exists
    createVimeoModal();
    
    try {
      // Handle direct Vimeo embed URLs
      if (vimeoUrl.includes('player.vimeo.com/video/') && vimeoUrl.includes('h=')) {
        // This is a direct embed URL, extract the video ID and hash from it
        const urlObj = new URL(vimeoUrl);
        const pathParts = urlObj.pathname.split('/');
        const videoId = pathParts[pathParts.length - 1];
        const hash = urlObj.searchParams.get('h');
        
        if (videoId) {
          // Create the iframe directly from the embed URL
          const iframe = document.createElement('iframe');
          iframe.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border: none;
          `;
          
          iframe.src = vimeoUrl;
          iframe.setAttribute('frameborder', '0');
          iframe.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture');
          iframe.setAttribute('allowfullscreen', 'allowfullscreen');
          
          // Clear previous iframe and add new one
          const container = document.getElementById('vimeo-iframe-container');
          container.innerHTML = '';
          container.appendChild(iframe);
          
          // Show modal
          const modal = document.getElementById('vimeo-modal-container');
          modal.style.display = 'flex';
          
          // Prevent scrolling on the body
          document.body.style.overflow = 'hidden';
          
          return;
        }
      }
      
      // Standard approach for other URL formats
      const { videoId, hash } = parseVimeoUrl(vimeoUrl);
      
      if (!videoId) {
        console.error('Invalid Vimeo URL:', vimeoUrl);
        return;
      }
      
      // Create iframe for Vimeo
      const iframe = document.createElement('iframe');
      iframe.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border: none;
      `;
      
      // Set Vimeo parameters
      const vimeoParams = new URLSearchParams({
        autoplay: options.autoplay !== undefined ? options.autoplay : 1,
        loop: options.loop !== undefined ? options.loop : 0,
        title: options.title !== undefined ? options.title : 0,
        byline: options.byline !== undefined ? options.byline : 0,
        portrait: options.portrait !== undefined ? options.portrait : 0,
        dnt: 1 // Do Not Track
      });
      
      // Add any additional parameters from options
      if (options.vimeoParams) {
        Object.entries(options.vimeoParams).forEach(([key, value]) => {
          vimeoParams.append(key, value);
        });
      }
      
      // Set iframe source - handle videos with password/hash differently
      let src;
      if (hash) {
        // Use the Vimeo preferred h= parameter format for the hash
        vimeoParams.append('h', hash);
        src = `https://player.vimeo.com/video/${videoId}?${vimeoParams.toString()}`;
      } else {
        src = `https://player.vimeo.com/video/${videoId}?${vimeoParams.toString()}`;
      }
      
      iframe.src = src;
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture');
      iframe.setAttribute('allowfullscreen', 'allowfullscreen');
      
      // Clear previous iframe and add new one
      const container = document.getElementById('vimeo-iframe-container');
      container.innerHTML = '';
      container.appendChild(iframe);
      
      // Show modal
      const modal = document.getElementById('vimeo-modal-container');
      modal.style.display = 'flex';
      
      // Prevent scrolling on the body
      document.body.style.overflow = 'hidden';
      
    } catch (error) {
      console.error('Error opening Vimeo modal:', error);
    }
  }
  
  /**
   * Parses a Vimeo URL to extract video ID and hash (if present)
   * @param {string} url - The Vimeo URL
   * @returns {object} - Object with videoId and hash properties
   */
  function parseVimeoUrl(url) {
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
   * Closes the modal window
   */
  function closeVimeoModal() {
    const modal = document.getElementById('vimeo-modal-container');
    if (modal) {
      modal.style.display = 'none';
      
      // Clear iframe content to stop video playback
      const container = document.getElementById('vimeo-iframe-container');
      if (container) {
        container.innerHTML = '';
      }
      
      // Restore scrolling
      document.body.style.overflow = '';
    }
  }
  
  /**
   * Initialize Vimeo modal links on the page
   * Looks for links with the data-vimeo-modal attribute
   */
  function initVimeoModalLinks() {
    try {
      // Create the modal container
      createVimeoModal();
      
      // Find all links with the data-vimeo-modal attribute
      document.querySelectorAll('a[data-vimeo-modal]').forEach(link => {
        link.addEventListener('click', function(event) {
          event.preventDefault();
          
          try {
            // Get the video ID either from data-video-id attribute or from href
            let videoUrl;
            const videoId = this.getAttribute('data-video-id');
            
            if (videoId) {
              // If data-video-id is provided, handle different formats
              if (videoId.includes('/')) {
                // It's already in ID/hash format
                videoUrl = videoId;
              } else {
                // Just a plain ID
                videoUrl = videoId;
              }
            } else if (this.href && this.href !== '#' && this.href !== 'javascript:void(0)') {
              // If no data-video-id but href exists and is not a placeholder
              videoUrl = this.href;
            } else {
              console.error('No video ID or URL found for this link');
              return;
            }
            
            // Get options from data attributes
            const options = {
              autoplay: this.hasAttribute('data-autoplay') ? this.getAttribute('data-autoplay') !== 'false' : true,
              loop: this.hasAttribute('data-loop') ? this.getAttribute('data-loop') === 'true' : false,
              title: this.hasAttribute('data-title') ? this.getAttribute('data-title') === 'true' : false,
              byline: this.hasAttribute('data-byline') ? this.getAttribute('data-byline') === 'true' : false,
              portrait: this.hasAttribute('data-portrait') ? this.getAttribute('data-portrait') === 'true' : false
            };
            
            openVimeoInModal(videoUrl, options);
          } catch (error) {
            console.error('Error handling Vimeo link click:', error);
          }
        });
      });
    } catch (error) {
      console.error('Error initializing Vimeo modal links:', error);
    }
  }
  
  // Initialize the Vimeo modal links when the DOM is fully loaded
  document.addEventListener('DOMContentLoaded', initVimeoModalLinks);
  
  // Make functions available globally
  window.openVimeoInModal = openVimeoInModal;
  window.closeVimeoModal = closeVimeoModal;
  window.createVimeoModal = createVimeoModal;