import { Play, Shuffle } from 'lucide-react';
import { useMusic } from '../../context/useMusic';
import './Banner.css';

const Banner = () => {
  const { songs, playTrack, toggleShuffle, isShuffle } = useMusic();

  const handlePlayAll = () => {
    if (songs.length > 0) {
      playTrack(songs[0]);
    }
  };

  const handleShufflePlay = () => {
    if (!isShuffle) {
      toggleShuffle();
    }
    const randomIndex = Math.floor(Math.random() * songs.length);
    playTrack(songs[randomIndex]);
  };

  return (
    <section className="banner-root" aria-label="Pleylist boshqaruvi">
      <div className="banner-card">
        <div className="banner-left">
          <h2 className="banner-heading">Musiqalar to‘plami</h2>
          <span className="banner-count">{songs.length} ta sara trek</span>
        </div>

        <div className="banner-controls">
          <button
            type="button"
            onClick={handlePlayAll}
            className="banner-btn-primary"
          >
            <Play size={15} fill="currentColor" />
            <span>Barchasini ijro etish</span>
          </button>

          <button
            type="button"
            onClick={handleShufflePlay}
            className={`banner-btn-secondary ${isShuffle ? 'active' : ''}`}
          >
            <Shuffle size={15} />
            <span>Tasodifiy ijro</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Banner;
