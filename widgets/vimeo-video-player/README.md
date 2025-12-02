# Impartner Vimeo Video Player Widget

A custom widget for Impartner PRM that displays Vimeo videos in an interactive gallery with modal playback.

## Features

- **Responsive Grid Layout**: Videos displayed in a beautiful card-based grid
- **Modal Video Player**: Full-screen video playback with branded header
- **Support for Private Videos**: Handles Vimeo videos with hash/password protection
- **Automatic Metadata Fetching**: Retrieves thumbnails and video details from Vimeo API
- **Add/Edit Videos**: Full CRUD operations through the edit mode
- **Customizable**: Configure via data attributes or Impartner API
- **Nintex Branding**: Styled with Nintex brand colors (#FF6B00 orange)

## Installation

### 1. Install Dependencies

```bash
cd vimeo-video-player
npm install
```

### 2. Build the Widget

```bash
npm run build
```

This creates `dist/vimeo_video_player_min.js`

### 3. Upload to Impartner

1. Log into Impartner PRM Admin
2. Navigate to **Developer Tools > Extensibility > Widgets**
3. Click **Create Widget**
4. Configure:
   - **Name**: Vimeo Video Player
   - **API Name**: `custom.vimeo-player`
   - **Description**: Display Vimeo videos in a gallery view
   - **Version**: 1.0.0
   
5. Upload `dist/vimeo_video_player_min.js`

6. Configure Modes:
   - **View Mode**: `uw-vimeo-player-view`
   - **Edit Mode**: `uw-vimeo-player-edit`

### 4. Add to PX Studio

1. Go to **PX Studio**
2. Click **"+ Add a widget"**
3. Search for "Vimeo Video Player"
4. Place on your page

## Usage

### Basic Usage (with demo data)

Simply add the widget to your page. It includes demo videos for testing.

### With Custom Videos (Data Attributes)

```html
<uw-vimeo-player-view 
  data-title="Training Videos"
  data-videos='[
    {
      "id": "video1",
      "url": "https://vimeo.com/76979871",
      "title": "Introduction Video",
      "description": "Getting started guide",
      "category": "Training"
    },
    {
      "id": "video2",
      "url": "https://vimeo.com/123456789/abc123def",
      "title": "Private Video",
      "description": "This video requires authentication",
      "category": "Internal"
    }
  ]'
></uw-vimeo-player-view>
```

### With Impartner API

```html
<uw-vimeo-player-view 
  data-title="Partner Resources"
  data-api-endpoint="/api/objects/v1/training-videos"
></uw-vimeo-player-view>
```

## Supported URL Formats

The widget supports all Vimeo URL formats:

- Standard: `https://vimeo.com/123456789`
- Player: `https://player.vimeo.com/video/123456789`
- Private (with hash): `https://vimeo.com/123456789/abc123def`
- Embed URLs: `https://player.vimeo.com/video/123456789?h=abc123def`
- ID/Hash only: `123456789/abc123def`

## Video Data Structure

When using the API or data attributes, videos should follow this structure:

```javascript
{
  "id": "unique-id",              // Required: Unique identifier
  "url": "vimeo-url",             // Required: Vimeo URL (any format)
  "title": "Video Title",         // Required: Display title
  "description": "Description",   // Optional: Short description
  "thumbnail": "thumbnail-url",   // Optional: Custom thumbnail (uses Vimeo's if not provided)
  "duration": 120,                // Optional: Duration in seconds
  "category": "Training",         // Optional: Category/tag
  "tags": ["tutorial", "demo"]    // Optional: Array of tags
}
```

## Impartner Custom Object Setup

If storing videos in Impartner, create a custom object with these fields:

```yaml
Object Name: Training Videos
API Name: training-videos

Fields:
  - vimeo_url (Text, Required)
  - title (Text, Required)
  - description (Long Text)
  - thumbnail_url (Text)
  - duration (Number)
  - category (Text)
  - tags (Text)
```

Then use the API endpoint:
```
/api/objects/v1/training-videos
```

## Configuration Options

### View Mode Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | string | "Video Library" | Widget header title |
| `videos` | array/string | [] | Array of video objects or JSON string |
| `apiEndpoint` | string | null | Impartner API endpoint to fetch videos |

### Edit Mode Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `videoId` | string | null | ID of video to edit (for update mode) |
| `apiEndpoint` | string | "/api/objects/v1/videos" | API endpoint for save operations |

## Development

### Development Mode

```bash
npm run dev
```

Watches for file changes and rebuilds automatically.

### Development Server

```bash
npm run serve
```

Starts a local dev server at http://localhost:9000

## Styling

The widget uses Nintex brand colors:
- Primary Orange: `#FF6B00`
- Secondary Blue: `#0066CC`

All styles are encapsulated in Shadow DOM to prevent conflicts with Impartner's styles.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Videos not loading

1. Check browser console for errors
2. Verify Vimeo URLs are valid
3. Check CORS settings for thumbnail fetching
4. Ensure API endpoint returns correct data structure

### Thumbnails not showing

- The widget attempts to fetch thumbnails from Vimeo's oEmbed API
- For private videos, provide custom thumbnail URLs
- Check network tab for CORS issues

### Private videos not playing

- Ensure the URL includes the hash parameter: `vimeo.com/ID/HASH`
- Verify the video privacy settings in Vimeo

## License

MIT

## Support

For issues or questions, contact the Nintex development team.
