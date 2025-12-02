# Vimeo Video Player Widget - Deployment Guide

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build the widget:**
   ```bash
   npm run build
   ```

3. **Upload to Impartner:**
   - File location: `dist/vimeo_video_player_min.js`
   - Follow instructions in README.md

## Widget Configuration in Impartner

### Widget Details
```
Name: Vimeo Video Player
API Name: custom.vimeo-player
Description: Display Vimeo videos in an interactive gallery with modal playback
Author: Nintex
Version: 1.0.0
Icon: (Select video/play icon)
Status: Active
Availability: Dashboard, Content
```

### Component Modes
```
View Mode:
  ✓ Enabled
  Tag ID: uw-vimeo-player-view

Edit Mode:
  ✓ Enabled
  Tag ID: uw-vimeo-player-edit
```

## Testing Locally

Use the included demo page:
```bash
npm run serve
```

Then open http://localhost:9000/demo.html

## Integration Examples

### Example 1: Static Video List
```html
<uw-vimeo-player-view 
  data-title="Partner Training"
  data-videos='[
    {
      "id": "train1",
      "url": "https://vimeo.com/123456789",
      "title": "Product Overview",
      "description": "Learn about our products"
    }
  ]'
></uw-vimeo-player-view>
```

### Example 2: API Integration
```html
<uw-vimeo-player-view 
  data-api-endpoint="/api/objects/v1/training-videos"
></uw-vimeo-player-view>
```

### Example 3: Private Videos
```html
<uw-vimeo-player-view 
  data-videos='[
    {
      "id": "private1",
      "url": "https://vimeo.com/123456789/abc123def",
      "title": "Private Training Video",
      "thumbnail": "https://yourcdn.com/thumb.jpg"
    }
  ]'
></uw-vimeo-player-view>
```

## API Requirements

If using Impartner's custom objects, create an object with:

**Object Name:** Training Videos  
**API Name:** training-videos

**Fields:**
- `vimeo_url` (Text, Required)
- `title` (Text, Required)
- `description` (Long Text)
- `thumbnail_url` (URL)
- `category` (Text)
- `tags` (Text)

**API Endpoint:** `/prm/api/objects/v1/training-videos`

## Customization

### Change Brand Colors

Edit `src/styles/view.css`:
```css
:root {
  --primary-color: #FF6B00;  /* Your primary color */
  --secondary-color: #0066CC; /* Your secondary color */
}
```

### Change Grid Layout

Edit `src/styles/view.css`:
```css
.video-grid {
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  /* Change 300px to adjust card minimum width */
}
```

## Troubleshooting

### Widget doesn't appear in PX Studio
- Verify the widget is marked as "Active" in Impartner admin
- Check that the bundle file uploaded successfully
- Clear browser cache

### Videos don't play
- Verify Vimeo URLs are correct
- Check video privacy settings in Vimeo
- For private videos, ensure hash is included in URL

### Thumbnails not loading
- Vimeo's oEmbed API may have CORS restrictions
- Provide custom thumbnail URLs in video data
- Check browser console for API errors

## Production Checklist

- [ ] Built with `npm run build`
- [ ] Tested in local demo.html
- [ ] Uploaded to Impartner Extensibility
- [ ] Widget configuration saved and activated
- [ ] Tested in PX Studio dashboard
- [ ] Tested with real Impartner API data
- [ ] Tested video playback for various URL formats
- [ ] Tested on mobile devices
- [ ] Verified accessibility (keyboard navigation)

## Support

For issues or questions:
- Check README.md for detailed documentation
- Review browser console for error messages
- Verify API endpoints and data structure
- Contact Nintex development team
