/**
 * Impartner Custom Widget: Vimeo Video Player
 * 
 * Displays Vimeo videos in a gallery view with modal playback
 * Supports multiple videos from Impartner custom objects or JSON configuration
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import ViewMode from './components/ViewMode';
import EditMode from './components/EditMode';

// Web Component wrapper for React components
class ImpartnerVimeoWidgetElement extends HTMLElement {
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
    
    console.log(`🎬 Vimeo Video Player Widget (${this._componentName}) mounted with props:`, props);
  }

  disconnectedCallback() {
    // Cleanup when element is removed
    if (this._root) {
      this._root.unmount();
    }
    console.log(`🎬 Vimeo Video Player Widget (${this._componentName}) unmounted`);
  }

  getPropsFromAttributes() {
    // Extract data attributes as props
    const props = {};
    for (let attr of this.attributes) {
      if (attr.name.startsWith('data-')) {
        const propName = attr.name.slice(5).replace(/-([a-z])/g, 
          (_, letter) => letter.toUpperCase()
        );
        
        // Try to parse JSON values
        try {
          props[propName] = JSON.parse(attr.value);
        } catch {
          props[propName] = attr.value;
        }
      }
    }
    return props;
  }
}

// Register Custom Elements
customElements.define(
  'uw-vimeo-player-view',
  class extends ImpartnerVimeoWidgetElement {
    constructor() {
      super(ViewMode, 'ViewMode');
    }
  }
);

customElements.define(
  'uw-vimeo-player-edit',
  class extends ImpartnerVimeoWidgetElement {
    constructor() {
      super(EditMode, 'EditMode');
    }
  }
);

console.log('🎬 Impartner Custom Widget Loaded: Vimeo Video Player v1.0.0');
