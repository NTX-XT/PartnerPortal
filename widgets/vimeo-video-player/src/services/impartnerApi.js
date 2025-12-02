/**
 * Impartner API Service for Vimeo Widget
 * Handles fetching video data from Impartner custom objects
 */

const API_BASE = '/prm/api';

/**
 * Fetches video data from Impartner
 * @param {string} endpoint - API endpoint
 * @param {object} options - Fetch options
 * @returns {Promise<any>} - API response
 */
export async function fetchImpartnerData(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'GET',
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
    console.error('Impartner API fetch error:', error);
    throw error;
  }
}

/**
 * Updates video data in Impartner
 * @param {string} endpoint - API endpoint
 * @param {object} data - Data to update
 * @param {object} options - Fetch options
 * @returns {Promise<any>} - API response
 */
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

/**
 * Creates a new video entry in Impartner
 * @param {string} endpoint - API endpoint
 * @param {object} data - Video data
 * @param {object} options - Fetch options
 * @returns {Promise<any>} - API response
 */
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
