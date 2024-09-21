import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Добавляем useNavigate для редиректа
import styles from './watchpage.module.scss';

const WatchPage = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Для перенаправления после удаления
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

          // Увеличение количества просмотров
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
    try {
      const response = await fetch(`http://localhost:5000/api/videos/${video._id}/like`, { method: 'POST' });
      const updatedVideo = await response.json();
      setVideo(updatedVideo);
    } catch (err) {
      console.error('Error liking video:', err);
    }
  };
  
  const handleDislike = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/videos/${video._id}/dislike`, { method: 'POST' });
      const updatedVideo = await response.json();
      setVideo(updatedVideo);
    } catch (err) {
      console.error('Error disliking video:', err);
    }
  };  

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this video?");
    if (confirmDelete) {
      try {
        const response = await fetch(`http://localhost:5000/api/videos/${video._id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete video');
        }

        // После удаления перенаправляем на главную страницу или другую страницу
        navigate('/');
      } catch (err) {
        console.error('Error deleting video:', err);
      }
    }
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
          <video width="720" height="480" controls className={styles.videoPlayer}>
            <source src={`http://localhost:5000${video.filePath}`} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
        {video && <h2>{video.title}</h2>}
        <div>
          <button onClick={handleLike}>Like ({video ? video.likes : 0})</button>
          <button onClick={handleDislike}>Dislike ({video ? video.dislikes : 0})</button>
          <p>Views: {video ? video.views : 0}</p>

          {/* Кнопка удаления */}
          <button onClick={handleDelete} className={styles.deleteButton}>Delete Video</button>
        </div>
      </div>
    </div>
  );
};

export default WatchPage;
