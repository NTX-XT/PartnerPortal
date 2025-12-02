# Nintex Partner Portal - AI Agent Instructions

## Project Overview
This is a **Nintex Partner Portal** - a white-themed partner website featuring interactive carousels, forms, video modals, and background animations. The project uses vanilla JavaScript with extensive logging/debugging capabilities and external JSON data sources.

## Key Architecture Patterns

### 1. **JSON-Driven Dynamic Content**
The carousel system is entirely data-driven through external JSON endpoints:
- Primary: `https://ntxtemplatestorage.blob.core.windows.net/partner/nintex-events.json`
- Fallback: `carousel.json` (local static data)
- Event data structure includes timing, speakers, agenda, and registration details
- Always implement fallback content when JSON fails to load

### 2. **Multi-Version JavaScript Architecture**
The codebase intentionally includes multiple carousel implementations:
- `carousel.js` - Simple static carousel with manual slide definitions
- `nintex-carousel.js` - Advanced JSON-driven carousel with extensive debugging (6.4.0)
- `carousel-loader.js` - JSON data loader with error handling
- `c_debug.js` - Debug version with comprehensive logging

**Pattern**: Keep debugging versions alongside production code for troubleshooting partner portal issues.

### 3. **CSS Design System**
The project uses a comprehensive CSS variable system in `partnerportal.css`:
```css
:root {
  --primary-color: #FF6B00;    /* Nintex Orange */
  --secondary-color: #0066CC;  /* Nintex Blue */
  --text-dark: #333;
  /* 20+ design system variables */
}
```
Always use CSS variables instead of hardcoded colors.

### 4. **Modular Component Architecture**
- **Carousel Components**: Self-contained with JSON loading, auto-rotation, and debugging
- **Modal Systems**: Custom modal implementation (`vimeo-modal.js`) with Vimeo integration
- **Form Handlers**: Marketo integration (`subscription-form.js`) with MTL template processing
- **Background Animations**: GSAP-powered animations with orbs and wave patterns

## Critical Implementation Details

### **Carousel System**
When working with carousels:
1. Always check for `#announcementCarousel` container existence
2. Implement cache-busting for JSON requests: `${url}?cb=${Date.now()}`
3. Use `console.log` extensively with emoji prefixes for debugging
4. Support both automatic rotation and manual navigation
5. Handle mobile touch interactions separately

### **JSON Data Structure**
Events follow this pattern:
```javascript
{
  "id": "event24",
  "tag": "AI Solutions",
  "tagClass": "tag-ai",
  "title": "...",
  "description": "...",
  "date": "September 5th",
  "url": "https://...",
  "timing": { "startTime": "2:00 PM EST", ... },
  "event_details": { "format": "Live Webinar", ... }
}
```

### **CSS Styling Conventions**
- Use `backdrop-filter: blur()` for glass effects
- Implement smooth transitions: `transition: all 0.3s ease`
- Fixed carousel height: `195px` (mobile: `220px`)
- Font system: Plus Jakarta Sans with fallbacks
- 4-column resource card layout on desktop

### **Debugging Philosophy**
The codebase heavily emphasizes debugging:
- Use emoji-prefixed console logs: `console.log("🔄 Loading events...")`
- Implement `debugCarouselState()` functions for complex components
- Always log successful operations and errors
- Include fallback mechanisms for external dependencies

## External Dependencies & Integrations

### **Required External Services**
- **Nintex Template Storage**: `ntxtemplatestorage.blob.core.windows.net`
- **Marketo Forms**: `info.nintex.com/js/forms2/js/forms2.min.js`
- **GSAP Animations**: `gsap.min.js`, `ScrollTrigger.min.js`
- **Font Awesome**: For icons in carousels and UI elements

### **Form Integration**
Marketo forms require:
1. MTL (Marketo Template Language) server-side processing
2. Pre-population with member data: `memberEmail`, `memberFirstName`, etc.
3. Custom styling to match Nintex brand colors
4. Mobile-responsive field layouts

## Development Workflow

### **Local Development**
- No build process required - pure HTML/CSS/JS
- Test carousel with both static and dynamic JSON data
- Use browser dev tools with extensive console logging
- Test mobile touch interactions separately

### **Deployment Considerations**
- JSON endpoints must support CORS
- Images should be optimized and served from CDN
- Background animations may impact performance on low-end devices
- Always test form submissions in production environment

## File-Specific Guidance

### **CSS Files**
- `topbar.css`: Minimal navbar styling (background + font only)
- `carousel.css`: Fixed-height (195px) carousel with glassmorphism effects
- `partnerportal.css`: 2000+ line design system with modular components
- Load order: `partnerportal.css` first, then component-specific styles

### **JavaScript Files**
- Always check DOM element existence before manipulation
- Implement graceful fallbacks for failed JSON requests
- Use `data-` attributes for configuration
- Modal systems should prevent body scrolling when active

### **Forms & Marketo**
The Nintex Partner Assessment (`form.json`) is a complex multi-page form with:
- Partner readiness scoring system
- Conditional field display
- Custom validation rules
- Integration with partner management systems

When modifying forms, maintain the readiness scoring logic and ensure proper data flow to backend systems.