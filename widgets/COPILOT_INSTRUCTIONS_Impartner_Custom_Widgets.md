# Visual Studio Copilot Instructions: Building Impartner Custom Widgets

## Context for Copilot
You are assisting developers in creating custom widgets for Impartner PRM (Partner Relationship Management) platform's PX (Partner Experience) Studio. These widgets are React-based Web Components that integrate into Impartner's partner portal interface.

## Platform Architecture Overview

### What Are Impartner Custom Widgets?
- **Purpose:** Extend PX Studio with custom dashboard/content components
- **Technology:** React components packaged as Web Components (Custom Elements)
- **Deployment:** Single bundled JavaScript file uploaded through Extensibility interface
- **Integration:** Widgets appear in PX Studio's "Add Widgets" menu alongside built-in widgets

### Technical Stack
```json
{
  "framework": "React 18+",
  "bundler": "Webpack 5",
  "webStandards": "Web Components (Custom Elements API)",
  "styling": "CSS/Bootstrap (HEX BSS)",
  "compatibility": "Zone.js for polyfills (optional)",
  "dataAccess": "Impartner REST API"
}
```

## Widget Structure Requirements

### 1. Widget Modes
Every widget MUST implement at least two modes:

#### View Mode (Required)
- **Purpose:** Display data in read-only format
- **Tag Convention:** `uw-{widgetname}-view`
- **Example:** `uw-certifications-view`

#### Edit Mode (Required)
- **Purpose:** Allow data modification
- **Tag Convention:** `uw-{widgetname}-edit`
- **Example:** `uw-certifications-edit`

#### Optional Modes
- **Settings Popover:** `uw-{widgetname}-settings`
- **Edit Modal:** `uw-{widgetname}-modal`

### 2. Naming Conventions

```javascript
// Widget API Name (in Impartner)
"custom.{widget-name}"

// Custom Element Tag Names
"uw-{widget-name}-{mode}"

// Example for "sales-pipeline" widget:
API Name: "custom.sales-pipeline"
View Tag: "uw-sales-pipeline-view"
Edit Tag: "uw-sales-pipeline-edit"
```

### 3. Project Structure

```
my-impartner-widget/
├── src/
│   ├── index.js                    # Entry point - registers custom elements
│   ├── components/
│   │   ├── ViewMode.jsx            # View mode component
│   │   ├── EditMode.jsx            # Edit mode component
│   │   └── shared/
│   │       ├── DataTable.jsx       # Reusable components
│   │       └── LoadingSpinner.jsx
│   ├── services/
│   │   ├── api.js                  # Impartner API integration
│   │   └── auth.js                 # Authentication helper
│   ├── hooks/
│   │   ├── useImpartnerData.js     # Custom hooks
│   │   └── useSegmentation.js
│   └── styles/
│       ├── view.css
│       └── edit.css
├── webpack.config.js               # Webpack configuration
├── package.json
└── README.md
```

## Development Workflow

### Step 1: Initialize Project

```bash
# Create new React project
mkdir my-impartner-widget
cd my-impartner-widget
npm init -y

# Install dependencies
npm install react react-dom
npm install --save-dev webpack webpack-cli webpack-dev-server
npm install --save-dev @babel/core @babel/preset-react babel-loader
npm install --save-dev css-loader style-loader
```

### Step 2: Configure Webpack

```javascript
// webpack.config.js
const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'widget_min.js',  // Use widget name + _min.js
    library: {
      type: 'umd',
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react'],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  externals: {
    // Don't bundle these - Impartner might provide them
    // Uncomment if you want to reduce bundle size
    // react: 'React',
    // 'react-dom': 'ReactDOM',
  },
};
```

### Step 3: Create Widget Entry Point

```javascript
// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import ViewMode from './components/ViewMode';
import EditMode from './components/EditMode';

// Web Component wrapper for React components
class ImpartnerWidgetElement extends HTMLElement {
  constructor(Component, componentName) {
    super();
    this._component = Component;
    this._componentName = componentName;
  }

  connectedCallback() {
    // Create shadow DOM for style encapsulation
    const shadow = this.attachShadow({ mode: 'open' });
    const mountPoint = document.createElement('div');
    shadow.appendChild(mountPoint);

    // Get widget props from attributes
    const props = this.getPropsFromAttributes();

    // Mount React component
    const root = ReactDOM.createRoot(mountPoint);
    root.render(React.createElement(this._component, props));

    // Store root for cleanup
    this._root = root;
  }

  disconnectedCallback() {
    // Cleanup when element is removed
    if (this._root) {
      this._root.unmount();
    }
  }

  getPropsFromAttributes() {
    // Extract data attributes as props
    const props = {};
    for (let attr of this.attributes) {
      if (attr.name.startsWith('data-')) {
        const propName = attr.name.slice(5).replace(/-([a-z])/g, 
          (_, letter) => letter.toUpperCase()
        );
        props[propName] = attr.value;
      }
    }
    return props;
  }
}

// Register Custom Elements
// IMPORTANT: Replace "mywidget" with your actual widget name
customElements.define(
  'uw-mywidget-view',
  class extends ImpartnerWidgetElement {
    constructor() {
      super(ViewMode, 'ViewMode');
    }
  }
);

customElements.define(
  'uw-mywidget-edit',
  class extends ImpartnerWidgetElement {
    constructor() {
      super(EditMode, 'EditMode');
    }
  }
);

console.log('Impartner Custom Widget Loaded: mywidget v1.0.0');
```

### Step 4: Create View Mode Component

```javascript
// src/components/ViewMode.jsx
import React, { useState, useEffect } from 'react';
import { fetchImpartnerData } from '../services/api';
import '../styles/view.css';

const ViewMode = (props) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Example: Fetch deals data from Impartner API
      const response = await fetchImpartnerData('/api/deals');
      setData(response);
      setError(null);
    } catch (err) {
      setError('Failed to load data: ' + err.message);
      console.error('Widget error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="widget-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="widget-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="widget-container">
      <div className="widget-header">
        <h3>My Custom Widget</h3>
        <button onClick={loadData} className="refresh-btn">
          Refresh
        </button>
      </div>
      
      <div className="widget-content">
        {data.length === 0 ? (
          <div className="empty-state">No data available</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map(item => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ViewMode;
```

### Step 5: Create Edit Mode Component

```javascript
// src/components/EditMode.jsx
import React, { useState, useEffect } from 'react';
import { fetchImpartnerData, updateImpartnerData } from '../services/api';
import '../styles/edit.css';

const EditMode = (props) => {
  const [data, setData] = useState(null);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await fetchImpartnerData('/api/deals/' + props.itemId);
      setData(response);
      setFormData(response);
    } catch (err) {
      console.error('Failed to load data:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      await updateImpartnerData('/api/deals/' + props.itemId, formData);
      setMessage({ type: 'success', text: 'Saved successfully!' });
      
      // Notify parent/Impartner of changes
      window.dispatchEvent(new CustomEvent('impartner-widget-updated', {
        detail: { widgetName: 'mywidget', data: formData }
      }));
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to save: ' + err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(data);
    
    // Notify Impartner to close edit mode
    window.dispatchEvent(new CustomEvent('impartner-widget-cancel'));
  };

  if (!data) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="widget-edit-container">
      <div className="widget-header">
        <h3>Edit Item</h3>
      </div>

      {message && (
        <div className={`message message-${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="edit-form">
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name || ''}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="status">Status:</label>
          <select
            id="status"
            name="status"
            value={formData.status || ''}
            onChange={handleInputChange}
          >
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="button" onClick={handleCancel} disabled={saving}>
            Cancel
          </button>
          <button type="submit" disabled={saving} className="primary">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditMode;
```

### Step 6: Create API Service

```javascript
// src/services/api.js

/**
 * Impartner API Service
 * 
 * IMPORTANT: Authentication is handled by Impartner platform
 * Your widget runs in the context of an authenticated session
 */

const API_BASE = '/prm/api'; // Impartner API base path

export async function fetchImpartnerData(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Authentication cookies are automatically included
        ...options.headers,
      },
      credentials: 'same-origin', // Include cookies
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Impartner API fetch error:', error);
    throw error;
  }
}

export async function updateImpartnerData(endpoint, data, options = {}) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'same-origin',
      body: JSON.stringify(data),
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Impartner API update error:', error);
    throw error;
  }
}

export async function createImpartnerData(endpoint, data, options = {}) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'same-origin',
      body: JSON.stringify(data),
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Impartner API create error:', error);
    throw error;
  }
}

export async function deleteImpartnerData(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'same-origin',
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Impartner API delete error:', error);
    throw error;
  }
}

/**
 * Common Impartner API Endpoints
 * 
 * Object API: /prm/api/objects/v1/{objectName}
 * Examples:
 * - /prm/api/objects/v1/deals
 * - /prm/api/objects/v1/leads
 * - /prm/api/objects/v1/accounts
 * 
 * For more endpoints, access: Settings > Tools > REST API in Impartner
 */
```

### Step 7: Add Styling

```css
/* src/styles/view.css */
.widget-container {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  padding: 20px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.widget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #e5e7eb;
}

.widget-header h3 {
  margin: 0;
  color: #1f2937;
  font-size: 18px;
  font-weight: 600;
}

.refresh-btn {
  padding: 8px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.refresh-btn:hover {
  background: #2563eb;
}

.loading-spinner,
.empty-state {
  text-align: center;
  padding: 40px;
  color: #6b7280;
}

.error-message {
  padding: 12px;
  background: #fee;
  border-left: 4px solid #ef4444;
  color: #991b1b;
  border-radius: 4px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  background: #f3f4f6;
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 2px solid #e5e7eb;
}

.data-table td {
  padding: 12px;
  border-bottom: 1px solid #e5e7eb;
}

.data-table tr:hover {
  background: #f9fafb;
}
```

```css
/* src/styles/edit.css */
.widget-edit-container {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  padding: 20px;
  background: #ffffff;
  border-radius: 8px;
  max-width: 600px;
}

.message {
  padding: 12px;
  margin-bottom: 16px;
  border-radius: 6px;
  border-left: 4px solid;
}

.message-success {
  background: #d1fae5;
  border-color: #10b981;
  color: #065f46;
}

.message-error {
  background: #fee;
  border-color: #ef4444;
  color: #991b1b;
}

.edit-form {
  margin-top: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  color: #374151;
  font-weight: 500;
  font-size: 14px;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}

.form-actions button {
  padding: 10px 24px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.form-actions button:hover {
  background: #f3f4f6;
}

.form-actions button.primary {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.form-actions button.primary:hover {
  background: #2563eb;
}

.form-actions button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

### Step 8: Build Widget

```json
// package.json scripts
{
  "scripts": {
    "build": "webpack --mode production",
    "dev": "webpack --mode development --watch",
    "serve": "webpack serve --mode development --open"
  }
}
```

```bash
# Build for production
npm run build

# Output will be in dist/widget_min.js
```

## Deployment to Impartner

### Step 1: Upload Widget Bundle

1. Log into Impartner PRM Admin
2. Navigate to **Developer Tools > Extensibility > Widgets**
3. Click **Create Widget**
4. Choose **"Upload a .zip file"** or **"Enter information manually"**

### Step 2: Configure Widget (Manual Entry)

```yaml
Creation Method: Enter information manually

Widget Details:
  Name: My Custom Widget
  API Name: custom.mywidget
  Description: Brief description of widget functionality
  Author: Your Company Name
  Icon: (Optional) Select from available icons
  Status: ✓ Is Active

Availability:
  ✓ Any
  □ Dashboard
  □ Content

Version Details:
  Version: 1.0.0
  Style: ☐ Use HEX (BSS)

Widget Modes:
  File Upload: Upload dist/widget_min.js
  
  Component Modes:
    View Mode:
      ✓ Enabled
      Tag ID: uw-mywidget-view
    
    Edit Mode:
      ✓ Enabled
      Tag ID: uw-mywidget-edit
    
    Settings Popover Mode:
      □ Enabled
      Tag ID: uw-mywidget-settings
    
    Edit Modal Mode:
      □ Enabled
      Tag ID: uw-mywidget-modal
```

### Step 3: Test in PX Studio

1. Navigate to **PX Studio > Dashboard** or any page
2. Click **"+ Add a widget"** icon
3. Search for your widget: "My Custom Widget"
4. Click to add widget to page
5. Test view mode display
6. Test edit mode functionality
7. Verify API integration
8. Test on different partner accounts (segmentation)

## Advanced Patterns

### Pattern 1: Custom Hooks for Impartner Data

```javascript
// src/hooks/useImpartnerData.js
import { useState, useEffect } from 'react';
import { fetchImpartnerData } from '../services/api';

export function useImpartnerData(endpoint, dependencies = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        setLoading(true);
        const result = await fetchImpartnerData(endpoint);
        if (!cancelled) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, dependencies);

  const refetch = () => {
    setLoading(true);
    fetchImpartnerData(endpoint)
      .then(result => {
        setData(result);
        setError(null);
      })
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  };

  return { data, loading, error, refetch };
}

// Usage in component:
// const { data, loading, error, refetch } = useImpartnerData('/api/deals');
```

### Pattern 2: Segmentation Support

```javascript
// src/hooks/useSegmentation.js
import { useState, useEffect } from 'react';
import { fetchImpartnerData } from '../services/api';

export function useSegmentation() {
  const [segment, setSegment] = useState(null);

  useEffect(() => {
    // Get current partner's segmentation
    fetchImpartnerData('/api/user/current')
      .then(user => {
        setSegment({
          tier: user.tier,
          region: user.region,
          accountType: user.accountType
        });
      })
      .catch(err => console.error('Failed to load segmentation:', err));
  }, []);

  return segment;
}

// Usage:
// const segment = useSegmentation();
// if (segment?.tier === 'gold') { /* show premium features */ }
```

### Pattern 3: Event Communication

```javascript
// Widget-to-Impartner Events
export const ImpartnerEvents = {
  // Notify that data changed
  dataUpdated: (widgetName, data) => {
    window.dispatchEvent(new CustomEvent('impartner-widget-updated', {
      detail: { widgetName, data }
    }));
  },

  // Request to close/cancel
  cancel: () => {
    window.dispatchEvent(new CustomEvent('impartner-widget-cancel'));
  },

  // Request refresh of other widgets
  refreshRequested: () => {
    window.dispatchEvent(new CustomEvent('impartner-refresh-widgets'));
  },

  // Error notification
  error: (widgetName, error) => {
    window.dispatchEvent(new CustomEvent('impartner-widget-error', {
      detail: { widgetName, error }
    }));
  }
};

// Listen for Impartner events
export function listenForImpartnerEvents(handlers) {
  const listeners = [];

  if (handlers.onRefresh) {
    const refreshListener = () => handlers.onRefresh();
    window.addEventListener('impartner-refresh-request', refreshListener);
    listeners.push(['impartner-refresh-request', refreshListener]);
  }

  if (handlers.onSegmentChange) {
    const segmentListener = (e) => handlers.onSegmentChange(e.detail);
    window.addEventListener('impartner-segment-changed', segmentListener);
    listeners.push(['impartner-segment-changed', segmentListener]);
  }

  // Return cleanup function
  return () => {
    listeners.forEach(([event, listener]) => {
      window.removeEventListener(event, listener);
    });
  };
}
```

### Pattern 4: Loading States Component

```javascript
// src/components/shared/LoadingState.jsx
import React from 'react';

export const LoadingState = ({ message = 'Loading...' }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px',
    color: '#6b7280'
  }}>
    <div className="spinner" style={{
      border: '3px solid #f3f3f3',
      borderTop: '3px solid #3b82f6',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      animation: 'spin 1s linear infinite',
      marginRight: '12px'
    }}></div>
    <span>{message}</span>
  </div>
);

export const ErrorState = ({ error, onRetry }) => (
  <div style={{
    padding: '20px',
    background: '#fee',
    borderLeft: '4px solid #ef4444',
    borderRadius: '4px'
  }}>
    <h4 style={{ margin: '0 0 8px 0', color: '#991b1b' }}>
      Error Loading Data
    </h4>
    <p style={{ margin: '0 0 12px 0', color: '#7f1d1d' }}>
      {error?.message || 'An unknown error occurred'}
    </p>
    {onRetry && (
      <button onClick={onRetry} style={{
        padding: '8px 16px',
        background: '#ef4444',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
      }}>
        Retry
      </button>
    )}
  </div>
);

export const EmptyState = ({ message = 'No data available', icon }) => (
  <div style={{
    textAlign: 'center',
    padding: '60px 20px',
    color: '#9ca3af'
  }}>
    {icon && <div style={{ fontSize: '48px', marginBottom: '16px' }}>{icon}</div>}
    <p style={{ fontSize: '16px', margin: 0 }}>{message}</p>
  </div>
);
```

## Best Practices

### 1. Error Handling
```javascript
// Always wrap API calls in try-catch
try {
  const data = await fetchImpartnerData('/api/endpoint');
  // Handle success
} catch (error) {
  // Log for debugging
  console.error('Widget API Error:', error);
  // Show user-friendly message
  setError('Failed to load data. Please try again.');
}
```

### 2. Performance Optimization
```javascript
// Use React.memo for components that don't need frequent re-renders
const DataRow = React.memo(({ item }) => (
  <tr>
    <td>{item.name}</td>
    <td>{item.value}</td>
  </tr>
));

// Debounce search/filter operations
import { debounce } from './utils';

const handleSearch = debounce((searchTerm) => {
  // Perform search
}, 300);
```

### 3. Security
```javascript
// Never expose sensitive data in client code
// Use Impartner's authentication - don't implement your own
// Validate all user input
// Sanitize HTML content

const sanitizeInput = (input) => {
  return input.replace(/[<>]/g, '');
};
```

### 4. Accessibility
```javascript
// Always include ARIA labels
<button aria-label="Refresh data" onClick={handleRefresh}>
  <RefreshIcon />
</button>

// Ensure keyboard navigation
<div tabIndex={0} onKeyPress={handleKeyPress}>
  {content}
</div>

// Use semantic HTML
<table role="table">
  <thead role="rowgroup">
    <tr role="row">
      <th role="columnheader">Name</th>
    </tr>
  </thead>
</table>
```

## Debugging Tips

### 1. Development Mode
```javascript
// Add debug mode flag
const DEBUG = process.env.NODE_ENV === 'development';

if (DEBUG) {
  console.log('Widget mounted with props:', props);
  console.log('Current state:', state);
}
```

### 2. Browser DevTools
- Use React DevTools extension
- Check Network tab for API calls
- Monitor Console for errors
- Inspect custom element in Elements tab

### 3. Common Issues

**Widget not appearing:**
- Check custom element registration
- Verify tag name matches configuration
- Check browser console for errors

**API calls failing:**
- Verify endpoint exists (check REST API docs)
- Check authentication cookies
- Verify CORS settings
- Check network tab for response

**Styling issues:**
- Use Shadow DOM for encapsulation
- Check CSS specificity
- Verify Bootstrap classes available
- Test in different browsers

## Testing

### Unit Testing with Jest
```javascript
// src/components/__tests__/ViewMode.test.jsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ViewMode from '../ViewMode';
import * as api from '../../services/api';

jest.mock('../../services/api');

describe('ViewMode', () => {
  it('displays loading state initially', () => {
    render(<ViewMode />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('displays data after loading', async () => {
    api.fetchImpartnerData.mockResolvedValue([
      { id: 1, name: 'Test Item' }
    ]);

    render(<ViewMode />);

    await waitFor(() => {
      expect(screen.getByText('Test Item')).toBeInTheDocument();
    });
  });
});
```

## Resources

### Impartner Documentation
- **REST API:** Settings > Tools > REST API (in your PRM instance)
- **PX Studio Guide:** Available in project knowledge
- **Object API:** `/prm/api/objects/v1/`

### External Resources
- React Documentation: https://react.dev
- Web Components: https://developer.mozilla.org/en-US/docs/Web/Web_Components
- Webpack: https://webpack.js.org

## Quick Reference

### Command Cheat Sheet
```bash
# Create new widget project
npm init -y
npm install react react-dom
npm install --save-dev webpack webpack-cli babel-loader @babel/preset-react

# Development
npm run dev          # Watch mode
npm run serve        # Dev server

# Production
npm run build        # Create dist/widget_min.js

# Deploy
# Upload dist/widget_min.js to Impartner Extensibility
```

### Widget Checklist
- [ ] React components created (View & Edit modes)
- [ ] Custom Elements registered with correct tag names
- [ ] API service configured for Impartner endpoints
- [ ] Webpack configured for production build
- [ ] Styling added (CSS encapsulated in Shadow DOM)
- [ ] Error handling implemented
- [ ] Loading states added
- [ ] Built and minified (dist/widget_min.js)
- [ ] Uploaded to Impartner Extensibility
- [ ] Widget configured in admin panel
- [ ] Tested in PX Studio
- [ ] Tested with actual partner data
- [ ] Segmentation tested (if applicable)

---

## Need Help?

When asking Copilot for assistance with Impartner widgets:

1. **Specify the mode:** "Create a view mode component for..."
2. **Mention Impartner:** "Using Impartner REST API endpoint..."
3. **Reference patterns:** "Using the custom hook pattern from the instructions..."
4. **Be specific about data:** "Fetching deals from /prm/api/objects/v1/deals..."

Example prompts:
- "Create a view mode component that displays deals from Impartner API in a table"
- "Add error handling to my Impartner API service following best practices"
- "Create a custom hook for fetching and caching Impartner data"
- "Style my widget to match Bootstrap theme with responsive layout"
