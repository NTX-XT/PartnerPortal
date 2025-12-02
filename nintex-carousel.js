/**
 * Debugging Version - Enhanced Nintex Events Carousel
 * This version adds extensive logging to find why rotation/clicks aren't working
 * v6.4.0 - Debug Version
 */
(function () {
  const ROOT_SEL = '#announcementCarousel';
  const WRAP_SEL = '.announcement-carousel';
  const ROTATE_MS = 7000;
  
  // Your specific JSON URL
  const EVENTS_JSON_URL = 'https://ntxtemplatestorage.blob.core.windows.net/partner/nintex-events.json';

  let timer = null;
  let currentIndex = 0;
  let started = false;
  let events = [];

  // --- Utilities ---
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /**
   * Debug function to check carousel state
   */
  function debugCarouselState() {
    const slides = getSlides();
    const indicators = $$('.carousel-indicator');
    const controls = $$('.carousel-nav');
    
    console.log('🔍 CAROUSEL DEBUG STATE:');
    console.log('  - Total slides:', slides.length);
    console.log('  - Current index:', currentIndex);
    console.log('  - Timer active:', !!timer);
    console.log('  - Indicators found:', indicators.length);
    console.log('  - Control buttons found:', controls.length);
    console.log('  - Started flag:', started);
    
    // Check which slide is currently visible
    slides.forEach((slide, idx) => {
      const isVisible = slide.style.display !== 'none';
      const hasActive = slide.classList.contains('active');
      console.log(`  - Slide ${idx}: visible=${isVisible}, active=${hasActive}, id=${slide.id}`);
    });
  }

  /**
   * Load events data from JSON
   */
  async function loadEventsData() {
    try {
      console.log('📡 Loading events from:', EVENTS_JSON_URL);
      
      const cacheBuster = new Date().getTime();
      const response = await fetch(`${EVENTS_JSON_URL}?cb=${cacheBuster}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      events = Array.isArray(data) ? data : data.events || [];
      
      console.log('✅ Events loaded successfully:', events.length, 'events');
      return events;
    } catch (error) {
      console.error('❌ Failed to load events from JSON:', error);
      events = [];
      return events;
    }
  }

  /**
   * Generate HTML for a single carousel slide
   */
  function generateSlideHTML(event, index) {
    const tagClass = event.tagClass || 
                    (event.tag.toLowerCase().includes('webinar') ? 'tag-webinar' : 'tag-event');
    
    const formatIcon = event.event_details?.format?.includes('In-person') ? 'fas fa-building' :
                      event.event_details?.format?.includes('webinar') ? 'fas fa-desktop' : 
                      'fas fa-globe';

    let timingDetails = '';
    if (event.timing) {
      const parts = [];
      if (event.timing.startTime && event.timing.endTime) {
        parts.push(`${event.timing.startTime} - ${event.timing.endTime}`);
      }
      if (event.timing.duration) {
        parts.push(`Duration: ${event.timing.duration}`);
      }
      if (event.timing.timezone) {
        parts.push(event.timing.timezone);
      }
      timingDetails = parts.join(' • ');
    }

    return `
      <div aria-hidden="${index !== 0}" class="carousel-slide enhanced-slide ${index === 0 ? 'active' : ''}" 
           data-event-index="${index}" 
           data-json-generated="true"
           id="${event.id}" 
           style="display: ${index === 0 ? 'flex' : 'none'};">
        
        <div class="carousel-tag-container">
          <div class="carousel-tag ${tagClass}">${event.tag}</div>
          <div class="carousel-date-top">${event.date}</div>
          ${event.timing?.startTime ? `<div class="carousel-time">${event.timing.startTime}</div>` : ''}
        </div>

        <div class="carousel-content">
          <div class="content-main">
            <h3 class="carousel-title">${event.title}</h3>
            <div class="carousel-description">${event.description}</div>
            
            ${timingDetails ? `
              <div class="event-timing-info">
                <div class="timing-details">${timingDetails}</div>
              </div>
            ` : ''}
          </div>

          <div class="carousel-footer enhanced-footer">
            <div class="event-meta">
              <span><i class="${formatIcon}"></i> ${event.event_details?.format || 'Event'}</span>
            </div>
            <div class="footer-actions">
              <a class="carousel-btn enhanced-btn" href="${event.url}" target="_blank">
                ${event.buttonText || 'Explore more'} <i class="fas fa-arrow-right"></i>
              </a>
              <button class="details-btn" data-event-id="${event.id}" type="button">
                <i class="fas fa-info-circle"></i> Details
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Generate carousel indicators HTML
   */
  function generateIndicatorsHTML(events) {
    return `<div class="carousel-indicators" id="carouselIndicators">
      ${events.map((event, index) => `
        <button aria-label="Go to ${event.title}" 
                class="carousel-indicator ${index === 0 ? 'active' : ''}" 
                data-index="${index}" 
                title="${event.title} - ${event.date}" 
                type="button">
        </button>
      `).join('')}
    </div>`;
  }

  /**
   * Generate carousel controls HTML
   */
  function generateControlsHTML() {
    return `<div class="carousel-controls">
      <button aria-label="Previous slide" class="carousel-nav prev" type="button">
        <i class="fas fa-chevron-left"></i>
      </button>
      <button aria-label="Next slide" class="carousel-nav next" type="button">
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>`;
  }

  /**
   * Populate the carousel with events data
   */
  function populateCarousel(events) {
    console.log('🚀 Populating carousel with', events.length, 'events');
    
    const root = $(ROOT_SEL);
    const wrapper = $(WRAP_SEL);
    
    if (!root || !events.length) {
      console.warn('❌ No carousel root or no events');
      return false;
    }

    // Clear existing content
    root.innerHTML = '';
    
    // Remove existing indicators and controls
    $$('.carousel-indicators, .carousel-controls').forEach(el => {
      console.log('🗑️ Removing existing:', el.className);
      el.remove();
    });

    // Generate all slides
    const slidesHTML = events.map((event, index) => generateSlideHTML(event, index)).join('');
    root.innerHTML = slidesHTML;

    // Add indicators and controls after the carousel container
    if (wrapper) {
      wrapper.insertAdjacentHTML('beforeend', generateIndicatorsHTML(events));
      wrapper.insertAdjacentHTML('beforeend', generateControlsHTML());
      console.log('✅ Added indicators and controls to wrapper');
    }

    // Set first slide as active
    const slides = getSlides();
    if (slides.length > 0) {
      showSlide(slides, 0);
      currentIndex = 0;
      console.log('✅ Set first slide as active');
    }

    console.log('✅ Carousel populated successfully');
    return true;
  }

  /**
   * Get all carousel slides
   */
  function getSlides() {
    const root = $(ROOT_SEL);
    return root ? $$('.carousel-slide', root) : [];
  }

  /**
   * Show a specific slide
   */
  function showSlide(slides, idx) {
    console.log(`🔄 Showing slide ${idx} of ${slides.length}`);
    
    slides.forEach((s, i) => {
      const active = i === idx;
      s.classList.toggle('active', active);
      s.style.display = active ? 'flex' : 'none';
      s.setAttribute('aria-hidden', active ? 'false' : 'true');
    });

    // Update indicators
    $$('.carousel-indicator').forEach((indicator, i) => {
      indicator.classList.toggle('active', i === idx);
    });
    
    console.log(`✅ Slide ${idx} is now active`);
  }

  /**
   * Move to next slide
   */
  function nextSlide() {
    console.log('➡️ NEXT SLIDE TRIGGERED');
    const slides = getSlides();
    if (!slides.length) {
      console.warn('❌ No slides found for next()');
      return;
    }
    
    const oldIndex = currentIndex;
    currentIndex = (currentIndex + 1) % slides.length;
    console.log(`🔄 Moving from slide ${oldIndex} to slide ${currentIndex}`);
    
    showSlide(slides, currentIndex);
    debugCarouselState();
  }

  /**
   * Move to previous slide
   */
  function prevSlide() {
    console.log('⬅️ PREVIOUS SLIDE TRIGGERED');
    const slides = getSlides();
    if (!slides.length) {
      console.warn('❌ No slides found for prev()');
      return;
    }
    
    const oldIndex = currentIndex;
    currentIndex = currentIndex === 0 ? slides.length - 1 : currentIndex - 1;
    console.log(`🔄 Moving from slide ${oldIndex} to slide ${currentIndex}`);
    
    showSlide(slides, currentIndex);
    debugCarouselState();
  }

  /**
   * Start auto-rotation
   */
  function startRotation() {
    console.log('▶️ STARTING AUTO-ROTATION (7 second intervals)');
    stopRotation();
    
    timer = setInterval(() => {
      console.log('⏰ Auto-rotation timer fired');
      nextSlide();
    }, ROTATE_MS);
    
    console.log('✅ Auto-rotation timer set, ID:', timer);
  }

  /**
   * Stop auto-rotation
   */
  function stopRotation() {
    if (timer) {
      console.log('⏸️ Stopping auto-rotation, timer ID:', timer);
      clearInterval(timer);
      timer = null;
    }
  }

  /**
   * Attach event handlers with detailed logging
   */
  function attachEventHandlers() {
    console.log('🔗 Attaching event handlers...');
    
    // Indicator handlers
    const indicators = $$('.carousel-indicator');
    console.log(`📍 Found ${indicators.length} indicators to attach handlers to`);
    
    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', (e) => {
        console.log(`👆 INDICATOR ${index} CLICKED`);
        e.preventDefault();
        e.stopPropagation();
        
        const slides = getSlides();
        if (slides.length > index) {
          const oldIndex = currentIndex;
          currentIndex = index;
          console.log(`🎯 Jumping from slide ${oldIndex} to slide ${currentIndex}`);
          
          showSlide(slides, currentIndex);
          startRotation(); // Restart timer
          debugCarouselState();
        }
      });
      console.log(`✅ Attached click handler to indicator ${index}`);
    });

    // Control handlers
    const prevBtn = $('.carousel-nav.prev');
    const nextBtn = $('.carousel-nav.next');
    
    console.log('🎮 Control buttons found:', { prev: !!prevBtn, next: !!nextBtn });
    
    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        console.log('👆 PREVIOUS BUTTON CLICKED');
        e.preventDefault();
        e.stopPropagation();
        prevSlide();
        startRotation();
      });
      console.log('✅ Attached click handler to previous button');
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        console.log('👆 NEXT BUTTON CLICKED');
        e.preventDefault();
        e.stopPropagation();
        nextSlide();
        startRotation();
      });
      console.log('✅ Attached click handler to next button');
    }

    // Details button handlers
    const detailsBtns = $$('.details-btn');
    console.log(`ℹ️ Found ${detailsBtns.length} details buttons`);
    
    detailsBtns.forEach((btn, idx) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const eventId = e.target.closest('.details-btn').dataset.eventId;
        console.log(`ℹ️ Details button ${idx} clicked for event:`, eventId);
      });
    });
    
    console.log('✅ All event handlers attached');
  }

  /**
   * Initialize the carousel with JSON data
   */
  async function initializeCarousel() {
    console.log('🎯 Initializing carousel with JSON data...');
    
    try {
      // Load events data from JSON
      const loadedEvents = await loadEventsData();
      
      if (!loadedEvents.length) {
        console.warn('⚠️ No events available to display');
        return;
      }

      // Populate carousel with loaded data
      if (populateCarousel(loadedEvents)) {
        // Debug initial state
        debugCarouselState();
        
        // Attach event handlers
        attachEventHandlers();
        
        // Start auto-rotation
        startRotation();
        started = true;
        
        // Mark as initialized
        $(WRAP_SEL)?.classList.add('initialized');
        
        // Hide loading indicator
        const loadingIndicator = $('.carousel-loading');
        if (loadingIndicator) {
          loadingIndicator.style.display = 'none';
        }
        
        console.log('🎉 Carousel initialized successfully with', loadedEvents.length, 'events');
        
        // Final debug state
        setTimeout(() => {
          console.log('🔍 FINAL CAROUSEL STATE:');
          debugCarouselState();
        }, 1000);
      }
      
    } catch (error) {
      console.error('💥 Carousel initialization failed:', error);
    }
  }

  /**
   * Initialize when ready
   */
  function init() {
    console.log('🚀 Starting Nintex Carousel initialization (DEBUG VERSION)');
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initializeCarousel);
    } else {
      setTimeout(initializeCarousel, 100);
    }
  }

  // Public API with debug functions
  window.nintexCarousel = {
    next: nextSlide,
    prev: prevSlide,
    stop: stopRotation,
    start: startRotation,
    reload: initializeCarousel,
    getEvents: () => events,
    getCurrentIndex: () => currentIndex,
    debug: debugCarouselState,
    goToSlide: (index) => {
      console.log(`🎯 Manual goToSlide(${index}) called`);
      const slides = getSlides();
      if (slides.length > index && index >= 0) {
        currentIndex = index;
        showSlide(slides, currentIndex);
        startRotation();
        debugCarouselState();
      }
    }
  };

  // Start initialization
  init();
  
  console.log('🔧 Nintex Carousel DEBUG script loaded');
})();