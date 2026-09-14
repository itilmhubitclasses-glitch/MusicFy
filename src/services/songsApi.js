/**
 * High-performance, enterprise-grade Service layer for MusicFy Songs API.
 * Supports dual-mode:
 * 1. Local Vite API (writes directly into src/data/songs.js and public/uploads/)
 * 2. Vercel Production Fallback (graceful client-side storage so it works 100% on Vercel)
 */

import { SONGS } from '../data/songs';

const API_BASE = '/api';
const LOCAL_STORAGE_KEY = 'musicfy-custom-songs';

/**
 * Gets custom songs from localStorage cache
 * @returns {Array}
 */
export const getLocalCustomSongs = () => {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    console.error('Failed to read custom songs from localStorage:', e);
    return [];
  }
};

/**
 * Saves custom songs to localStorage cache
 * @param {Array} songs
 */
export const saveLocalCustomSongs = (songs) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(songs));
  } catch (e) {
    console.error('Failed to save custom songs to localStorage:', e);
  }
};

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
 * Uploads an audio or image file to the server or falls back to DataURL
 * @param {File} file
 * @param {'audio' | 'covers'} type
 * @returns {Promise<string>} The public URL path or DataURL
 */
export const uploadMediaFile = async (file, type = 'audio') => {
  const dataUrl = await fileToDataUrl(file);
  try {
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

    if (response.ok) {
      const result = await response.json();
      if (result.success && result.url) {
        return result.url;
      }
    }
  } catch (_) {
    // Backend API unavailable (e.g. Vercel static hosting)
  }

  // Fallback to dataUrl on Vercel so user audio/image works seamlessly
  return dataUrl;
};

/**
 * Adds a new song directly into src/data/songs.js via API or falls back to storage on Vercel
 * @param {Object} songData
 * @returns {Promise<Object>} Created song with persistent sequential ID
 */
export const createSong = async (songData) => {
  const now = new Date();
  const formattedTime = now.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  try {
    const response = await fetch(`${API_BASE}/songs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(songData),
    });

    if (response.ok) {
      const result = await response.json();
      if (result.success && result.data) {
        return result.data;
      }
    }
  } catch (_) {
    // Backend API unavailable (e.g. on Vercel static production)
  }

  // Fallback mode for Vercel:
  const localCustom = getLocalCustomSongs();
  const allCurrent = [...localCustom, ...SONGS];
  const maxId = allCurrent.reduce((max, s) => {
    const num = typeof s.id === 'number' ? s.id : parseInt(s.id, 10);
    return !isNaN(num) && num > max ? num : max;
  }, 0);
  const nextId = maxId + 1;

  const fallbackSong = {
    id: nextId,
    title: songData.title.trim(),
    artist: songData.artist.trim(),
    album: songData.album ? songData.album.trim() : `${songData.title.trim()} - Single`,
    cover:
      songData.cover ||
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    audioUrl: songData.audioUrl.trim(),
    duration: Number(songData.duration) || 60,
    durationFormatted: songData.durationFormatted || '1:00',
    genre: songData.genre || 'Pop',
    year: Number(songData.year) || now.getFullYear(),
    addedAt: formattedTime,
    createdAt: now.toISOString(),
  };

  saveLocalCustomSongs([fallbackSong, ...localCustom]);
  return fallbackSong;
};

/**
 * Deletes a song by ID
 * @param {number | string} songId
 * @returns {Promise<number | string>}
 */
export const deleteSongById = async (songId) => {
  try {
    await fetch(`${API_BASE}/songs/${songId}`, {
      method: 'DELETE',
    });
  } catch (_) {}

  // Update local storage backup
  const localCustom = getLocalCustomSongs();
  const updated = localCustom.filter((s) => s.id !== songId && String(s.id) !== String(songId));
  saveLocalCustomSongs(updated);

  return songId;
};

