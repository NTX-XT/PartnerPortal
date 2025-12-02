// Simple Carousel JavaScript
(function() {
  // Initialize when the window loads
  window.addEventListener('load', function() {
    initializeCarousel();
  });
  
  function initializeCarousel() {
    // Get all carousel elements
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.carousel-indicator');
    const prevBtn = document.querySelector('.carousel-nav.prev');
    const nextBtn = document.querySelector('.carousel-nav.next');
    
    // Set up variables
    let currentIndex = 0;
    let autoSlideTimer;
    
    // Make goToSlide function globally available
    window.goToSlide = function(index) {
      // Hide all slides
      slides.forEach(slide => {
        slide.style.display = 'none';
      });
      
      // Show the selected slide
      slides[index].style.display = 'flex';
      
      // Update indicators
      indicators.forEach((indicator, i) => {
        if (i === index) {
          indicator.classList.add('active');
        } else {
          indicator.classList.remove('active');
        }
      });
      
      // Update current index
      currentIndex = index;
      
      // Reset auto slide timer
      clearInterval(autoSlideTimer);
      startAutoSlide();
    }
    
    // Function to go to next slide
    function nextSlide() {
      let nextIndex = (currentIndex + 1) % slides.length;
      goToSlide(nextIndex);
    }
    
    // Function to go to previous slide
    function prevSlide() {
      let prevIndex = (currentIndex - 1 + slides.length) % slides.length;
      goToSlide(prevIndex);
    }
    
    // Function to start auto rotation
    function startAutoSlide() {
      autoSlideTimer = setInterval(function() {
        nextSlide();
      }, 7000);
    }
    
    // Add event listeners to controls
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    
    // Add click events to indicators (backup if inline onclick doesn't work)
    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', function() {
        goToSlide(index);
      });
    });
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    });
    
    // Start auto rotation
    startAutoSlide();
    
    // Add visibility change detection to pause when tab is inactive
    document.addEventListener('visibilitychange', function() {
      if (document.hidden) {
        clearInterval(autoSlideTimer);
      } else {
        startAutoSlide();
      }
    });
    
    // Add animation classes after a short delay
    setTimeout(function() {
      document.querySelector('.announcement-carousel').classList.add('initialized');
    }, 100);
  }
})();