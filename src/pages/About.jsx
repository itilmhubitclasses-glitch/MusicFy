import { Link } from 'react-router-dom';
import { ArrowLeft, Cpu, Zap, Music2, Code2 } from 'lucide-react';
import './About.css';

const About = () => {
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
          <h3 className="about-card-title">Sara 20 ta xit musiqa</h3>
          <p className="about-card-desc">
            Ommabop xalqaro xitlar va musiqalarning rasmiy audio oqimlari ulab qo‘yilgan.
          </p>
        </div>
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
