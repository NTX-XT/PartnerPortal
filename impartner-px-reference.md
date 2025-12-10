# Impartner PX Design System Reference

> **For AI Agents & Developers**: Use this reference when building HTML pages for Impartner PX/PRM partner portals. These classes are available natively in the PX platform.

## Quick Start

Impartner PX uses **Bootstrap 5** as its foundation with custom `impdc-*` prefixed components. When building WYSIWYG content:

1. Use Bootstrap classes for basic styling (buttons, cards, alerts, badges)
2. Use `impdc-*` classes for Impartner-specific components
3. Keep custom CSS minimal - leverage the platform's built-in styles

---

## Buttons

### Standard Buttons
```html
<button class="btn btn-primary">Primary Action</button>
<button class="btn btn-outline-primary">Secondary Action</button>
<button class="btn btn-outline-danger">Danger</button>
<button class="btn btn-outline-success">Success</button>
<button class="btn btn-link">Link Style</button>
```

### Button Sizes
```html
<button class="btn btn-primary btn-lg">Large</button>
<button class="btn btn-primary">Default</button>
<button class="btn btn-primary btn-sm">Small</button>
<button class="btn btn-primary btn-xs">Extra Small</button>
```

### Button Groups
```html
<div class="btn-group">
    <button class="btn btn-outline-primary">Option 1</button>
    <button class="btn btn-outline-primary">Option 2</button>
    <button class="btn btn-outline-primary">Option 3</button>
</div>
```

---

## Cards

### Basic Card
```html
<div class="card">
    <div class="card-body">
        Card content goes here
    </div>
</div>
```

### Card with Header
```html
<div class="card">
    <div class="card-heading">
        <div class="card-heading-body">
            <h5>Card Title</h5>
            <button class="btn btn-primary">Action</button>
        </div>
    </div>
    <div class="card-body">
        Card content
    </div>
    <div class="card-footer">
        Footer content
    </div>
</div>
```

### Data Card (Impartner Custom)
```html
<div class="card impdc-data-card">
    <div class="card-body impdc-data-card-body">
        <div class="impdc-data-card-icon">
            <i class="fa fa-chart-line"></i>
        </div>
        <div class="impdc-data-card-container">
            <div class="impdc-data-card-title">Metric Name</div>
            <div class="impdc-data-card-data">$1,234</div>
        </div>
        <div class="impdc-data-card-corner">
            <span class="badge">New</span>
        </div>
    </div>
    <div class="card-footer impdc-data-card-footer">
        Footer info
    </div>
</div>
```

---

## Alerts

### Standard Alerts
```html
<!-- Success Alert -->
<div class="impdc alert alert-success">
    <div class="alert-icon"><i class="fa fa-check-circle"></i></div>
    <div class="alert-content">
        <div class="alert-heading">Success!</div>
        <div class="alert-body">Your action was completed successfully.</div>
    </div>
</div>

<!-- Dismissible Alert -->
<div class="impdc alert alert-success alert-dismissible">
    <div class="alert-icon"><i class="fa fa-check-circle"></i></div>
    <div class="alert-content">
        <div class="alert-heading">Notice</div>
        <div class="alert-body">This alert can be dismissed.</div>
    </div>
    <button class="btn-close" aria-label="Close"></button>
</div>

<!-- Inline Alert (compact) -->
<div class="impdc alert alert-success alert-inline">
    <div class="alert-icon"><i class="fa fa-info-circle"></i></div>
    <div class="alert-content alert-content-heading-only">
        <div class="alert-heading">Inline message</div>
    </div>
</div>
```

### Alert with Actions
```html
<div class="impdc alert alert-success">
    <div class="alert-icon"><i class="fa fa-check-circle"></i></div>
    <div class="alert-content">
        <div class="alert-heading">Action Required</div>
        <div class="alert-body">Please review and confirm.</div>
        <div class="alert-actions">
            <button class="btn btn-primary btn-sm">Confirm</button>
            <button class="btn btn-outline-primary btn-sm">Cancel</button>
        </div>
    </div>
</div>
```

---

## Badges

```html
<span class="badge">Default</span>
<span class="badge bg-primary">Primary</span>
<span class="badge bg-success">Success</span>
<span class="badge bg-warning">Warning</span>
<span class="badge bg-danger">Danger</span>
<span class="badge bg-info">Info</span>
```

---

## Tags (Impartner Custom)

```html
<span class="impdc-tag--text">Basic Tag</span>
<span class="impdc-tag--text impdc-tag--rounded">Rounded Tag</span>
<span class="impdc-tag--text impdc-tag--theme-outline">Outline Tag</span>
<span class="impdc-tag--text impdc-tag--button">Clickable Tag</span>
```

---

## Forms

### Text Input
```html
<div class="impdc-form-field impdc-form-field-type-impdc-input">
    <div class="impdc-form-field--labels-container">
        <div class="impdc-form-field--labels-subcontainer">
            <label class="form-label impdc-form-field--label">Field Label</label>
        </div>
    </div>
    <div class="impdc-form-field-wrapper">
        <div class="impdc-form-field--text">
            <input type="text" class="impdc-input form-control impdc-form-field-control" placeholder="Enter value">
        </div>
    </div>
    <div class="impdc-form-field-feedback"></div>
</div>
```

### Simple Bootstrap Form (Recommended for WYSIWYG)
```html
<div class="mb-3">
    <label class="form-label">Email Address</label>
    <input type="email" class="form-control" placeholder="name@example.com">
</div>

<div class="mb-3">
    <label class="form-label">Select Option</label>
    <select class="form-select">
        <option>Choose...</option>
        <option>Option 1</option>
        <option>Option 2</option>
    </select>
</div>

<div class="mb-3">
    <label class="form-label">Message</label>
    <textarea class="form-control" rows="3"></textarea>
</div>
```

### Checkbox
```html
<div class="form-check">
    <input class="form-check-input" type="checkbox" id="check1">
    <label class="form-check-label" for="check1">Check this option</label>
</div>
```

### Radio Buttons
```html
<div class="form-check">
    <input class="form-check-input" type="radio" name="options" id="opt1">
    <label class="form-check-label" for="opt1">Option 1</label>
</div>
<div class="form-check">
    <input class="form-check-input" type="radio" name="options" id="opt2">
    <label class="form-check-label" for="opt2">Option 2</label>
</div>
```

### Toggle Switch
```html
<div class="form-check form-switch">
    <input class="form-check-input" type="checkbox" id="toggle1">
    <label class="form-check-label" for="toggle1">Enable Feature</label>
</div>
```

### Input with Prefix/Suffix
```html
<div class="impdc-form-field-wrapper">
    <div class="impdc-form-field--text impdc-form-field--text--has-text-prefix">
        <span class="input-group-text">$</span>
        <input type="text" class="impdc-input form-control" placeholder="0.00">
    </div>
</div>
```

---

## Modal Layout

```html
<div class="impdc-modal-layout--theme-simple">
    <div class="impdc-modal-layout--modal-header">
        <div class="impdc-modal-layout--modal-title">
            <span class="impdc-modal-layout--modal-title-text">Modal Title</span>
        </div>
    </div>
    <div class="impdc-modal-layout--modal-body">
        Modal content goes here
    </div>
    <div class="impdc-modal-layout--modal-footer">
        <button class="btn btn-outline-primary">Cancel</button>
        <button class="btn btn-primary">Save</button>
    </div>
</div>
```

---

## Breadcrumb

```html
<nav class="impdc-breadcrumb">
    <a href="#">Home</a>
    <span>/</span>
    <a href="#">Category</a>
    <span>/</span>
    <span>Current Page</span>
</nav>
```

---

## Tables

Tables in Impartner PX use the `impdc-table-*` class system for advanced features:

```html
<table class="table">
    <thead>
        <tr>
            <th class="impdc-table-sort">Name</th>
            <th>Status</th>
            <th>Actions</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Item Name</td>
            <td><span class="badge bg-success">Active</span></td>
            <td>
                <button class="btn btn-sm btn-outline-primary">Edit</button>
            </td>
        </tr>
    </tbody>
</table>
```

### Table Row Actions
```html
<div class="impdc-table-row-actions--dropdown">
    <button class="btn btn-link btn-sm">
        <i class="fa fa-ellipsis-v"></i>
    </button>
</div>
```

### Collapsible Table Row
```html
<tr class="impdc-table-collapsible-content-row">
    <td colspan="3">
        <div class="impdc-table-collapsible-content-container">
            Expanded content here
        </div>
    </td>
</tr>
```

---

## Pagination

```html
<div class="d-flex align-items-center gap-2">
    <div class="pagination-first-last-btns">
        <button class="btn btn-outline-primary" disabled>First</button>
        <button class="btn btn-outline-primary" disabled>Prev</button>
    </div>
    <span>Page 1 of 10</span>
    <div class="pagination-first-last-btns">
        <button class="btn btn-outline-primary">Next</button>
        <button class="btn btn-outline-primary">Last</button>
    </div>
</div>
```

---

## Scrollable Container

```html
<div class="impdc-scrollable">
    <!-- Long content here -->
</div>

<div class="impdc-scrollable impdc-scrollable-right">
    <!-- Scrollable with right alignment -->
</div>
```

---

## File Upload

```html
<div class="impdc-file-upload impdc-file-upload--empty">
    <div class="impdc-file-upload-container">
        <div class="impdc-file-upload-dropzone">
            <i class="fa fa-cloud-upload"></i>
            <p>Drag & drop files here or click to browse</p>
        </div>
    </div>
</div>
```

---

## Icons

Impartner PX uses **Font Awesome** icons. Common patterns:

```html
<i class="fa fa-check-circle"></i>      <!-- Success -->
<i class="fa fa-exclamation-circle"></i> <!-- Warning -->
<i class="fa fa-info-circle"></i>        <!-- Info -->
<i class="fa fa-times-circle"></i>       <!-- Error -->
<i class="fa fa-user"></i>               <!-- User -->
<i class="fa fa-cog"></i>                <!-- Settings -->
<i class="fa fa-download"></i>           <!-- Download -->
<i class="fa fa-external-link"></i>      <!-- External link -->
<i class="fa fa-chevron-right"></i>      <!-- Arrow -->
```

---

## Utility Classes

### Spacing (Bootstrap)
```html
<div class="mt-3">Margin top 3</div>
<div class="mb-3">Margin bottom 3</div>
<div class="p-3">Padding 3</div>
<div class="px-4">Padding horizontal 4</div>
<div class="py-2">Padding vertical 2</div>
```

### Flexbox
```html
<div class="d-flex">Flex container</div>
<div class="d-flex justify-content-between">Space between</div>
<div class="d-flex align-items-center">Vertically centered</div>
<div class="d-flex gap-2">Gap between items</div>
```

### Text
```html
<p class="text-muted">Muted text</p>
<p class="text-center">Centered text</p>
<p class="fw-bold">Bold text</p>
<p class="fs-5">Larger text</p>
```

---

## Complete Page Example

```html
<!-- Header Bar -->
<div class="card mb-4">
    <div class="card-body d-flex justify-content-between align-items-center">
        <h4 class="mb-0">Page Title</h4>
        <button class="btn btn-primary">
            <i class="fa fa-plus"></i> Add New
        </button>
    </div>
</div>

<!-- Alert -->
<div class="impdc alert alert-success alert-inline mb-4">
    <div class="alert-icon"><i class="fa fa-info-circle"></i></div>
    <div class="alert-content alert-content-heading-only">
        <div class="alert-heading">Welcome to the partner portal!</div>
    </div>
</div>

<!-- Content Cards -->
<div class="row g-4">
    <div class="col-md-4">
        <div class="card h-100">
            <div class="card-body">
                <h5>Resource 1</h5>
                <p class="text-muted">Description text here</p>
                <a href="#" class="btn btn-outline-primary btn-sm">
                    Learn More <i class="fa fa-chevron-right"></i>
                </a>
            </div>
        </div>
    </div>
    <div class="col-md-4">
        <div class="card h-100">
            <div class="card-body">
                <h5>Resource 2</h5>
                <p class="text-muted">Description text here</p>
                <a href="#" class="btn btn-outline-primary btn-sm">
                    Learn More <i class="fa fa-chevron-right"></i>
                </a>
            </div>
        </div>
    </div>
    <div class="col-md-4">
        <div class="card h-100">
            <div class="card-body">
                <h5>Resource 3</h5>
                <p class="text-muted">Description text here</p>
                <a href="#" class="btn btn-outline-primary btn-sm">
                    Learn More <i class="fa fa-chevron-right"></i>
                </a>
            </div>
        </div>
    </div>
</div>
```

---

## CSS Class Quick Reference

| Component | Bootstrap Classes | Impartner Classes |
|-----------|------------------|-------------------|
| **Buttons** | `btn`, `btn-primary`, `btn-outline-primary`, `btn-sm`, `btn-lg`, `btn-xs`, `btn-link` | `btn-close-fa` |
| **Cards** | `card`, `card-body`, `card-footer` | `card-heading`, `card-heading-body`, `impdc-data-card`, `impdc-data-card-*` |
| **Alerts** | `alert`, `alert-success`, `alert-dismissible` | `impdc`, `alert-icon`, `alert-content`, `alert-heading`, `alert-body`, `alert-actions`, `alert-inline` |
| **Forms** | `form-control`, `form-select`, `form-label`, `form-check`, `form-check-input` | `impdc-form-field`, `impdc-input`, `impdc-select-*`, `impdc-checkbox`, `impdc-radio-*` |
| **Badges** | `badge`, `bg-primary`, `bg-success`, `bg-danger` | - |
| **Tags** | - | `impdc-tag--text`, `impdc-tag--rounded`, `impdc-tag--theme-outline` |
| **Tables** | `table` | `impdc-table-sort`, `impdc-table-row-actions--dropdown`, `impdc-table-collapsible-*` |
| **Modal** | - | `impdc-modal-layout--*`, `impdc-modals-container` |
| **Navigation** | - | `impdc-breadcrumb` |
| **Layout** | `d-flex`, `row`, `col-*`, `gap-*` | `impdc-scrollable` |

---

## Best Practices for WYSIWYG Content

1. **Keep it simple**: Use Bootstrap classes when possible
2. **Test responsiveness**: Use Bootstrap's grid (`row`, `col-md-*`)
3. **Consistent spacing**: Use Bootstrap spacing utilities (`mb-3`, `p-4`)
4. **Match platform style**: Use `btn-outline-primary` for secondary actions
5. **Accessible**: Always include `aria-label` on icon-only buttons
6. **No custom CSS if possible**: Leverage existing classes

---

*Generated from Impartner Storybook: https://design.impartner.com*
*Last updated: December 2024*
