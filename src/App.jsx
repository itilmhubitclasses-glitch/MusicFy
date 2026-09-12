import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MusicProvider } from './context/MusicContext';
import Navbar from './components/navbar/Navbar';
import Sidebar from './components/sidebar/Sidebar';
import Player from './components/player/Player';
import Footer from './components/footer/Footer';
import Home from './pages/Home';
import Likes from './pages/Likes';
import About from './pages/About';
import './App.css';

const App = () => {
  return (
    <MusicProvider>
      <BrowserRouter>
        <div className="app-layout">
          <Navbar />

          <div className="app-body">
            <Sidebar />

            <main className="app-main-content">
              <div className="content-inner">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/likes" element={<Likes />} />
                  <Route path="/about" element={<About />} />
                </Routes>
              </div>
              <Footer />
            </main>
          </div>

          <Player />
        </div>
      </BrowserRouter>
    </MusicProvider>
  );
};

export default App;