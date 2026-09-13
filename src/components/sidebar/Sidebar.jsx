import { NavLink } from 'react-router-dom';
import { Home, Heart, Info, Disc3 } from 'lucide-react';
import { useMusic } from '../../context/useMusic';
import './Sidebar.css';

export const GENRES = [
  { id: 'all', label: 'Barchasi' },
  { id: 'pop', label: 'Pop' },
  { id: 'hip-hop/rap', label: 'Hip-Hop / Rap' },
  { id: 'phonk', label: 'Phonk' },
  { id: 'alternative', label: 'Alternative' },
  { id: 'dance', label: 'Dance & Club' },
  { id: 'r&b/soul', label: 'R&B / Soul' },
];

const Sidebar = () => {
  const { selectedGenre, setSelectedGenre, likedSongIds } = useMusic();

  return (
    <aside className="sidebar-root" aria-label="Asosiy menyu">
      {/* Navigation section */}
      <div className="sidebar-section">
        <h4 className="sidebar-heading">Menyu</h4>
        <nav className="sidebar-nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            title="Asosiy sahifa"
          >
            <Home size={18} className="sidebar-icon" />
            <span className="sidebar-link-text">Asosiy sahifa</span>
          </NavLink>

          <NavLink
            to="/likes"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            title="Sevimlilar"
          >
            <div className="sidebar-icon-wrap">
              <Heart size={18} className="sidebar-icon like-icon" />
              {likedSongIds.length > 0 && (
                <span className="sidebar-badge-mini">{likedSongIds.length}</span>
              )}
            </div>
            <span className="sidebar-link-text">Sevimlilar</span>
            {likedSongIds.length > 0 && (
              <span className="sidebar-badge">{likedSongIds.length}</span>
            )}
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            title="Biz haqimizda"
          >
            <Info size={18} className="sidebar-icon" />
            <span className="sidebar-link-text">Biz haqimizda</span>
          </NavLink>
        </nav>
      </div>

      {/* Genre Filter section (Visible on desktop sidebar) */}
      <div className="sidebar-section sidebar-genres-section">
        <h4 className="sidebar-heading">Janrlar</h4>
        <div className="genre-list">
          {GENRES.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => setSelectedGenre(g.id)}
              className={`genre-item ${selectedGenre === g.id ? 'active' : ''}`}
              title={g.label}
            >
              <Disc3 size={15} className="genre-icon" />
              <span className="genre-item-text">{g.label}</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
