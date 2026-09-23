import { Link } from 'react-router-dom';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Volume2,
  Volume1,
  VolumeX,
  Heart,
} from 'lucide-react';
import { useMusic } from '../../context/useMusic';
import './Player.css';

const formatTime = (seconds) => {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const Player = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    isRepeat,
    togglePlay,
    playNext,
    playPrev,
    seek,
    handleVolumeChange,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    isLiked,
    toggleLike,
  } = useMusic();

  if (!currentTrack) return null;

  const liked = isLiked(currentTrack.id);
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeekChange = (e) => {
    const newTime = parseFloat(e.target.value);
    seek(newTime);
  };

  const handleVolumeInput = (e) => {
    handleVolumeChange(parseFloat(e.target.value));
  };

  return (
    <footer className="player-root" aria-label="Audio pleer">
      <div className="player-container">
        {/* Left: Track Information */}
        <div className="player-track-info">
          <Link
            to={`/track/${currentTrack.id}`}
            className="player-cover-wrap"
            title="Trek sahifasiga o'tish"
          >
            <img
              src={currentTrack.cover}
              alt={currentTrack.title}
              className="player-cover-img"
            />
          </Link>
          <Link
            to={`/track/${currentTrack.id}`}
            className="player-titles"
            title="Trek sahifasiga o'tish"
          >
            <span className="player-title">
              {currentTrack.title}
            </span>
            <span className="player-artist">
              {currentTrack.artist}
            </span>
          </Link>
          <button
            type="button"
            onClick={() => toggleLike(currentTrack.id)}
            className={`player-like-btn ${liked ? 'liked' : ''}`}
            aria-label="Like"
          >
            <Heart
              size={17}
              fill={liked ? '#c47171' : 'none'}
              color={liked ? '#c47171' : 'currentColor'}
            />
          </button>
        </div>

        {/* Center: Controls & Seek Bar */}
        <div className="player-center">
          <div className="player-controls">
            <button
              type="button"
              onClick={toggleShuffle}
              className={`ctrl-btn ${isShuffle ? 'active' : ''}`}
              title={isShuffle ? "Tasodifiy rejim yoqilgan" : "Tasodifiy rejim"}
            >
              <Shuffle size={16} />
            </button>

            <button
              type="button"
              onClick={playPrev}
              className="ctrl-btn"
              title="Oldingi trek"
            >
              <SkipBack size={18} fill="currentColor" />
            </button>

            <button
              type="button"
              onClick={togglePlay}
              className="ctrl-play-btn"
              title={isPlaying ? "To'xtatish (Space)" : "Ijro etish (Space)"}
            >
              {isPlaying ? (
                <Pause size={20} fill="currentColor" />
              ) : (
                <Play size={20} fill="currentColor" />
              )}
            </button>

            <button
              type="button"
              onClick={playNext}
              className="ctrl-btn"
              title="Keyingi trek"
            >
              <SkipForward size={18} fill="currentColor" />
            </button>

            <button
              type="button"
              onClick={toggleRepeat}
              className={`ctrl-btn ${isRepeat ? 'active' : ''}`}
              title={isRepeat ? "Qaytarish yoqilgan" : "Qaytarish"}
            >
              <Repeat size={16} />
            </button>
          </div>

          {/* Progress / Seek bar */}
          <div className="player-progress-row">
            <span className="time-text">{formatTime(currentTime)}</span>
            <div className="seek-bar-wrapper">
              <input
                type="range"
                min="0"
                max={duration || 30}
                step="0.1"
                value={currentTime}
                onChange={handleSeekChange}
                className="seek-range"
                aria-label="Audio vaqti"
              />
              <div
                className="seek-bar-filled"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="time-text">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right: Volume & Format Info */}
        <div className="player-right">
          <button
            type="button"
            onClick={toggleMute}
            className="volume-icon-btn"
            title={isMuted ? "Ovozni yoqish (M)" : "Ovozni o'chirish (M)"}
          >
            {isMuted || volume === 0 ? (
              <VolumeX size={18} />
            ) : volume < 0.5 ? (
              <Volume1 size={18} />
            ) : (
              <Volume2 size={18} />
            )}
          </button>

          <div className="volume-slider-wrap">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeInput}
              className="volume-range"
              aria-label="Ovoz balandligi"
            />
            <div
              className="volume-filled"
              style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
            />
          </div>

          <span className="badge-quality">AAC Hi-Fi</span>
        </div>
      </div>
    </footer>
  );
};

export default Player;
