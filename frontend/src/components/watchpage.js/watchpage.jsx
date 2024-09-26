import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './watchpage.module.scss';

const WatchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingAction, setLoadingAction] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false); // Новое состояние для управления описанием

  const getVideoIdFromQuery = () => {
    const params = new URLSearchParams(location.search);
    return params.get('v');
  };
  
  useEffect(() => {
    const videoId = getVideoIdFromQuery();
    if (videoId) {
      const fetchVideo = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/videos/${videoId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch video');
          }
          const data = await response.json();
          setVideo(data);
          setLoading(false);

          await fetch(`http://localhost:5000/api/videos/${videoId}/view`, { method: 'POST' });
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      };

      fetchVideo();
    } else {
      setError('No video ID provided');
      setLoading(false);
    }
  }, [location]);

  const handleLike = async () => {
    const userId = localStorage.getItem('userId') || generateRandomId();
    localStorage.setItem('userId', userId);

    setLoadingAction(true);
    try {
      const response = await fetch(`http://localhost:5000/api/videos/${video._id}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const updatedVideo = await response.json();
      setVideo(updatedVideo);
    } catch (err) {
      console.error('Error liking video:', err);
    } finally {
      setLoadingAction(false);
    }
  };

  const handleDislike = async () => {
    const userId = localStorage.getItem('userId') || generateRandomId();
    localStorage.setItem('userId', userId);

    setLoadingAction(true);
    try {
      const response = await fetch(`http://localhost:5000/api/videos/${video._id}/dislike`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const updatedVideo = await response.json();
      setVideo(updatedVideo);
    } catch (err) {
      console.error('Error disliking video:', err);
    } finally {
      setLoadingAction(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this video?");
    if (confirmDelete) {
      try {
        const response = await fetch(`http://localhost:5000/api/videos/${video._id}`, {
          method: 'DELETE',
        });

        if (!response.ok) throw new Error('Failed to delete video');

        navigate('/');
      } catch (err) {
        console.error('Error deleting video:', err);
      }
    }
  };

  const generateRandomId = () => Math.random().toString(36).substr(2, 9);

  const toggleDescription = () => {
    setIsDescriptionExpanded((prev) => !prev); // Переключаем состояние
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={styles.watchPage}>
      <div className={styles.videoContainer}>
        {video && (
          <video controls className={styles.videoPlayer}>
            <source src={`http://localhost:5000${video.filePath}`} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
        <div className={styles.undervideo}>
          <div className={styles.title}>
            {video && <h2>{video.title}</h2>}
          </div>
          <div className={styles.highinfo}>
            <div className={styles.buttons}>
              <button onClick={handleLike} disabled={loadingAction}>❤️ {video ? video.likes : 0}</button>
              <button onClick={handleDislike} disabled={loadingAction}>💔 {video ? video.dislikes : 0}</button>
              <button onClick={handleDelete} className={styles.deleteButton} disabled={loadingAction}>🗑️</button>
            </div>
          </div>
          <div className={`${styles.info} ${isDescriptionExpanded ? styles.expanded : ''}`} onClick={toggleDescription}>
            <p className={styles.compviews}>Views: <span className={styles.views}>{video ? video.views : 0}</span></p>
            <p
              className={`${styles.desc} ${isDescriptionExpanded ? styles.expanded : ''}`} // Применяем класс для раскрытия
            >
              {video ? video.description : ''}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchPage;
