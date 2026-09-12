import { Play, Pause, Heart } from 'lucide-react';
import { useMusic } from '../../context/useMusic';
import './Hero.css';

const Hero = () => {
  const { currentTrack, isPlaying, togglePlay, playTrack, isLiked, toggleLike, songs } = useMusic();

  const featured = currentTrack || songs[0];

  if (!featured) return null;

  const isCurrentPlaying = currentTrack?.id === featured.id && isPlaying;
  const liked = isLiked(featured.id);

  const handlePlayClick = () => {
    if (currentTrack?.id === featured.id) {
      togglePlay();
    } else {
      playTrack(featured);
    }
  };

  return (
    <section className="hero-root" aria-label="Tanlangan musiqa">
      <div className="hero-card">
        {/* Cover Art */}
        <div className="hero-cover-wrap">
          <img
            src={featured.cover}
            alt={featured.title}
            className="hero-cover-img"
          />
        </div>

        {/* Info Column */}
        <div className="hero-content">
          <span className="hero-sub">Tavsiya etilgan</span>

          <h1 className="hero-title">{featured.title}</h1>
          
          <div className="hero-meta">
            <span className="hero-artist">{featured.artist}</span>
            <span className="meta-dot">•</span>
            <span className="hero-album">{featured.album}</span>
            <span className="meta-dot">•</span>
            <span className="hero-year">{featured.year}</span>
            <span className="hero-genre-pill">{featured.genre}</span>
          </div>

          <div className="hero-actions">
            <button
              type="button"
              onClick={handlePlayClick}
              className="hero-play-btn"
              aria-label={isCurrentPlaying ? "To'xtatish" : "Tinglash"}
            >
              {isCurrentPlaying ? <Pause size={17} fill="currentColor" /> : <Play size={17} fill="currentColor" />}
              <span>{isCurrentPlaying ? "To'xtatish" : "Tinglash"}</span>
            </button>

            <button
              type="button"
              onClick={() => toggleLike(featured.id)}
              className={`hero-like-btn ${liked ? 'liked' : ''}`}
              aria-label={liked ? "Sevimlilardan o'chirish" : "Sevimlilarga qo'shish"}
            >
              <Heart size={16} fill={liked ? '#c47171' : 'none'} color={liked ? '#c47171' : 'currentColor'} />
              <span>{liked ? 'Yoqtirilgan' : 'Saqlash'}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
