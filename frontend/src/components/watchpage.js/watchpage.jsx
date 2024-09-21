import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './watchpage.module.scss';

const WatchPage = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Для перенаправления после удаления
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingAction, setLoadingAction] = useState(false); // Для управления состоянием кнопок

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
          console.log(data); // Проверьте структуру данных
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
    const userId = localStorage.getItem('userId') || generateRandomId(); // Получаем userId из localStorage
    localStorage.setItem('userId', userId);
  
    setLoadingAction(true); // Начало загрузки действия
    try {
      const response = await fetch(`http://localhost:5000/api/videos/${video._id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }), // Отправляем userId в запросе
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const updatedVideo = await response.json();
      setVideo(updatedVideo);
    } catch (err) {
      console.error('Error liking video:', err);
    } finally {
      setLoadingAction(false); // Завершение загрузки действия
    }
  };

  const handleDislike = async () => {
    const userId = localStorage.getItem('userId') || generateRandomId(); // Получаем userId из localStorage
    localStorage.setItem('userId', userId);
  
    setLoadingAction(true); // Начало загрузки действия
    try {
      const response = await fetch(`http://localhost:5000/api/videos/${video._id}/dislike`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }), // Отправляем userId в запросе
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const updatedVideo = await response.json();
      setVideo(updatedVideo);
    } catch (err) {
      console.error('Error disliking video:', err);
    } finally {
      setLoadingAction(false); // Завершение загрузки действия
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

  const generateRandomId = () => {
    return Math.random().toString(36).substr(2, 9); // Пример генерации уникального ID
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
            {console.log(video.filePath)}
            <source src={`http://localhost:5000${video.filePath}`} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
        <div className={styles.undervideo}>
          
        {video && <h2>{video.title}</h2>}
          <div className={styles.highinfo}>
            <div className={styles.buttons}> 
              <button onClick={handleLike} disabled={loadingAction}>
                ❤️ {video ? video.likes : 0}
              </button>
              <button onClick={handleDislike} disabled={loadingAction}>
                💔 {video ? video.dislikes : 0}
              </button>
              <button onClick={handleDelete} className={styles.deleteButton} disabled={loadingAction}>
                🗑️
              </button>
            </div>  
          </div>
          <div className={styles.info}>
            <p className={styles.compviews}>Views: <p className={styles.views}>{video ? video.views : 0} </p></p>
            <p className={styles.desc}>{video ? video.description : ''}</p> {/* Отображаем описание */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchPage;
