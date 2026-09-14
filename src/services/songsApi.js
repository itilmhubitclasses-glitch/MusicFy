/**
 * High-performance, enterprise-grade Service layer for MusicFy Songs API.
 * Communicates directly with the backend to persist tracks in src/data/songs.js
 */

const API_BASE = '/api';

/**
 * Converts a File or Blob to a Base64 data URL
 * @param {File | Blob} file
 * @returns {Promise<string>}
 */
export const fileToDataUrl = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

/**
 * Uploads an audio or image file to the server and saves it into public/uploads/
 * @param {File} file
 * @param {'audio' | 'covers'} type
 * @returns {Promise<string>} The public URL path (e.g. /uploads/audio/...)
 */
export const uploadMediaFile = async (file, type = 'audio') => {
  try {
    const dataUrl = await fileToDataUrl(file);
    const response = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dataUrl,
        fileName: file.name,
        type,
      }),
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.error || "Faylni yuklashda xatolik yuz berdi");
    }

    return result.url;
  } catch (error) {
    console.error('File upload failed:', error);
    throw error;
  }
};

/**
 * Fetches all songs from the backend
 * @returns {Promise<Array>}
 */
export const fetchAllSongs = async () => {
  try {
    const response = await fetch(`${API_BASE}/songs`);
    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.error || "Musiqalarni yuklab bo'lmadi");
    }
    return result.data;
  } catch (error) {
    console.error('Fetch songs failed:', error);
    throw error;
  }
};

/**
 * Adds a new song directly into src/data/songs.js via backend API
 * @param {Object} songData
 * @returns {Promise<Object>} Created song with persistent sequential ID
 */
export const createSong = async (songData) => {
  try {
    const response = await fetch(`${API_BASE}/songs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(songData),
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.error || "Musiqani songs.js ga yozishda xatolik yuz berdi");
    }

    return result.data;
  } catch (error) {
    console.error('Create song API failed:', error);
    throw error;
  }
};

/**
 * Deletes a song from src/data/songs.js by ID
 * @param {number | string} songId
 * @returns {Promise<number | string>}
 */
export const deleteSongById = async (songId) => {
  try {
    const response = await fetch(`${API_BASE}/songs/${songId}`, {
      method: 'DELETE',
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.error || "Musiqani o'chirishda xatolik yuz berdi");
    }

    return result.deletedId;
  } catch (error) {
    console.error('Delete song API failed:', error);
    throw error;
  }
};

/**
 * Updates a song in src/data/songs.js
 * @param {number | string} songId
 * @param {Object} updatedData
 * @returns {Promise<Object>}
 */
export const updateSongById = async (songId, updatedData) => {
  try {
    const response = await fetch(`${API_BASE}/songs/${songId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.error || "Musiqani yangilashda xatolik yuz berdi");
    }

    return result.data;
  } catch (error) {
    console.error('Update song API failed:', error);
    throw error;
  }
};
