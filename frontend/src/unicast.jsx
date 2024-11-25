import { Route, Routes } from 'react-router-dom';
import MainPage from './components/mainpage/mainpage';
import Header from './components/header/header';
import WatchPage from './components/watchpage.js/watchpage';
import VideoUpload from './components/uploadvideo/uploadvideo';
import SearchPage from './components/searchpage/searchpage'; // Импорт страницы поиска
import NotFoundPage from './components/notfoundpage/notfoundpage';
import RegisterPage from './components/auth/regpage/regpage'
import Login from './components/auth/loginpage/loginpage';

function UniCast() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/UniCast/" element={<MainPage />} />
        <Route path="/UniCast/watch" element={<WatchPage />} />
        <Route path="/UniCast/upload" element={<VideoUpload />} />
        <Route path="/UniCast/search" element={<SearchPage />} /> {/* Маршрут для поиска */}
        <Route path="/UniCast/register" element={<RegisterPage />} />
        <Route path="/UniCast/login" element={<Login />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default UniCast;
