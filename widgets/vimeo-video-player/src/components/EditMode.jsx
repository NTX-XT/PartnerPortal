/**
 * EditMode Component - Vimeo Video Player Widget
 * Allows adding, editing, and removing videos
 */

import React, { useState, useEffect } from 'react';
import { parseVimeoUrl } from '../services/vimeoApi';
import { fetchImpartnerData, updateImpartnerData, createImpartnerData } from '../services/impartnerApi';
import '../styles/edit.css';

const EditMode = (props) => {
  const [formData, setFormData] = useState({
    url: '',
    title: '',
    description: '',
    thumbnail: '',
    category: '',
    tags: ''
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    // Load existing video data if editing
    if (props.videoId) {
      loadVideoData();
    }
  }, [props.videoId]);

  useEffect(() => {
    // Validate URL whenever it changes
    if (formData.url) {
      const { videoId } = parseVimeoUrl(formData.url);
      setIsValid(!!videoId);
    } else {
      setIsValid(false);
    }
  }, [formData.url]);

  const loadVideoData = async () => {
    try {
      const endpoint = props.apiEndpoint || '/api/objects/v1/videos';
      const response = await fetchImpartnerData(`${endpoint}/${props.videoId}`);
      
      setFormData({
        url: response.url || response.vimeoUrl || '',
        title: response.title || '',
        description: response.description || '',
        thumbnail: response.thumbnail || '',
        category: response.category || '',
        tags: Array.isArray(response.tags) ? response.tags.join(', ') : response.tags || ''
      });
    } catch (err) {
      console.error('Failed to load video data:', err);
      setMessage({ type: 'error', text: 'Failed to load video data' });
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
    
    if (!isValid) {
      setMessage({ type: 'error', text: 'Please enter a valid Vimeo URL' });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const { videoId, hash } = parseVimeoUrl(formData.url);
      
      const videoData = {
        url: formData.url,
        vimeoId: videoId,
        vimeoHash: hash,
        title: formData.title,
        description: formData.description,
        thumbnail: formData.thumbnail,
        category: formData.category,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      };

      const endpoint = props.apiEndpoint || '/api/objects/v1/videos';

      if (props.videoId) {
        // Update existing video
        await updateImpartnerData(`${endpoint}/${props.videoId}`, videoData);
        setMessage({ type: 'success', text: 'Video updated successfully!' });
      } else {
        // Create new video
        await createImpartnerData(endpoint, videoData);
        setMessage({ type: 'success', text: 'Video added successfully!' });
        
        // Reset form
        setFormData({
          url: '',
          title: '',
          description: '',
          thumbnail: '',
          category: '',
          tags: ''
        });
      }

      // Notify parent/Impartner of changes
      window.dispatchEvent(new CustomEvent('impartner-widget-updated', {
        detail: { widgetName: 'vimeo-player', data: videoData }
      }));

    } catch (err) {
      console.error('Failed to save video:', err);
      setMessage({ type: 'error', text: 'Failed to save: ' + err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Notify Impartner to close edit mode
    window.dispatchEvent(new CustomEvent('impartner-widget-cancel'));
  };

  return (
    <div className="vimeo-edit-container">
      <div className="edit-header">
        <h3>{props.videoId ? 'Edit Video' : 'Add New Video'}</h3>
      </div>

      {message && (
        <div className={`message message-${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="edit-form">
        <div className="form-group">
          <label htmlFor="url">
            Vimeo URL <span className="required">*</span>
          </label>
          <input
            type="text"
            id="url"
            name="url"
            value={formData.url}
            onChange={handleInputChange}
            placeholder="https://vimeo.com/123456789"
            required
          />
          {formData.url && (
            <span className={`url-validation ${isValid ? 'valid' : 'invalid'}`}>
              {isValid ? '✓ Valid Vimeo URL' : '✗ Invalid Vimeo URL'}
            </span>
          )}
          <small className="form-hint">
            Enter a Vimeo video URL (supports standard and private videos with hash)
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="title">
            Title <span className="required">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Video title"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Brief description of the video"
            rows="3"
          />
        </div>

        <div className="form-group">
          <label htmlFor="thumbnail">Custom Thumbnail URL</label>
          <input
            type="url"
            id="thumbnail"
            name="thumbnail"
            value={formData.thumbnail}
            onChange={handleInputChange}
            placeholder="https://example.com/thumbnail.jpg"
          />
          <small className="form-hint">
            Optional: Leave blank to use Vimeo's default thumbnail
          </small>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              placeholder="Training, Product Demo, etc."
            />
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              placeholder="marketing, sales, training"
            />
            <small className="form-hint">Comma-separated tags</small>
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            onClick={handleCancel} 
            className="btn-secondary"
            disabled={saving}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn-primary"
            disabled={saving || !isValid}
          >
            {saving ? 'Saving...' : (props.videoId ? 'Update Video' : 'Add Video')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditMode;
