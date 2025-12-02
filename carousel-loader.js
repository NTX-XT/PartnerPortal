/**
 * Nintex Events Carousel Loader - Fixed Version
 * This script loads events from a JSON file and populates the carousel
 * with additional error handling and proper sequencing
 */

// Store the original goToSlide function if it exists
const originalGoToSlide = window.goToSlide;

// Wait until DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize the loader
  initCarouselLoader();
});

function initCarouselLoader() {
  // Path to your JSON file - update this to match your hosting location
  const jsonFilePath = 'https://ntxtemplatestorage.blob.core.windows.net/partner/nintex-events.json';
  
  // Load the events
  loadEventsFromJSON(jsonFilePath);
}

// Function to load events from a JSON file
function loadEventsFromJSON(jsonUrl) {
  // Add cache busting parameter to avoid caching issues
  const cacheBuster = Math.round(new Date().getTime() / 1000);
  const urlWithCacheBuster = `${jsonUrl}?cb=${cacheBuster}`;
  
  fetch(urlWithCacheBuster)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      // Successfully loaded the JSON data
      console.log('Events loaded successfully:', data.length);
      updateCarouselFromJSON(data);
    })
    .catch(error => {
      console.error('Error loading events from JSON:', error);
      // You could add a fallback here if needed
    });
}

// Function to generate or update carousel slides from JSON data
function updateCarouselFromJSON(events) {
  const carouselContainer = document.getElementById('announcementCarousel');
  
  if (!carouselContainer) {
    console.error('Carousel container not found. Make sure the element with ID "announcementCarousel" exists.');
    return;
  }
  
  // Clear existing slides
  carouselContainer.innerHTML = '';
  
  // Generate slides
  events.forEach((event, index) => {
    const slideHTML = `
      <div class="carousel-slide" id="${event.id}" style="display: ${index === 0 ? 'flex' : 'none'};">
        <div class="carousel-tag ${event.tagClass}">${event.tag}</div>
        <div class="carousel-content">
          <div>
            <h3 class="carousel-title">${event.title}</h3>
            <p class="carousel-description">${event.description}</p>
          </div>
          <div class="carousel-footer">
            <span class="carousel-date">${event.date}</span>
            <a class="carousel-btn" href="${event.url}" target="_blank">${event.buttonText} <i class="fas fa-arrow-right"></i></a>
          </div>
        </div>
      </div>
    `;
    carouselContainer.innerHTML += slideHTML;
  });
  
  // Generate indicators
  updateCarouselIndicators(events);
  
  // Make sure controls are present
  ensureCarouselControls(carouselContainer.parentElement);
  
  // Initialize carousel functionality with a slight delay to ensure DOM is updated
  setTimeout(function() {
    initializeCarouselFunctionality();
  }, 100);
}

// Function to ensure carousel controls exist
function ensureCarouselControls(container) {
  if (!container) return;
  
  // Check for existing controls
  if (!container.querySelector('.carousel-controls')) {
    const controlsHTML = `
      <div class="carousel-controls">
        <button aria-label="Next slide" class="carousel-nav next"><i class="fas fa-chevron-right"></i></button>
      </div>
    `;
    container.insertAdjacentHTML('beforeend', controlsHTML);
  }
}

// Function to update carousel indicators
function updateCarouselIndicators(events) {
  const container = document.querySelector('.announcement-carousel');
  
  if (!container) {
    console.error('Announcement carousel container not found.');
    return;
  }
  
  // Remove existing indicators if any
  const existingIndicators = document.getElementById('carouselIndicators');
  if (existingIndicators) {
    existingIndicators.remove();
  }
  
  // Create indicators HTML
  let indicatorsHTML = `<div class="carousel-indicators" id="carouselIndicators">`;
  events.forEach((event, index) => {
    indicatorsHTML += `
      <span class="carousel-indicator${index === 0 ? ' active' : ''}" 
            data-slide="${event.id}" 
            onclick="goToSlide(${index})"></span>
    `;
  });
  indicatorsHTML += `</div>`;
  
  // Add to DOM
  container.insertAdjacentHTML('beforeend', indicatorsHTML);
}

// Function to initialize the carousel functionality
function initializeCarouselFunctionality() {
  // Define a safe goToSlide function if it doesn't exist or if it has errors
  if (typeof window.goToSlide !== 'function' || window.goToSlide === originalGoToSlide) {
    window.goToSlide = function(index) {
      const slides = document.querySelectorAll('.carousel-slide');
      const indicators = document.querySelectorAll('.carousel-indicator');
      
      if (!slides || slides.length === 0) {
        console.error('No slides found for carousel');
        return;
      }
      
      // Validate index
      if (index < 0 || index >= slides.length) {
        console.error(`Invalid slide index: ${index}. Total slides: ${slides.length}`);
        return;
      }
      
      // Hide all slides
      slides.forEach(slide => {
        if (slide && slide.style) {
          slide.style.display = 'none';
        } else {
          console.warn('Slide element or style is undefined', slide);
        }
      });
      
      // Show the selected slide
      if (slides[index] && slides[index].style) {
        slides[index].style.display = 'flex';
      } else {
        console.warn(`Slide at index ${index} is undefined or missing style property`, slides[index]);
      }
      
      // Update indicators
      indicators.forEach((indicator, i) => {
        if (i === index) {
          indicator.classList.add('active');
        } else {
          indicator.classList.remove('active');
        }
      });
    };
  }
  
  // Add event listener for next button
  const nextBtn = document.querySelector('.carousel-nav.next');
  if (nextBtn) {
    nextBtn.addEventListener('click', function() {
      const slides = document.querySelectorAll('.carousel-slide');
      const currentIndex = Array.from(slides).findIndex(slide => slide.style.display === 'flex');
      const nextIndex = (currentIndex + 1) % slides.length;
      window.goToSlide(nextIndex);
    });
  }
  
  // Show first slide (index 0) by default
  window.goToSlide(0);
  
  console.log('Carousel functionality initialized');
}