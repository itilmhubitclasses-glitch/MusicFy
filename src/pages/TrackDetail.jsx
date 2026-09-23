import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Play,
  Pause,
  Heart,
  Share2,
  Check,
  Disc,
  Music2,
  Calendar,
  Clock,
  Radio,
  Sparkles,
  Layers,
  Volume2,
  Trash2,
} from 'lucide-react';
import { useMusic } from '../context/useMusic';
import './TrackDetail.css';

const TrackDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const {
    songs,
    currentTrack,
    isPlaying,
    playTrack,
    togglePlay,
    isLiked,
    toggleLike,
    deleteSong,
    showToast,
    currentTime,
    duration,
    seek,
  } = useMusic();

  // Find the song by ID
  const song = useMemo(() => {
    return songs.find((s) => String(s.id) === String(id));
  }, [songs, id]);

  // Related songs in the same genre
  const relatedSongs = useMemo(() => {
    if (!song) return [];
    return songs
      .filter((s) => s.id !== song.id && s.genre.toLowerCase() === song.genre.toLowerCase())
      .slice(0, 6);
  }, [songs, song]);

  const isCurrent = currentTrack?.id === song?.id;
  const isPlayingThis = isCurrent && isPlaying;
  const liked = song ? isLiked(song.id) : false;

  const handlePlayToggle = () => {
    if (!song) return;
    if (isCurrent) {
      togglePlay();
    } else {
      playTrack(song);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        showToast('Havola nusxalandi!', 'success');
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      showToast('Havolani nusxalab bo‘lmadi', 'error');
    }
  };

  const handleDelete = async () => {
    if (!song) return;
    if (window.confirm(`"${song.title}" qo'shig'ini o'chirishni tasdiqlaysizmi?`)) {
      await deleteSong(song.id);
      navigate('/');
    }
  };

  // If song is not found
  if (!song) {
    return (
      <div className="track-not-found">
        <div className="not-found-card">
          <Disc size={48} className="empty-icon" />
          <h2>Musiqa topilmadi</h2>
          <p>Siz qidirayotgan musiqa mavjud emas yoki o‘chirilgan bo‘lishi mumkin.</p>
          <Link to="/" className="back-home-btn">
            <ArrowLeft size={16} />
            <span>Bosh sahifaga qaytish</span>
          </Link>
        </div>
      </div>
    );
  }

  const progressPercent = isCurrent && duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="track-detail-page">
      {/* Back button */}
      <div className="track-nav-bar">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="back-btn"
          aria-label="Orqaga qaytish"
        >
          <ArrowLeft size={18} />
          <span>Orqaga</span>
        </button>

        <span className="track-breadcrumb">
          <Link to="/" className="breadcrumb-link">Musiqalar</Link>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">{song.title}</span>
        </span>
      </div>

      {/* Main Track Hero Card */}
      <section className="track-hero-card">
        <div className="track-hero-glow" style={{ backgroundImage: `url(${song.cover})` }} />

        <div className="track-hero-inner">
          <div className="track-cover-container">
            <img
              src={song.cover}
              alt={song.title}
              className="track-main-cover"
              loading="eager"
            />
            {isPlayingThis && (
              <div className="playing-pulse-badge">
                <span className="pulse-dot"></span>
                <span>Ijro etilmoqda</span>
              </div>
            )}
          </div>

          <div className="track-main-info">
            <div className="track-badges-row">
              <span className="track-genre-pill">
                <Radio size={12} />
                {song.genre}
              </span>
              <span className="track-year-pill">
                <Calendar size={12} />
                {song.year || 'Nomaʼlum yil'}
              </span>
              <span className="track-duration-pill">
                <Clock size={12} />
                {song.durationFormatted || '1:00'}
              </span>
            </div>

            <h1 className="track-title" title={song.title}>
              {song.title}
            </h1>

            <div className="track-artist-row">
              <span className="track-artist-label">Ijrochi:</span>
              <span className="track-artist-name">{song.artist}</span>
            </div>

            <div className="track-album-row">
              <Layers size={15} className="album-icon" />
              <span className="track-album-name">{song.album || 'Single'}</span>
            </div>

            {/* Actions Bar */}
            <div className="track-actions-bar">
              <button
                type="button"
                className={`track-play-main-btn ${isPlayingThis ? 'playing' : ''}`}
                onClick={handlePlayToggle}
                aria-label={isPlayingThis ? "To'xtatish" : "Ijro etish"}
              >
                {isPlayingThis ? (
                  <>
                    <Pause size={18} fill="currentColor" />
                    <span>To‘xtatish</span>
                  </>
                ) : (
                  <>
                    <Play size={18} fill="currentColor" />
                    <span>Tinglash</span>
                  </>
                )}
              </button>

              <button
                type="button"
                className={`track-action-btn like-btn ${liked ? 'liked' : ''}`}
                onClick={() => toggleLike(song.id)}
                aria-label={liked ? "Sevimlilardan o'chirish" : "Sevimlilarga qo'shish"}
                title={liked ? "Sevimlilardan o'chirish" : "Sevimlilarga qo'shish"}
              >
                <Heart
                  size={18}
                  fill={liked ? '#c47171' : 'none'}
                  color={liked ? '#c47171' : 'currentColor'}
                />
                <span>{liked ? 'Yoqtirilgan' : 'Saqlash'}</span>
              </button>

              <button
                type="button"
                className="track-action-btn"
                onClick={handleShare}
                title="Havolani ulashish"
                aria-label="Ulashish"
              >
                {copied ? <Check size={18} color="#4ade80" /> : <Share2 size={18} />}
                <span>{copied ? 'Nusxalandi' : 'Ulashish'}</span>
              </button>

              {song.isCustom && (
                <button
                  type="button"
                  className="track-action-btn delete-btn"
                  onClick={handleDelete}
                  title="O'chirish"
                  aria-label="O'chirish"
                >
                  <Trash2 size={18} />
                  <span>O‘chirish</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Live Audio Playback Seek Bar on Detail Page */}
        {isCurrent && (
          <div className="track-live-bar">
            <div className="live-bar-header">
              <div className="live-status">
                <Volume2 size={16} className={isPlaying ? 'wave-active' : ''} />
                <span>Jonli pleyer</span>
              </div>
              <span className="live-time">
                {Math.floor(currentTime / 60)}:
                {String(Math.floor(currentTime % 60)).padStart(2, '0')} /{' '}
                {Math.floor(duration / 60)}:
                {String(Math.floor(duration % 60)).padStart(2, '0')}
              </span>
            </div>

            <div
              className="live-progress-track"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickPos = (e.clientX - rect.left) / rect.width;
                seek(clickPos * duration);
              }}
            >
              <div
                className="live-progress-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </section>

      {/* Information Cards Grid */}
      <section className="track-info-section">
        <h3 className="section-subtitle">
          <Music2 size={18} />
          <span>Trek haqida to‘liq maʼlumotlar</span>
        </h3>

        <div className="info-cards-grid">
          <div className="info-card">
            <span className="info-label">Trek nomi</span>
            <span className="info-value">{song.title}</span>
          </div>

          <div className="info-card">
            <span className="info-label">Ijrochi (Artist)</span>
            <span className="info-value">{song.artist}</span>
          </div>

          <div className="info-card">
            <span className="info-label">Albom</span>
            <span className="info-value">{song.album || 'Single'}</span>
          </div>

          <div className="info-card">
            <span className="info-label">Janr</span>
            <span className="info-value tag-style">{song.genre}</span>
          </div>

          <div className="info-card">
            <span className="info-label">Chiqarilgan yili</span>
            <span className="info-value">{song.year || '2024'}</span>
          </div>

          <div className="info-card">
            <span className="info-label">Davomiyligi</span>
            <span className="info-value">{song.durationFormatted || `${song.duration || 60} soniya`}</span>
          </div>

          <div className="info-card">
            <span className="info-label">Format / Sifat</span>
            <span className="info-value">HQ Audio Stream (M4A / MP3)</span>
          </div>

          <div className="info-card">
            <span className="info-label">Sevimli holati</span>
            <span className="info-value">
              {liked ? '❤️ Sevimlilar ro‘yxatida' : '🤍 Sevimlilarda emas'}
            </span>
          </div>
        </div>
      </section>

      {/* Related Songs from the same Genre */}
      {relatedSongs.length > 0 && (
        <section className="related-songs-section">
          <div className="related-header">
            <h3 className="section-subtitle">
              <Sparkles size={18} />
              <span>O‘xshash treklar ({song.genre})</span>
            </h3>
            <span className="related-count">{relatedSongs.length} ta tavsiya</span>
          </div>

          <div className="related-grid">
            {relatedSongs.map((item) => {
              const isItemCurrent = currentTrack?.id === item.id;
              const isItemPlaying = isItemCurrent && isPlaying;
              const isItemLiked = isLiked(item.id);

              return (
                <div
                  key={item.id}
                  className={`related-card ${isItemCurrent ? 'active' : ''}`}
                  onClick={() => navigate(`/track/${item.id}`)}
                >
                  <div className="related-cover-wrap">
                    <img
                      src={item.cover}
                      alt={item.title}
                      className="related-cover"
                      loading="lazy"
                    />
                    <button
                      type="button"
                      className={`related-play-btn ${isItemPlaying ? 'playing' : ''}`}
                      aria-label={isItemPlaying ? "To'xtatish" : "Ijro etish"}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isItemCurrent) {
                          togglePlay();
                        } else {
                          playTrack(item);
                        }
                      }}
                    >
                      {isItemPlaying ? (
                        <Pause size={15} fill="currentColor" />
                      ) : (
                        <Play size={15} fill="currentColor" />
                      )}
                    </button>
                  </div>

                  <div className="related-info">
                    <h4 className="related-title" title={item.title}>
                      {item.title}
                    </h4>
                    <p className="related-artist" title={item.artist}>
                      {item.artist}
                    </p>
                    <div className="related-footer">
                      <span className="related-genre">{item.genre}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLike(item.id);
                        }}
                        className={`related-like-btn ${isItemLiked ? 'liked' : ''}`}
                        aria-label="Like"
                      >
                        <Heart
                          size={14}
                          fill={isItemLiked ? '#c47171' : 'none'}
                          color={isItemLiked ? '#c47171' : 'currentColor'}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};

export default TrackDetail;
