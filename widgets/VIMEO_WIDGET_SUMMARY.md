# Vimeo Video Player Widget - Quick Reference

## What is this?

A production-ready Impartner custom widget that displays Vimeo videos in an interactive gallery with modal playback. Built with React and packaged as a Web Component.

## 🚀 Quick Start

```bash
cd vimeo-video-player
npm install
npm run build
```

Upload `dist/vimeo_video_player_min.js` to Impartner → Developer Tools → Extensibility → Widgets

## 📋 Widget Configuration

- **API Name**: `custom.vimeo-player`
- **View Tag**: `uw-vimeo-player-view`
- **Edit Tag**: `uw-vimeo-player-edit`

## ✨ Key Features

- ✅ Responsive grid layout with video cards
- ✅ Modal video player with Nintex branding
- ✅ Support for private Vimeo videos (with hash)
- ✅ Automatic thumbnail fetching from Vimeo
- ✅ Add/edit video management
- ✅ Integration with Impartner API
- ✅ Mobile-friendly and accessible

## 📦 Project Structure

```
vimeo-video-player/
├── src/
│   ├── index.js                     # Web Component registration
│   ├── components/
│   │   ├── ViewMode.jsx             # Gallery view
│   │   ├── EditMode.jsx             # Add/edit form
│   │   └── shared/
│   │       ├── VideoCard.jsx        # Video card component
│   │       ├── VideoModal.jsx       # Modal player
│   │       └── LoadingState.jsx     # UI states
│   ├── services/
│   │   ├── vimeoApi.js              # Vimeo URL parsing & embedding
│   │   └── impartnerApi.js          # Impartner API integration
│   └── styles/
│       ├── view.css                 # View mode styling
│       └── edit.css                 # Edit mode styling
├── package.json
├── webpack.config.js
├── README.md                        # Full documentation
├── DEPLOYMENT.md                    # Deployment guide
└── demo.html                        # Local testing page
```

## 🎨 Design System

Built with Nintex brand colors:
- Primary: `#FF6B00` (Nintex Orange)
- Secondary: `#0066CC` (Nintex Blue)

## 🔌 Usage Examples

### Static Videos
```html
<uw-vimeo-player-view 
  data-title="Training Videos"
  data-videos='[...]'
></uw-vimeo-player-view>
```

### API Integration
```html
<uw-vimeo-player-view 
  data-api-endpoint="/api/objects/v1/videos"
></uw-vimeo-player-view>
```

## 📖 Documentation

- **README.md** - Complete feature documentation
- **DEPLOYMENT.md** - Step-by-step deployment guide
- **demo.html** - Interactive examples

## 🛠️ Development Commands

```bash
npm run build    # Production build
npm run dev      # Watch mode
npm run serve    # Dev server (localhost:9000)
```

## 📝 Notes

- Reuses patterns from existing `vimeo-modal.js` in the portal
- Follows Impartner widget architecture from `COPILOT_INSTRUCTIONS_Impartner_Custom_Widgets.md`
- Styled to match Nintex Partner Portal design system
- Shadow DOM encapsulation prevents style conflicts
- Fully accessible with keyboard navigation

## 🤝 Integration with Portal

This widget can work alongside the existing `vimeo-modal.js` file in the portal. Both share the same Vimeo URL parsing logic and support private videos with hash parameters.

---

Created: November 17, 2025
Version: 1.0.0
