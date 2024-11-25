import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import styles from './searchpage.module.scss';

const SearchPage = () => {
  const location = useLocation();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getSearchQuery = () => {
    const params = new URLSearchParams(location.search);
    return params.get('q') || '';
  };

  useEffect(() => {
    const fetchSearchResults = async () => {
      const query = getSearchQuery();
      if (query) {
        try {
          const response = await fetch(`http://localhost:5000/api/videos/search?q=${encodeURIComponent(query)}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setVideos(data);
        } catch (err) {
          console.error('Error fetching search results:', err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false); // Set loading to false if there's no query
      }
    };

    fetchSearchResults();
  }, [location]);

  if (loading) {
    return <div className={styles.loading}>Loading search results...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  return (
    <div className={styles.searchPage}>
      <h2>Search Results for "{getSearchQuery()}"</h2>
      <div className={styles.videoGrid}>
        {videos.length > 0 ? (
          videos.map((video) => (
            <Link 
              key={video._id} 
              to={`/watch?v=${video._id}`} // Navigate to WatchPage
              className={styles.linktovid}
            >
              <div className={styles.videoCard}>
                <div className={styles.videoWrapper}>
                  <video className={styles.videoThumbnail} controls>
                    <source src={`http://localhost:5000${video.filePath}`} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
                <div className={styles.videoInfo}>
                  <h3 className={styles.videoTitle}>{video.title}</h3>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p>No videos found for your query.</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
