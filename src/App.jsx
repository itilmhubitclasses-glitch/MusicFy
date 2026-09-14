import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MusicProvider } from './context/MusicContext';
import { useMusic } from './context/useMusic';
import Navbar from './components/navbar/Navbar';
import Sidebar from './components/sidebar/Sidebar';
import Player from './components/player/Player';
import Footer from './components/footer/Footer';
import AddMusicModal from './components/addMusicModal/AddMusicModal';
import Toast from './components/toast/Toast';
import Home from './pages/Home';
import Likes from './pages/Likes';
import About from './pages/About';
import './App.css';

const AppContent = () => {
  const { isAddModalOpen, closeAddModal, toast, hideToast } = useMusic();

  return (
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

        {/* Global Add Music Modal */}
        <AddMusicModal isOpen={isAddModalOpen} onClose={closeAddModal} />

        {/* Global Toast Notification */}
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      </div>
    </BrowserRouter>
  );
};

const App = () => {
  return (
    <MusicProvider>
      <AppContent />
    </MusicProvider>
  );
};

export default App;