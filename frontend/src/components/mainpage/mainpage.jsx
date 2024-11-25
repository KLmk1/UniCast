import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './mainpage.module.scss';

const MainPage = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/videos');
        const data = await response.json();
        setVideos(data);
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div className={styles.mainPage}>
      <div className={styles.videoGrid}>
        {videos.map((video) => (
          <Link to={`/UniCast/watch?v=${video._id}`} className={styles.linktovid} key={video._id}>
            <div className={styles.videoCard}>
              <div className={styles.videoWrapper}>
                <video controls className={styles.videoThumbnail}>
                  <source src={`http://localhost:5000${video.filePath}`} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className={styles.videoInfo}>
                <h3 className={styles.videoTitle}>{video.title}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MainPage;
