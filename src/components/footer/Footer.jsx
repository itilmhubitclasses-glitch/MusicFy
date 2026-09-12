import { Link } from 'react-router-dom';
import { Music2, Keyboard, ShieldCheck } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-root">
      <div className="footer-container">
        {/* Top Info Grid */}
        <div className="footer-grid">
          {/* Brand Col */}
          <div className="footer-col brand-col">
            <div className="footer-brand">
              <div className="footer-icon-box">
                <Music2 size={18} />
              </div>
              <span className="footer-brand-title">Music<span>Fy</span></span>
            </div>
            <p className="footer-desc">
              Toza frontend arxitekturasida qurilgan minimalist musiqa platformasi. Serverlarsiz, tejamkor va to‘liq HTML5 Web Audio asosida ishlaydi.
            </p>
          </div>

          {/* Nav Links */}
          <div className="footer-col">
            <h5 className="footer-col-title">Navigatsiya</h5>
            <ul className="footer-links">
              <li><Link to="/">Bosh sahifa</Link></li>
              <li><Link to="/likes">Yoqtirilgan treklar</Link></li>
              <li><Link to="/about">Biz haqimizda</Link></li>
            </ul>
          </div>

          {/* Hotkeys Cheat Sheet */}
          <div className="footer-col hotkeys-col">
            <h5 className="footer-col-title">
              <Keyboard size={14} className="hotkey-title-icon" />
              <span>Tezkor tugmalar</span>
            </h5>
            <div className="hotkey-list">
              <div className="hotkey-item">
                <kbd className="hotkey-kbd">Space</kbd>
                <span className="hotkey-desc">Ijro / To‘xtatish</span>
              </div>
              <div className="hotkey-item">
                <kbd className="hotkey-kbd">← / →</kbd>
                <span className="hotkey-desc">5 soniya oldinga/orqaga</span>
              </div>
              <div className="hotkey-item">
                <kbd className="hotkey-kbd">↑ / ↓</kbd>
                <span className="hotkey-desc">Ovozni sozlash</span>
              </div>
              <div className="hotkey-item">
                <kbd className="hotkey-kbd">M</kbd>
                <span className="hotkey-desc">Ovozni o‘chirish (Mute)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            © {new Date().getFullYear()} MusicFy. Shaxsiy tinglash uchun yaratilgan minimalist loyiha.
          </p>
          <div className="footer-badge">
            <ShieldCheck size={14} />
            <span>0 Backend • 100% Client-Side</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
