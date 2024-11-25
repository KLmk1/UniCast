import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './header.module.scss';

const Header = () => {
  const [query, setQuery] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Получаем данные пользователя из localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link to="/UniCast/">UniCast</Link>
      </div>

      <form onSubmit={handleSearch} className={styles.searchForm}>
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={styles.searchInput}
        />
        <button type="submit" className={styles.searchButton}>🔎</button>
      </form>

      <nav className={styles.nav}>
        <ul>
          <li ><Link to="/UniCast/upload" className={styles.uploads}><img src='upload.png' className={styles.upload}/></Link></li>
          <li>
            <Link to="/UniCast/login">
              <div className={styles.avatarContainer}>
                {user ? (
                  <img
                    src={user.avatar}
                    alt={`${user.name}'s Avatar`}
                    className={styles.avatar}
                  />
                ) : (
                  <img
                    src="https://via.placeholder.com/45"
                    alt="Default Avatar"
                    className={styles.avatar}
                  />
                )}
              </div>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
