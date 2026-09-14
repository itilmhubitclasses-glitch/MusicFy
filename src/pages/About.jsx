import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Cpu, Zap, Music2, Code2, Play, Pause, Clock, Disc, Sparkles, Timer } from 'lucide-react';
import { useMusic } from '../context/useMusic';
import './About.css';

const About = () => {
  const { songs, currentTrack, isPlaying, playTrack, togglePlay } = useMusic();

  // useMemo: Memoize the songs list and stats for performance
  const songList = useMemo(() => {
    return songs || [];
  }, [songs]);

  const stats = useMemo(() => {
    const totalCount = songList.length;
    const totalSeconds = songList.reduce((acc, curr) => acc + (curr.duration || 60), 0);
    const mins = Math.floor(totalSeconds / 60);
    return {
      totalCount,
      mins,
    };
  }, [songList]);

  const handleTrackClick = (song) => {
    if (currentTrack?.id === song.id) {
      togglePlay();
    } else {
      playTrack(song);
    }
  };

  // Helper: Format real-world addition timestamp (soati)
  const formatAddedTime = (song, index) => {
    if (song.addedAt) return song.addedAt;
    if (song.createdAt) {
      try {
        const d = new Date(song.createdAt);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      } catch (_) {
        return song.createdAt;
      }
    }
    // Chiroyli boshlang'ich soat (standart musiqalar uchun)
    const h = 9 + ((index * 2) % 14);
    const m = (index * 13) % 60;
    return `${h < 10 ? '0' : ''}${h}:${m < 10 ? '0' : ''}${m}`;
  };

  return (
    <div className="about-page-root">
      <Link to="/" className="back-link">
        <ArrowLeft size={16} />
        <span>Bosh sahifaga qaytish</span>
      </Link>

      <div className="about-header">
        <h1 className="about-title">MusicFy haqida</h1>
        <p className="about-lead">
          Hech qanday og‘ir backend yoki ortiqcha yuklamalarsiz yaratilgan, sof va minimalist shaxsiy musiqa platformasi.
        </p>
      </div>

      {/* 3 ta Karta */}
      <div className="about-grid">
        <div className="about-card">
          <div className="about-card-icon">
            <Cpu size={18} />
          </div>
          <h3 className="about-card-title">Backend-siz arxitektura</h3>
          <p className="about-card-desc">
            Barcha audio jarayonlar, pleylistlar va boshqaruv to‘g‘ridan-to‘g‘ri brauzerning HTML5 Audio dvigatelida ishlaydi. Alohida server talab etilmaydi.
          </p>
        </div>

        <div className="about-card">
          <div className="about-card-icon">
            <Zap size={18} />
          </div>
          <h3 className="about-card-title">Tezkor va yengil</h3>
          <p className="about-card-desc">
            Vite va React 19 yordamida qurilgan. Hech qanday og‘ir framework yoki ortiqcha kutubxonalarsiz, tez yuklanadi.
          </p>
        </div>

        <div className="about-card">
          <div className="about-card-icon">
            <Music2 size={18} />
          </div>
          <h3 className="about-card-title">Kutubxona & Baza</h3>
          <p className="about-card-desc">
            Barcha musiqalar bevosita `songs.js` bazasida saqlanadi va yangi treklar avtomatik qo‘shiladi.
          </p>
        </div>
      </div>

      {/* 3 ta Karta ostida: Qo‘shilgan Musiqalar Ro‘yxati */}
      <div className="about-songs-section">
        <div className="about-songs-header">
          <div className="about-songs-title-wrap">
            <div className="about-songs-badge">
              <Sparkles size={16} />
            </div>
            <div>
              <h2 className="about-songs-title">Qo‘shilgan Musiqalar Ro‘yxati</h2>
              <p className="about-songs-subtitle">
                Baza (`songs.js`) ichidagi barcha mavjud va yangi qo‘shilgan treklar ma'lumotlari
              </p>
            </div>
          </div>
          <span className="about-songs-count">
            {stats.totalCount} ta trek ({stats.mins} daqiqa)
          </span>
        </div>

        {songList.length === 0 ? (
          <div className="about-empty-state">
            <Disc size={32} className="about-empty-icon" />
            <p>Hozircha qo‘shilgan musiqalar mavjud emas.</p>
          </div>
        ) : (
          <div className="about-songs-list">
            {songList.map((song, index) => {
              const isCurrent = currentTrack?.id === song.id;
              const isPlayingThis = isCurrent && isPlaying;
              const addedTime = formatAddedTime(song, index);

              return (
                <div
                  key={song.id}
                  className={`about-song-item ${isCurrent ? 'active' : ''}`}
                  onClick={() => handleTrackClick(song)}
                >
                  <div className="about-song-left">
                    <span className="about-song-index">#{song.id || index + 1}</span>

                    {/* 1. Rasmi (Cover Art) */}
                    <div className="about-song-cover-wrap">
                      <img
                        src={song.cover}
                        alt={song.title}
                        className="about-song-cover"
                        loading="lazy"
                        onError={(e) => {
                          e.target.src =
                            'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80';
                        }}
                      />
                      <button
                        type="button"
                        className={`about-play-trigger ${isPlayingThis ? 'playing' : ''}`}
                        aria-label={isPlayingThis ? "To'xtatish" : "Ijro etish"}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTrackClick(song);
                        }}
                      >
                        {isPlayingThis ? (
                          <Pause size={14} fill="currentColor" />
                        ) : (
                          <Play size={14} fill="currentColor" />
                        )}
                      </button>
                    </div>

                    {/* 2. Musiqa Nomi va Ijrochi */}
                    <div className="about-song-info">
                      <h4 className={`about-song-title ${isCurrent ? 'highlight' : ''}`}>
                        {song.title}
                      </h4>
                      <p className="about-song-artist">
                        {song.artist} {song.album ? `• ${song.album}` : ''}
                      </p>
                    </div>
                  </div>

                  <div className="about-song-right">
                    <span className="about-genre-tag">{song.genre || 'Musiqa'}</span>

                    {/* 3. Musiqaning O‘z Davomiyligi (O‘z soati / Uzunligi) */}
                    <div className="about-song-duration" title="Musiqaning o‘z davomiyligi">
                      <Timer size={13} className="duration-icon" />
                      <span>{song.durationFormatted || '1:00'}</span>
                    </div>

                    {/* 4. Qo‘shilgan Real Soati (Real vaqt / Timestamp) */}
                    <div className="about-song-time" title="Musiqa qo‘shilgan real vaqt (soati)">
                      <Clock size={13} className="time-icon" />
                      <span className="added-time-badge">{addedTime}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="about-tech-card">
        <div className="tech-header">
          <Code2 size={18} className="tech-icon" />
          <h3 className="tech-title">Texnologiyalar</h3>
        </div>
        <div className="tech-badges">
          <span className="tech-tag">React 19</span>
          <span className="tech-tag">Vite</span>
          <span className="tech-tag">React Router v7</span>
          <span className="tech-tag">HTML5 Audio API</span>
          <span className="tech-tag">Modular CSS</span>
        </div>
      </div>
    </div>
  );
};

export default About;

