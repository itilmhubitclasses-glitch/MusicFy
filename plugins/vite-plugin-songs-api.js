import fs from 'node:fs';
import path from 'node:path';

/**
 * Enterprise-grade Vite plugin to manage songs in src/data/songs.js
 * and handle media uploads directly into public/uploads/.
 */
export function songsApiPlugin() {
  let rootDir = process.cwd();

  const getSongsPath = () => path.resolve(rootDir, 'src/data/songs.js');
  const getUploadsDir = (subDir = '') => path.resolve(rootDir, 'public/uploads', subDir);

  const readSongs = () => {
    const filePath = getSongsPath();
    if (!fs.existsSync(filePath)) {
      throw new Error(`songs.js file not found at ${filePath}`);
    }
    const raw = fs.readFileSync(filePath, 'utf-8');
    const startIdx = raw.indexOf('[');
    const endIdx = raw.lastIndexOf(']');
    if (startIdx === -1 || endIdx === -1) {
      throw new Error('Invalid songs.js structure: array brackets not found');
    }
    const jsonStr = raw.substring(startIdx, endIdx + 1);
    return JSON.parse(jsonStr);
  };

  const writeSongs = (songs) => {
    const filePath = getSongsPath();
    const formattedJson = JSON.stringify(songs, null, 2);
    const fileContent = `export const SONGS = ${formattedJson};\n\nexport default SONGS;\n`;
    
    // Atomic write using temporary file to prevent corruption
    const tempPath = `${filePath}.tmp`;
    fs.writeFileSync(tempPath, fileContent, 'utf-8');
    fs.renameSync(tempPath, filePath);
  };

  const parseJsonBody = (req) => {
    return new Promise((resolve, reject) => {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
        // 50MB max payload limit (supports audio/images)
        if (body.length > 50 * 1024 * 1024) {
          reject(new Error('Payload too large'));
        }
      });
      req.on('end', () => {
        try {
          resolve(body ? JSON.parse(body) : {});
        } catch (err) {
          reject(err);
        }
      });
      req.on('error', reject);
    });
  };

  const sendJson = (res, statusCode, data) => {
    res.statusCode = statusCode;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(data));
  };

  return {
    name: 'vite-plugin-songs-api',
    configResolved(config) {
      rootDir = config.root || process.cwd();
      
      // Ensure upload directories exist
      fs.mkdirSync(getUploadsDir('audio'), { recursive: true });
      fs.mkdirSync(getUploadsDir('covers'), { recursive: true });
    },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ? req.url.split('?')[0] : '';
        const method = req.method;

        // Route: /api/songs
        if (url === '/api/songs') {
          // GET all songs
          if (method === 'GET') {
            try {
              const songs = readSongs();
              return sendJson(res, 200, { success: true, count: songs.length, data: songs });
            } catch (err) {
              return sendJson(res, 500, { success: false, error: err.message });
            }
          }

          // POST create song
          if (method === 'POST') {
            try {
              const body = await parseJsonBody(req);
              if (!body.title || !body.artist || !body.audioUrl) {
                return sendJson(res, 400, {
                  success: false,
                  error: "Majburiy maydonlar to'ldirilmadi (title, artist, audioUrl)",
                });
              }

              const songs = readSongs();
              
              // Calculate next sequential integer ID
              const maxId = songs.reduce((max, s) => {
                const num = typeof s.id === 'number' ? s.id : parseInt(s.id, 10);
                return !isNaN(num) && num > max ? num : max;
              }, 0);
              const nextId = maxId + 1;

              const now = new Date();
              const formattedTime = now.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              });

              const newSong = {
                id: nextId,
                title: body.title.trim(),
                artist: body.artist.trim(),
                album: body.album ? body.album.trim() : `${body.title.trim()} - Single`,
                cover: body.cover || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
                audioUrl: body.audioUrl.trim(),
                duration: Number(body.duration) || 60,
                durationFormatted: body.durationFormatted || '1:00',
                genre: body.genre || 'Pop',
                year: Number(body.year) || now.getFullYear(),
                addedAt: formattedTime,
                createdAt: now.toISOString(),
              };

              // Insert at beginning or end? Insert at top for new arrivals
              const updatedSongs = [newSong, ...songs];
              writeSongs(updatedSongs);

              return sendJson(res, 201, {
                success: true,
                message: "Musiqa songs.js fayliga muvaffaqiyatli saqlandi",
                data: newSong,
              });
            } catch (err) {
              return sendJson(res, 500, { success: false, error: err.message });
            }
          }
        }

        // Route: /api/songs/:id
        const songIdMatch = url.match(/^\/api\/songs\/([^/]+)$/);
        if (songIdMatch) {
          const songId = songIdMatch[1];
          const numericId = !isNaN(Number(songId)) ? Number(songId) : songId;

          // DELETE song
          if (method === 'DELETE') {
            try {
              const songs = readSongs();
              const initialCount = songs.length;
              const updatedSongs = songs.filter((s) => s.id !== numericId && String(s.id) !== String(songId));

              if (updatedSongs.length === initialCount) {
                return sendJson(res, 404, { success: false, error: 'Musiqa topilmadi' });
              }

              writeSongs(updatedSongs);
              return sendJson(res, 200, {
                success: true,
                message: "Musiqa songs.js faylidan muvaffaqiyatli o'chirildi",
                deletedId: numericId,
              });
            } catch (err) {
              return sendJson(res, 500, { success: false, error: err.message });
            }
          }

          // PUT update song
          if (method === 'PUT' || method === 'PATCH') {
            try {
              const body = await parseJsonBody(req);
              const songs = readSongs();
              const index = songs.findIndex((s) => s.id === numericId || String(s.id) === String(songId));

              if (index === -1) {
                return sendJson(res, 404, { success: false, error: 'Musiqa topilmadi' });
              }

              songs[index] = {
                ...songs[index],
                ...body,
                id: songs[index].id, // Prevent ID overwrite
              };

              writeSongs(songs);
              return sendJson(res, 200, {
                success: true,
                message: "Musiqa muvaffaqiyatli yangilandi",
                data: songs[index],
              });
            } catch (err) {
              return sendJson(res, 500, { success: false, error: err.message });
            }
          }
        }

        // Route: /api/upload (Base64 file upload for audio and cover)
        if (url === '/api/upload' && method === 'POST') {
          try {
            const body = await parseJsonBody(req);
            const { dataUrl, fileName, type } = body; // type: 'audio' | 'covers'

            if (!dataUrl || !fileName) {
              return sendJson(res, 400, { success: false, error: "dataUrl va fileName zarur" });
            }

            const subDir = type === 'audio' ? 'audio' : 'covers';
            const uploadDir = getUploadsDir(subDir);
            fs.mkdirSync(uploadDir, { recursive: true });

            // Parse base64 header
            const matches = dataUrl.match(/^data:([A-Za-z0-9+/]+);base64,(.+)$/);
            const buffer = matches ? Buffer.from(matches[2], 'base64') : Buffer.from(dataUrl, 'base64');

            // Sanitize filename
            const cleanName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
            const uniqueName = `${Date.now()}_${cleanName}`;
            const targetFilePath = path.join(uploadDir, uniqueName);

            fs.writeFileSync(targetFilePath, buffer);

            const publicUrl = `/uploads/${subDir}/${uniqueName}`;
            return sendJson(res, 200, {
              success: true,
              url: publicUrl,
              fileName: uniqueName,
            });
          } catch (err) {
            return sendJson(res, 500, { success: false, error: err.message });
          }
        }

        next();
      });
    },
  };
}
