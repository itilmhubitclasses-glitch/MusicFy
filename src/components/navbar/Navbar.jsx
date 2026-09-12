import { NavLink, useNavigate } from 'react-router-dom';
import { Music2, Search, Heart, Info, Home, X, Sun, Moon } from 'lucide-react';
import { useMusic } from '../../context/useMusic';
import './Navbar.css';

const Navbar = () => {
  const { searchQuery, setSearchQuery, likedSongIds, theme, toggleTheme } = useMusic();
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (window.location.pathname !== '/') {
      navigate('/');
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  return (
    <header className="navbar-root">
      <div className="navbar-container">
        {/* Brand / Logo */}
        <NavLink to="/" className="navbar-brand" title="MusicFy">
          <div className="brand-icon-box">
            <Music2 size={18} className="brand-icon" />
          </div>
          <span className="brand-text">Music<span className="brand-dot">Fy</span></span>
        </NavLink>

        {/* Minimal Search Bar */}
        <div className="navbar-search">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Qidirish..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
            aria-label="Qidirish"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="search-clear-btn"
              aria-label="Qidiruvni tozalash"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="navbar-nav">
          <NavLink
            to="/"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            title="Bosh sahifa"
            end
          >
            <Home size={16} className="nav-icon" />
            <span>Bosh sahifa</span>
          </NavLink>

          <NavLink
            to="/likes"
            className={({ isActive }) => `nav-link nav-link-like ${isActive ? 'active' : ''}`}
            title="Sevimlilar"
          >
            <Heart size={16} className="nav-icon" />
            <span>Like</span>
            {likedSongIds.length > 0 && (
              <span className="like-counter">{likedSongIds.length}</span>
            )}
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            title="Biz haqimizda"
          >
            <Info size={16} className="nav-icon" />
            <span>About us</span>
          </NavLink>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="theme-toggle-btn"
            title={theme === 'dark' ? "Yorug' rejim (Light mode)" : "Qorong'u rejim (Dark mode)"}
            aria-label="Mavzuni almashtirish"
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
