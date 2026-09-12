import Hero from '../components/hero/Hero';
import Banner from '../components/banner/Banner';
import MusicSec from '../components/musicSec/MusicSec';

const Home = () => {
  return (
    <div className="home-page-container">
      <Hero />
      <Banner />
      <MusicSec />
    </div>
  );
};

export default Home;
