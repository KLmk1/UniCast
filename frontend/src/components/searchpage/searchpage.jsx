import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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
        const query = new URLSearchParams(location.search).get('q');
        if (query) {
          try {
            const response = await fetch(`http://localhost:5000/api/videos/search?q=${encodeURIComponent(query)}`);
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setVideos(data);
            setLoading(false);
          } catch (err) {
            console.error('Error fetching search results:', err);
            setError(err.message);
            setLoading(false);
          }
        }
      };
      

    fetchSearchResults();
  }, [location]);

  if (loading) {
    return <div>Loading search results...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={styles.searchPage}>
      <h2>Search Results for "{getSearchQuery()}"</h2>
      <div className={styles.videoGrid}>
        {videos.length > 0 ? (
          videos.map((video) => (
            <div key={video._id} className={styles.videoCard}>
              <video width="320" height="240" controls>
                <source src={`http://localhost:5000${video.filePath}`} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <h3>{video.title}</h3>
            </div>
          ))
        ) : (
          <p>No videos found for your query.</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
