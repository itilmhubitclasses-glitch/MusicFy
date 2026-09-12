import { useState, useEffect } from 'react';
import { Play, Pause, Heart, LayoutGrid, List, Clock, Disc, ChevronLeft, ChevronRight } from 'lucide-react';
import { useMusic } from '../../context/useMusic';
import './MusicSec.css';

const ITEMS_PER_PAGE = 12;

const MusicSec = () => {
  const {
    filteredSongs,
    currentTrack,
    isPlaying,
    playTrack,
    togglePlay,
    isLiked,
    toggleLike,
    searchQuery,
    selectedGenre,
  } = useMusic();

  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);

  // Reset page to 1 when search query or genre filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedGenre]);

  const totalPages = Math.ceil(filteredSongs.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentSongs = filteredSongs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleTrackClick = (song) => {
    if (currentTrack?.id === song.id) {
      togglePlay();
    } else {
      playTrack(song);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Smooth scroll to music section top
      const section = document.querySelector('.musicsec-root');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <section className="musicsec-root" aria-label="Musiqalar ro'yxati">
      {/* Section Header */}
      <div className="musicsec-header">
        <div>
          <h3 className="musicsec-title">
            {searchQuery ? `"${searchQuery}" bo‘yicha natijalar` : 'Barcha Musiqalar'}
          </h3>
          <span className="musicsec-count">{filteredSongs.length} ta trek mavjud</span>
        </div>

        {/* View mode toggle */}
        <div className="view-toggle">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
            aria-label="Kataklar ko'rinishi"
            title="Kataklar ko'rinishi"
          >
            <LayoutGrid size={16} />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
            aria-label="Ro'yxat ko'rinishi"
            title="Ro'yxat ko'rinishi"
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Empty state */}
      {filteredSongs.length === 0 && (
        <div className="empty-state">
          <Disc size={42} className="empty-icon" />
          <p className="empty-title">Musiqa topilmadi</p>
          <p className="empty-desc">Boshqa so‘z yoki janr bo‘yicha qidirib ko‘ring.</p>
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && filteredSongs.length > 0 && (
        <div className="songs-grid">
          {currentSongs.map((song) => {
            const isCurrent = currentTrack?.id === song.id;
            const isPlayingThis = isCurrent && isPlaying;
            const liked = isLiked(song.id);

            return (
              <div
                key={song.id}
                className={`song-card ${isCurrent ? 'active' : ''}`}
                onClick={() => handleTrackClick(song)}
              >
                <div className="song-card-cover-wrap">
                  <img
                    src={song.cover}
                    alt={song.title}
                    className="song-card-cover"
                    loading="lazy"
                  />
                  <button
                    type="button"
                    className={`card-play-btn ${isPlayingThis ? 'playing' : ''}`}
                    aria-label={isPlayingThis ? "To'xtatish" : "Ijro etish"}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTrackClick(song);
                    }}
                  >
                    {isPlayingThis ? (
                      <Pause size={17} fill="currentColor" />
                    ) : (
                      <Play size={17} fill="currentColor" />
                    )}
                  </button>
                </div>

                <div className="song-card-info">
                  <div className="song-card-text">
                    <h4 className="song-card-title" title={song.title}>
                      {song.title}
                    </h4>
                    <p className="song-card-artist" title={song.artist}>
                      {song.artist}
                    </p>
                  </div>

                  <div className="song-card-footer">
                    <span className="song-genre-tag">{song.genre}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(song.id);
                      }}
                      className={`card-like-btn ${liked ? 'liked' : ''}`}
                      aria-label="Like"
                    >
                      <Heart
                        size={15}
                        fill={liked ? '#c47171' : 'none'}
                        color={liked ? '#c47171' : 'currentColor'}
                      />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && filteredSongs.length > 0 && (
        <div className="songs-table-wrap">
          <table className="songs-table">
            <thead>
              <tr>
                <th className="th-num">#</th>
                <th className="th-title">Trek</th>
                <th className="th-album">Albom</th>
                <th className="th-genre">Janr</th>
                <th className="th-duration">
                  <Clock size={14} />
                </th>
                <th className="th-action"></th>
              </tr>
            </thead>
            <tbody>
              {currentSongs.map((song, index) => {
                const isCurrent = currentTrack?.id === song.id;
                const isPlayingThis = isCurrent && isPlaying;
                const liked = isLiked(song.id);
                const actualIndex = startIndex + index + 1;

                return (
                  <tr
                    key={song.id}
                    className={`song-row ${isCurrent ? 'active' : ''}`}
                    onClick={() => handleTrackClick(song)}
                  >
                    <td className="td-num">
                      <span className="row-num">{actualIndex}</span>
                      <button
                        type="button"
                        className="row-play-btn"
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
                          <span className={`row-track-name ${isCurrent ? 'active' : ''}`}>
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
                        className={`row-like-btn ${liked ? 'liked' : ''}`}
                        aria-label="Like"
                      >
                        <Heart
                          size={15}
                          fill={liked ? '#c47171' : 'none'}
                          color={liked ? '#c47171' : 'currentColor'}
                        />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="musicsec-pagination">
          <button
            type="button"
            className="page-nav-btn"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Oldingi sahifa"
          >
            <ChevronLeft size={16} />
            <span className="page-nav-text">Oldingi</span>
          </button>

          <div className="page-numbers">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                type="button"
                className={`page-num-btn ${currentPage === pageNum ? 'active' : ''}`}
                onClick={() => handlePageChange(pageNum)}
              >
                {pageNum}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="page-nav-btn"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Keyingi sahifa"
          >
            <span className="page-nav-text">Keyingi</span>
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </section>
  );
};

export default MusicSec;

