// Announcement Carousel with JSON Configuration - DEBUG VERSION
document.addEventListener('DOMContentLoaded', function() {
  console.log("🔍 Carousel script initialized");
  
  // Path to your JSON configuration file
  const jsonPath = 'https://ntxtemplatestorage.blob.core.windows.net/partner/Carousel.json';
  console.log("📂 Attempting to load JSON from:", jsonPath);
  
  // Get carousel elements
  const carousel = document.getElementById('announcementCarousel');
  const indicatorsContainer = document.getElementById('carouselIndicators');
  
  // Check if DOM elements exist
  if (!carousel) {
    console.error("❌ Element with ID 'announcementCarousel' not found in the DOM");
    return;
  }
  
  if (!indicatorsContainer) {
    console.error("❌ Element with ID 'carouselIndicators' not found in the DOM");
    // We can continue without indicators
    console.warn("⚠️ Will attempt to build carousel without indicators");
  }
  
  // Variables for carousel functionality
  let currentIndex = 0;
  let slideCount = 0;
  let slides = [];
  let indicators = [];
  let autoSlide;
  
  // Load carousel content from JSON
  fetchCarouselContent();
  
  // Function to fetch and process JSON content
  async function fetchCarouselContent() {
    console.log("🔄 Starting to fetch carousel content");
    
    try {
      console.log("🌐 Fetching from URL:", jsonPath);
      const response = await fetch(jsonPath);
      console.log("✅ Fetch response received:", response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      console.log("📊 Parsing JSON response");
      const data = await response.json();
      console.log("✅ JSON parsed successfully:", data);
      
      // Build carousel from the JSON data
      buildCarousel(data);
      
    } catch (error) {
      console.error("❌ Error in fetchCarouselContent:", error.message);
      
      // Try a direct fetch with no await to see if we get different errors
      console.log("🔄 Attempting alternative fetch method");
      fetch(jsonPath)
        .then(response => {
          console.log("✅ Alternative fetch succeeded:", response.status);
          return response.json();
        })
        .then(data => {
          console.log("✅ Alternative JSON parse succeeded");
          buildCarousel(data);
        })
        .catch(err => {
          console.error("❌ Alternative fetch also failed:", err.message);
          
          // Fallback content if JSON fails to load
          console.log("⚠️ Using fallback carousel content");
          buildFallbackCarousel();
        });
    }
  }
  
  // Function to build carousel from JSON data
  function buildCarousel(data) {
    console.log("🏗️ Building carousel from data:", data);
    
    // Clear existing content if any
    carousel.innerHTML = '';
    if (indicatorsContainer) {
      indicatorsContainer.innerHTML = '';
    }
    
    // Check if data has the expected structure
    if (!data || !data.slides || !Array.isArray(data.slides) || data.slides.length === 0) {
      console.error("❌ Invalid or empty JSON structure");
      buildFallbackCarousel();
      return;
    }
    
    console.log(`📊 Building ${data.slides.length} slides`);
    
    // Create slides from the data
    data.slides.forEach((slideData, index) => {
      console.log(`🏗️ Building slide ${index + 1}:`, slideData);
      
      // Create slide element
      const slide = document.createElement('div');
      slide.className = 'carousel-slide';
      slide.id = slideData.id || `slide${index + 1}`;
      
      // Create slide HTML
      slide.innerHTML = `
        <div class="carousel-image">
          <img src="${slideData.image}" alt="${slideData.title}">
          <div class="carousel-badge">${slideData.badge}</div>
        </div>
        <div class="carousel-content">
          <div>
            <h3 class="carousel-title">${slideData.title}</h3>
            <p class="carousel-description">${slideData.description}</p>
          </div>
          <div class="carousel-footer">
            <span class="carousel-date"><i class="fas fa-calendar-alt"></i> ${slideData.date}</span>
            <a href="${slideData.buttonLink}" class="carousel-btn" target="_blank">${slideData.buttonText} <i class="fas fa-arrow-right"></i></a>
          </div>
        </div>
      `;
      
      // Add slide to carousel
      carousel.appendChild(slide);
      
      // Create indicator if container exists
      if (indicatorsContainer) {
        const indicator = document.createElement('span');
        indicator.className = 'carousel-indicator' + (index === 0 ? ' active' : '');
        indicator.setAttribute('data-slide', slide.id);
        indicatorsContainer.appendChild(indicator);
      }
    });
    
    console.log("✅ Carousel built successfully");
    
    // Initialize carousel after building
    initializeCarousel();
  }
  
  // Function to build fallback carousel if JSON fails
  function buildFallbackCarousel() {
    console.log("⚠️ Building fallback carousel");
    
    carousel.innerHTML = `
      <div class="carousel-slide" id="fallbackSlide">
        <div class="carousel-image">
          <img src="https://ntxtemplatestorage.blob.core.windows.net/partner/AdobeStock_903865635.png" alt="Default Announcement">
          <div class="carousel-badge">Announcement</div>
        </div>
        <div class="carousel-content">
          <div>
            <h3 class="carousel-title">Welcome to Nintex Partner Portal</h3>
            <p class="carousel-description">Check back regularly for the latest updates and announcements.</p>
          </div>
          <div class="carousel-footer">
            <span class="carousel-date"><i class="fas fa-calendar-alt"></i> Current</span>
            <a href="#" class="carousel-btn">Learn More <i class="fas fa-arrow-right"></i></a>
          </div>
        </div>
      </div>
    `;
    
    // Create single indicator for fallback if container exists
    if (indicatorsContainer) {
      indicatorsContainer.innerHTML = '<span class="carousel-indicator active" data-slide="fallbackSlide"></span>';
    }
    
    console.log("✅ Fallback carousel built");
    
    // Initialize carousel after building fallback
    initializeCarousel();
  }
  
  // Initialize carousel functionality
  function initializeCarousel() {
    console.log("🔄 Initializing carousel functionality");
    
    // Get all slides and indicators after they've been created
    slides = carousel.querySelectorAll('.carousel-slide');
    indicators = document.querySelectorAll('.carousel-indicator');
    slideCount = slides.length;
    
    console.log(`📊 Found ${slideCount} slides and ${indicators.length} indicators`);
    
    // Get control buttons
    const prevBtn = document.querySelector('.carousel-nav.prev');
    const nextBtn = document.querySelector('.carousel-nav.next');
    
    if (!prevBtn) console.warn("⚠️ Previous button not found");
    if (!nextBtn) console.warn("⚠️ Next button not found");
    
    // Update display
    updateCarousel();
    
    // Set up automatic sliding
    console.log("⏱️ Setting up auto-slide timer");
    autoSlide = setInterval(nextSlide, 5000);
    
    // Event listeners for controls
    if (prevBtn) {
      prevBtn.addEventListener('click', prevSlide);
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', nextSlide);
    }
    
    // Event listeners for indicators
    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
        currentIndex = index;
        updateCarousel();
        resetTimer();
      });
    });
    
    // Alternative implementation with CSS scroll-snap (smoother on mobile)
    setupTouchInteraction();
    
    // Update carousel when window resizes
    window.addEventListener('resize', updateCarousel);
    
    console.log("✅ Carousel initialization complete");
  }
  
  // Function to update carousel display
  function updateCarousel() {
    if (slideCount === 0) {
      console.warn("⚠️ No slides to display");
      return;
    }
    
    // Update slides position using transform
    Array.from(slides).forEach((slide, index) => {
      if (index === currentIndex) {
        slide.style.display = 'flex';
      } else {
        slide.style.display = 'none';
      }
    });
    
    // Update indicator states
    indicators.forEach((indicator, index) => {
      if (index === currentIndex) {
        indicator.classList.add('active');
      } else {
        indicator.classList.remove('active');
      }
    });
  }
  
  // Other functions remain the same...
  
  // Handle next slide button
  function nextSlide() {
    if (slideCount === 0) return;
    currentIndex = (currentIndex + 1) % slideCount;
    updateCarousel();
    resetTimer();
  }
  
  // Handle previous slide button
  function prevSlide() {
    if (slideCount === 0) return;
    currentIndex = (currentIndex - 1 + slideCount) % slideCount;
    updateCarousel();
    resetTimer();
  }
  
  // Reset timer when user interacts with carousel
  function resetTimer() {
    clearInterval(autoSlide);
    autoSlide = setInterval(nextSlide, 5000);
  }
  
  // Setup touch interaction for mobile
  function setupTouchInteraction() {
    let isScrolling = false;
    let startX;
    let scrollLeft;
    
    carousel.addEventListener('touchstart', (e) => {
      isScrolling = true;
      startX = e.touches[0].pageX - carousel.offsetLeft;
      scrollLeft = carousel.scrollLeft;
      resetTimer();
    });
    
    carousel.addEventListener('touchmove', (e) => {
      if (!isScrolling) return;
      const x = e.touches[0].pageX - carousel.offsetLeft;
      const walk = (x - startX) * 2; // Scroll speed multiplier
      carousel.scrollLeft = scrollLeft - walk;
    });
    
    carousel.addEventListener('touchend', () => {
      isScrolling = false;
      
      // Find the closest slide after manual scroll
      const slideWidth = carousel.clientWidth;
      const scrollPosition = carousel.scrollLeft;
      const newIndex = Math.round(scrollPosition / slideWidth);
      
      // Update current index and carousel
      if (newIndex >= 0 && newIndex < slideCount) {
        currentIndex = newIndex;
        updateCarousel();
      }
    });
  }
  
  // Public API for updating carousel content
  window.updateCarouselContent = async function(jsonPath) {
    console.log("🔄 Updating carousel content from:", jsonPath);
    try {
      const response = await fetch(jsonPath);
      const data = await response.json();
      buildCarousel(data);
    } catch (error) {
      console.error("❌ Error updating carousel content:", error);
    }
  };
});