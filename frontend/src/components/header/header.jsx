import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './header.module.scss'; // Импортируем стили

const Header = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link to="/">UniCast</Link>
      </div>
      
      {/* Поисковая строка */}
      <form onSubmit={handleSearch} className={styles.searchForm}>
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={styles.searchInput}
        />
        <button type="submit" className={styles.searchButton}>Search</button>
      </form>

      <nav className={styles.nav}>
        <ul>
          <li><Link to="/upload">Upload</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
