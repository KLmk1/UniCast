import { Route, Routes } from 'react-router-dom';
import MainPage from './components/mainpage/mainpage';
import Header from './components/header/header';
import WatchPage from './components/watchpage.js/watchpage';
import VideoUpload from './components/uploadvideo/uploadvideo';
import SearchPage from './components/searchpage/searchpage'; // Импорт страницы поиска
import NotFoundPage from './components/notfoundpage/notfoundpage';

function UniCast() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/watch" element={<WatchPage />} />
        <Route path="/upload" element={<VideoUpload />} />
        <Route path="/search" element={<SearchPage />} /> {/* Маршрут для поиска */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default UniCast;
