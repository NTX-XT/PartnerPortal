# Nintex Partner Portal - Style Guide

**Version:** 1.0.0  
**Last Updated:** December 2025

This guide documents the standard styling patterns for the Nintex Partner Portal. Follow these conventions to ensure consistency across all pages.

---

## Table of Contents

1. [CSS Files & Loading Order](#css-files--loading-order)
2. [Color System](#color-system)
3. [Page Structure Template](#page-structure-template)
4. [Banner Styles](#banner-styles)
5. [Content Containers](#content-containers)
6. [Icons](#icons)
7. [Buttons](#buttons)
8. [Alert Panels](#alert-panels)
9. [Resource Rows](#resource-rows)
10. [Remember/Info Boxes](#rememberinfo-boxes)
11. [Responsive Behavior](#responsive-behavior)

---

## CSS Files & Loading Order

Always include CSS files in this order with cache-busting version parameters:

```html
<link href="https://ntxtemplatestorage.blob.core.windows.net/partner/partnerportal.css" rel="stylesheet" />
<link href="https://ntxtemplatestorage.blob.core.windows.net/partner/background.css?v=7" rel="stylesheet" />
<link href="https://ntxtemplatestorage.blob.core.windows.net/partner/content.css?v=21" rel="stylesheet" />
```

| File | Purpose | Version |
|------|---------|---------|
| `partnerportal.css` | Base styles, CSS variables, typography | Base |
| `background.css` | Full-page animations (orbs, wave lines) | ?v=7 |
| `content.css` | Content styling, panels, forms, utilities | ?v=21 |

**Important:** Always increment the version number when uploading changes to bust browser cache.

---

## Color System

### CSS Variables (Defined in partnerportal.css)

Use CSS variables instead of hardcoded hex values:

```css
/* Primary Colors */
--primary-color: #FF6B00;     /* Nintex Orange - CTAs, highlights */
--secondary-color: #0066CC;   /* Nintex Blue - Links, secondary actions */

/* Text Colors */
--text-dark: #333333;         /* Primary text */
--text-muted: #6b7280;        /* Secondary/helper text */

/* Backgrounds */
--background-light: #f8f9fa;  /* Light gray backgrounds */

/* Spacing */
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;

/* Typography */
--font-sm: 0.875rem;          /* 14px */
--font-base: 1rem;            /* 16px */
--font-lg: 1.125rem;          /* 18px */
--font-xl: 1.25rem;           /* 20px */

/* Border Radius */
--border-radius: 8px;
--border-radius-sm: 4px;
--border-radius-lg: 12px;
```

### ❌ DON'T Use Inline Colors

```html
<!-- BAD - Don't do this -->
<i class="fas fa-robot" style="color: #FF6B00;"></i>
<div style="background-color: #0066CC;">
```

### ✅ DO Use Icon Utility Classes

```html
<!-- GOOD - Use utility classes -->
<i class="fas fa-robot icon-primary"></i>
<i class="fas fa-cogs icon-secondary"></i>
```

---

## Page Structure Template

Every page should follow this structure for full-page animations:

```html
<!-- 1. CSS Links (with versions) -->
<link href=".../partnerportal.css" rel="stylesheet" />
<link href=".../background.css?v=7" rel="stylesheet" />
<link href=".../content.css?v=21" rel="stylesheet" />

<!-- 2. Full Page Background Animation (FIRST - outside all content) -->
<div class="page-background-animation">
  <div class="nintex-background-animation">
    <div class="nintex-orbs-animation-wrapper nintex-container">
      <div class="nintex-orbs-animation">
        <div class="nintex-orbs-animation__orb orb-purple"> </div>
        <div class="nintex-orbs-animation__orb orb-orange"> </div>
        <div class="nintex-orbs-animation__orb orb-pink"> </div>
      </div>
    </div>
    <div class="nintex-lines-animation">
      <svg><!-- Wave 1 --></svg>
    </div>
    <div class="nintex-lines-animation nintex-lines-animation-2">
      <svg><!-- Wave 2 --></svg>
    </div>
  </div>
</div>

<!-- 3. Page Header Bar (simple banner, no animation inside) -->
<div class="page-header-bar background-blue">
  <section class="main-banner">
    <!-- Banner content -->
  </section>
</div>

<!-- 4. Main Content Container -->
<div class="container pricing-resources-container">
  <!-- Page content with glass background effect -->
</div>
```

### Wave Line SVG (Copy this exact markup)

```html
<svg fill="none" viewbox="0 0 5392 393" xmlns="http://www.w3.org/2000/svg">
  <path d="M1.09229 380.193C256.031 398.471 485.518 390.369 880.247 185.382C1106.65 67.8087 1461.65 -152.288 2122.03 187.076C2244.01 249.758 2521.84 361.57 2696.34 380.205M2696 380.193C2950.94 398.471 3180.43 390.369 3575.15 185.382C3801.56 67.8087 4156.56 -152.288 4816.94 187.076C4938.92 249.758 5216.75 361.57 5391.24 380.205" stroke="white" stroke-miterlimit="10" stroke-width="10"></path>
</svg>
```

---

## Banner Styles

### Page Header Bar

```html
<div class="page-header-bar background-blue">
  <section class="main-banner">
    <div class="container-fluid">
      <div class="row align-items-center">
        <div class="col-lg-7 col-md-6">
          <div class="banner-welcome">
            <h1 class="banner-header">Page Title</h1>
            <p class="banner-text">Page description text</p>
          </div>
        </div>
        <div class="col-lg-5 col-md-6">
          <div class="banner-actions">
            <!-- Action buttons and quick links -->
          </div>
        </div>
      </div>
    </div>
  </section>
</div>
```

### Banner Action Buttons

```html
<div class="banner-actions">
  <div class="action-buttons">
    <a class="btn btn-light" href="#" target="_blank">
      <i class="fas fa-file-pdf me-2"></i>PRIMARY ACTION
    </a>
    <a class="btn btn-outline-light" href="#" target="_blank">
      <i class="fas fa-clipboard-list me-2"></i>SECONDARY ACTION
    </a>
  </div>
  <div class="quick-links">
    <a class="quick-link" href="#" target="_blank">
      <i class="fas fa-book"></i> Documentation
    </a>
    <a class="quick-link" href="#" target="_blank">
      <i class="fas fa-headset"></i> Support
    </a>
  </div>
</div>
```

---

## Content Containers

### Pricing Resources Container (Glass Effect)

The main content container automatically gets a glass background effect:

```html
<div class="container pricing-resources-container">
  <div class="row">
    <div class="col-md-6">
      <!-- Left column content -->
    </div>
    <div class="col-md-6">
      <!-- Right column content -->
    </div>
  </div>
</div>
```

### Pricing News Panel

Use for grouped content sections:

```html
<div class="pricing-news-panel">
  <h2 class="panel-title">SECTION TITLE</h2>
  
  <div class="resource-row">
    <!-- Resource items -->
  </div>
</div>
```

---

## Icons

### Icon Color Utility Classes

Always use these classes instead of inline styles:

| Class | Color | Use Case |
|-------|-------|----------|
| `.icon-primary` | var(--primary-color) Orange | Primary actions, highlights |
| `.icon-secondary` | var(--secondary-color) Blue | Secondary items, links |
| `.icon-success` | var(--color-success) Green | Success, training, positive |
| `.icon-warning` | var(--color-warning) Amber | Warnings, attention |
| `.icon-danger` | var(--color-danger) Red | Errors, critical, DocGen |
| `.icon-info` | var(--color-info) Cyan | Information, eSign |
| `.icon-purple` | var(--anim-purple) Purple | Process Manager, special features |
| `.icon-salesforce` | var(--color-salesforce) Blue | Salesforce integrations |
| `.icon-dark` | var(--text-dark) Dark gray | Neutral icons |

### Usage Examples

```html
<!-- Primary (Orange) -->
<div class="resource-icon">
  <i class="fas fa-robot icon-primary"></i>
</div>

<!-- Secondary (Blue) -->
<div class="resource-icon">
  <i class="fas fa-cogs icon-secondary"></i>
</div>

<!-- Alternating pattern (recommended for visual variety) -->
<div class="resource-icon"><i class="fas fa-download icon-primary"></i></div>
<div class="resource-icon"><i class="fas fa-file-alt icon-secondary"></i></div>
<div class="resource-icon"><i class="fas fa-cloud icon-primary"></i></div>
```

### Common Font Awesome Icons

| Icon | Class | Use Case |
|------|-------|----------|
| 🤖 | `fa-robot` | RPA, automation |
| ⚙️ | `fa-cogs` | Settings, configuration |
| 📥 | `fa-download` | Downloads |
| 📄 | `fa-file-alt` | Documents, release notes |
| 📚 | `fa-book` | Guides, documentation |
| 👤 | `fa-user` | User guides |
| 🔧 | `fa-wrench` | Fix packs, tools |
| 🔗 | `fa-external-link-alt` | External links |
| 🔑 | `fa-key` | License, access |
| 🔄 | `fa-sync` | Updates, refresh |
| ☁️ | `fa-cloud` | Cloud services |
| 🔌 | `fa-plug` | Connectors, integrations |
| 📁 | `fa-archive` | Legacy, archive |
| 🖥️ | `fa-server` | Servers |
| 🌐 | `fa-share-alt` | SharePoint |
| 🔀 | `fa-code-branch` | Versions, branches |

---

## Buttons

### Button Classes

| Class | Appearance | Use Case |
|-------|------------|----------|
| `.btn.btn-primary` | Orange filled | Primary download/action |
| `.btn.btn-outline-primary` | Orange outline | Secondary actions |
| `.btn.btn-secondary` | Gray filled | Legacy/archive links |
| `.btn.btn-light` | White filled | Banner primary action |
| `.btn.btn-outline-light` | White outline | Banner secondary action |

### Size Modifier

Add `.btn-sm` for smaller buttons in resource rows:

```html
<a class="btn btn-primary btn-sm" href="#">
  <i class="fas fa-download me-2"></i>Download
</a>
```

### Resource Buttons Container

Always wrap button groups in `.resource-buttons`:

```html
<div class="resource-buttons">
  <a class="btn btn-primary btn-sm" href="#" target="_blank">
    <i class="fas fa-download me-2"></i>Download Package
  </a>
  <a class="btn btn-outline-primary btn-sm" href="#" target="_blank">
    <i class="fas fa-file-alt me-2"></i>Release Notes
  </a>
  <a class="btn btn-outline-primary btn-sm" href="#" target="_blank">
    <i class="fas fa-book me-2"></i>Install Guide
  </a>
</div>
```

---

## Alert Panels

Use for important notices, warnings, or recommendations:

### Alert Types

```html
<!-- Info (Blue) - Recommendations, tips -->
<div class="alert-panel alert-info">
  <i class="fas fa-check-circle"></i>
  <span>Recommended for production environments - Long Term Support (LTS)</span>
</div>

<!-- Warning (Amber) - Important notices -->
<div class="alert-panel alert-warning">
  <i class="fas fa-exclamation-triangle"></i>
  <span>This is a Short Term Support (STS) Release. Support ends December 2025.</span>
</div>

<!-- Success (Green) - Positive confirmations -->
<div class="alert-panel alert-success">
  <i class="fas fa-check-circle"></i>
  <span>Successfully configured and ready to use.</span>
</div>

<!-- Danger (Red) - Critical warnings -->
<div class="alert-panel alert-danger">
  <i class="fas fa-exclamation-circle"></i>
  <span>This version is deprecated. Please upgrade immediately.</span>
</div>
```

### Common Alert Icons

| Alert Type | Recommended Icon |
|------------|------------------|
| Info | `fa-info-circle` or `fa-check-circle` |
| Warning | `fa-exclamation-triangle` |
| Success | `fa-check-circle` |
| Danger | `fa-exclamation-circle` or `fa-times-circle` |

---

## Resource Rows

### Standard Resource Row Structure

```html
<div class="resource-row">
  <div class="resource-item">
    <div class="resource-icon">
      <i class="fas fa-robot icon-primary"></i>
    </div>
    <div class="resource-content">
      <h3 class="resource-title">RESOURCE TITLE</h3>
      <p class="resource-desc">Description of the resource</p>
      
      <!-- Optional: Alert panel for important notices -->
      <div class="alert-panel alert-info">
        <i class="fas fa-check-circle"></i>
        <span>Recommended version</span>
      </div>
      
      <div class="resource-buttons">
        <a class="btn btn-primary btn-sm" href="#" target="_blank">
          <i class="fas fa-download me-2"></i>Download
        </a>
        <a class="btn btn-outline-primary btn-sm" href="#" target="_blank">
          <i class="fas fa-file-alt me-2"></i>Release Notes
        </a>
      </div>
    </div>
  </div>
</div>
```

### Icon Color Alternation Pattern

For visual variety, alternate between primary and secondary icon colors:

```html
<!-- Row 1: Primary (Orange) -->
<div class="resource-icon"><i class="fas fa-robot icon-primary"></i></div>

<!-- Row 2: Secondary (Blue) -->
<div class="resource-icon"><i class="fas fa-cogs icon-secondary"></i></div>

<!-- Row 3: Primary (Orange) -->
<div class="resource-icon"><i class="fas fa-cloud icon-primary"></i></div>

<!-- Row 4: Secondary (Blue) -->
<div class="resource-icon"><i class="fas fa-server icon-secondary"></i></div>
```

---

## Remember/Info Boxes

Use for important callouts at the bottom of pages:

```html
<div class="remember-box">
  <div class="remember-box-content">
    <div class="remember-icon">
      <i class="fas fa-lightbulb"></i>
    </div>
    <div class="remember-text-container">
      <div class="remember-title">BOX TITLE</div>
      <div class="remember-text">
        Box content text with <a class="news-link" href="#" target="_blank">links styled appropriately</a>.
      </div>
    </div>
  </div>
</div>
```

### Common Remember Box Icons

| Icon | Use Case |
|------|----------|
| `fa-lightbulb` | Tips, resources |
| `fa-info-circle` | Information |
| `fa-exclamation-triangle` | Important warnings |
| `fa-phone` | Contact information |

---

## Responsive Behavior

The CSS handles responsive design automatically. Key breakpoints:

| Breakpoint | Behavior |
|------------|----------|
| `> 992px` | Full two-column layout, horizontal buttons |
| `768px - 992px` | Two columns, stacked banner actions |
| `< 768px` | Single column, full-width buttons |
| `< 576px` | Mobile layout, vertical button stacks |

### Mobile Considerations

- Banner action buttons stack vertically on mobile
- Quick links wrap to multiple lines
- Resource buttons wrap naturally with `flex-wrap: wrap`
- Columns collapse to single column below 768px

---

## Complete Page Example

```html
<link href="https://ntxtemplatestorage.blob.core.windows.net/partner/partnerportal.css" rel="stylesheet" />
<link href="https://ntxtemplatestorage.blob.core.windows.net/partner/background.css?v=7" rel="stylesheet" />
<link href="https://ntxtemplatestorage.blob.core.windows.net/partner/content.css?v=21" rel="stylesheet" />

<!-- Full Page Background Animation -->
<div class="page-background-animation">
  <div class="nintex-background-animation">
    <div class="nintex-orbs-animation-wrapper nintex-container">
      <div class="nintex-orbs-animation">
        <div class="nintex-orbs-animation__orb orb-purple"> </div>
        <div class="nintex-orbs-animation__orb orb-orange"> </div>
        <div class="nintex-orbs-animation__orb orb-pink"> </div>
      </div>
    </div>
    <div class="nintex-lines-animation">
      <svg fill="none" viewbox="0 0 5392 393" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.09229 380.193C256.031 398.471 485.518 390.369 880.247 185.382C1106.65 67.8087 1461.65 -152.288 2122.03 187.076C2244.01 249.758 2521.84 361.57 2696.34 380.205M2696 380.193C2950.94 398.471 3180.43 390.369 3575.15 185.382C3801.56 67.8087 4156.56 -152.288 4816.94 187.076C4938.92 249.758 5216.75 361.57 5391.24 380.205" stroke="white" stroke-miterlimit="10" stroke-width="10"></path>
      </svg>
    </div>
    <div class="nintex-lines-animation nintex-lines-animation-2">
      <svg fill="none" viewbox="0 0 5392 393" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.09229 380.193C256.031 398.471 485.518 390.369 880.247 185.382C1106.65 67.8087 1461.65 -152.288 2122.03 187.076C2244.01 249.758 2521.84 361.57 2696.34 380.205M2696 380.193C2950.94 398.471 3180.43 390.369 3575.15 185.382C3801.56 67.8087 4156.56 -152.288 4816.94 187.076C4938.92 249.758 5216.75 361.57 5391.24 380.205" stroke="white" stroke-miterlimit="10" stroke-width="10"></path>
      </svg>
    </div>
  </div>
</div>

<!-- Page Header -->
<div class="page-header-bar background-blue">
  <section class="main-banner">
    <div class="container-fluid">
      <div class="row align-items-center">
        <div class="col-lg-7 col-md-6">
          <div class="banner-welcome">
            <h1 class="banner-header">Page Title</h1>
            <p class="banner-text">Page description goes here</p>
          </div>
        </div>
        <div class="col-lg-5 col-md-6">
          <div class="banner-actions">
            <div class="action-buttons">
              <a class="btn btn-light" href="#" target="_blank">
                <i class="fas fa-file-pdf me-2"></i>PRIMARY ACTION
              </a>
              <a class="btn btn-outline-light" href="#" target="_blank">
                <i class="fas fa-external-link-alt me-2"></i>SECONDARY ACTION
              </a>
            </div>
            <div class="quick-links">
              <a class="quick-link" href="#" target="_blank"><i class="fas fa-book"></i> Docs</a>
              <a class="quick-link" href="#" target="_blank"><i class="fas fa-headset"></i> Support</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</div>

<!-- Main Content -->
<div class="container pricing-resources-container">
  <div class="row">
    <div class="col-md-6">
      <div class="pricing-news-panel">
        <h2 class="panel-title">SECTION TITLE</h2>
        
        <div class="resource-row">
          <div class="resource-item">
            <div class="resource-icon">
              <i class="fas fa-cogs icon-primary"></i>
            </div>
            <div class="resource-content">
              <h3 class="resource-title">RESOURCE NAME</h3>
              <p class="resource-desc">Resource description</p>
              <div class="resource-buttons">
                <a class="btn btn-primary btn-sm" href="#" target="_blank">
                  <i class="fas fa-download me-2"></i>Download
                </a>
                <a class="btn btn-outline-primary btn-sm" href="#" target="_blank">
                  <i class="fas fa-file-alt me-2"></i>Release Notes
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="col-md-6">
      <!-- Right column content -->
    </div>
  </div>
  
  <div class="remember-box">
    <div class="remember-box-content">
      <div class="remember-icon"><i class="fas fa-lightbulb"></i></div>
      <div class="remember-text-container">
        <div class="remember-title">HELPFUL TIP</div>
        <div class="remember-text">Additional information for users.</div>
      </div>
    </div>
  </div>
</div>
```

---

## Checklist for New Pages

- [ ] CSS files included in correct order with version parameters
- [ ] `page-background-animation` is FIRST element (outside all content)
- [ ] Two wave lines included (`.nintex-lines-animation` and `.nintex-lines-animation-2`)
- [ ] `page-header-bar background-blue` used for banner (not `main-banner-with-animation`)
- [ ] No inline `style="color: #xxx"` - use icon utility classes
- [ ] Buttons wrapped in `.resource-buttons` container
- [ ] `.btn-sm` used for buttons inside resource rows
- [ ] Alert panels used for important notices (STS/LTS, warnings, etc.)
- [ ] Icon colors alternate between primary and secondary for visual variety
- [ ] All external links have `target="_blank"`
- [ ] Panel titles and resource titles are UPPERCASE

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Dec 2025 | Initial style guide |
