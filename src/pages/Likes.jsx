import { Link, useNavigate } from 'react-router-dom';
import { Play, Pause, Trash2, ArrowLeft, Disc } from 'lucide-react';
import { useMusic } from '../context/useMusic';
import './Likes.css';

const Likes = () => {
  const navigate = useNavigate();
  const {
    likedSongs,
    currentTrack,
    isPlaying,
    playTrack,
    togglePlay,
    toggleLike,
  } = useMusic();

  const handlePlayLiked = (e, song) => {
    e.stopPropagation();
    if (currentTrack?.id === song.id) {
      togglePlay();
    } else {
      playTrack(song);
    }
  };

  const handleRowClick = (song) => {
    navigate(`/track/${song.id}`);
  };

  const handlePlayAll = () => {
    if (likedSongs.length > 0) {
      playTrack(likedSongs[0]);
    }
  };

  return (
    <div className="likes-page-root">
      <Link to="/" className="back-link">
        <ArrowLeft size={16} />
        <span>Bosh sahifaga qaytish</span>
      </Link>

      <div className="likes-header-card">
        <div className="likes-header-info">
          <h3 className="musicsec-title">Yoqtirilgan qo‘shiqlar</h3>
          <span className="musicsec-count">
            {likedSongs.length} ta trek mavjud
          </span>
          {likedSongs.length > 0 && (
            <button
              type="button"
              onClick={handlePlayAll}
              className="likes-play-all-btn"
            >
              <Play size={14} fill="currentColor" />
              <span>Barchasini tinglash</span>
            </button>
          )}
        </div>
      </div>

      {likedSongs.length === 0 ? (
        <div className="likes-empty">
          <Disc size={36} className="empty-icon" />
          <h3 className="empty-head">Hozircha sevimli qo‘shiqlar yo‘q</h3>
          <p className="empty-sub">
            Qo‘shiqlarga yurakcha belgisini bosib, ularni shu yerda to‘plashingiz mumkin.
          </p>
          <Link to="/" className="explore-btn">
            Musiqalar ro‘yxati
          </Link>
        </div>
      ) : (
        <div className="songs-table-wrap">
          <table className="songs-table">
            <thead>
              <tr>
                <th className="th-num">#</th>
                <th className="th-title">Trek</th>
                <th className="th-album">Albom</th>
                <th className="th-genre">Janr</th>
                <th className="th-duration">Vaqt</th>
                <th className="th-action"></th>
              </tr>
            </thead>
            <tbody>
              {likedSongs.map((song, index) => {
                const isCurrent = currentTrack?.id === song.id;
                const isPlayingThis = isCurrent && isPlaying;

                return (
                  <tr
                    key={song.id}
                    className={`song-row ${isCurrent ? 'active' : ''}`}
                    onClick={() => handleRowClick(song)}
                    title="Batafsil ma'lumotni ko'rish"
                  >
                    <td className="td-num">
                      <span className="row-num">{index + 1}</span>
                      <button
                        type="button"
                        className="row-play-btn"
                        onClick={(e) => handlePlayLiked(e, song)}
                      >
                        {isPlayingThis ? (
                          <Pause size={14} fill="currentColor" />
                        ) : (
                          <Play size={14} fill="currentColor" />
                        )}
                      </button>
                    </td>

                    <td className="td-title">
                      <div className="td-title-flex">
                        <img
                          src={song.cover}
                          alt={song.title}
                          className="row-cover"
                          loading="lazy"
                        />
                        <div className="row-titles">
                          <span
                            className={`row-track-name ${isCurrent ? 'active' : ''}`}
                          >
                            {song.title}
                          </span>
                          <span className="row-artist-name">{song.artist}</span>
                        </div>
                      </div>
                    </td>

                    <td className="td-album">{song.album}</td>

                    <td className="td-genre">
                      <span className="table-genre-tag">{song.genre}</span>
                    </td>

                    <td className="td-duration">{song.durationFormatted}</td>

                    <td className="td-action">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLike(song.id);
                        }}
                        className="remove-like-btn"
                        title="O'chirish"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Likes;
