import React, { useState, useEffect } from 'react';
import styles from './uploadvideo.module.scss';

const UploadPage = () => {
  const [formData, setFormData] = useState({
    selectedFile: null,
    videoTitle: '',
    videoDescription: '',
  });
  const [uploadStatus, setUploadStatus] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  useEffect(() => {
    const textarea = document.querySelector(`.${styles.descriptionInput}`);
    if (textarea) {
      textarea.style.height = 'auto'; // Сбрасываем высоту
      textarea.style.height = `${textarea.scrollHeight}px`; // Устанавливаем высоту по содержимому
    }
  }, [formData.videoDescription]); // Вызываем каждый раз при изменении описания

  const handleUpload = async () => {
    const { selectedFile, videoTitle, videoDescription } = formData;
    
    if (!selectedFile || !videoTitle || !videoDescription) {
      setUploadStatus('Please select a file, enter a title, and add a description for the video');
      return;
    }

    const formPayload = new FormData();
    formPayload.append('video', selectedFile);
    formPayload.append('title', videoTitle);
    formPayload.append('description', videoDescription);

    try {
      const response = await fetch('http://localhost:5000/api/videos/upload', {
        method: 'POST',
        body: formPayload,
      });

      if (response.ok) {
        const data = await response.json();
        setUploadStatus(`File uploaded successfully: ${data.fileName}`);
        setFormData({
          selectedFile: null,
          videoTitle: '',
          videoDescription: '',
        });
      } else {
        const errorData = await response.json();
        setUploadStatus(`Error uploading file: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadStatus('Error uploading file');
    }
  };

  return (
    <div className={styles.uploadPage}>
      <h1>Upload Video</h1>
      <input
        type="text"
        name="videoTitle"
        placeholder="Enter video title"
        value={formData.videoTitle}
        onChange={handleChange}
        className={styles.titleInput}
      />
      <textarea
        name="videoDescription"
        placeholder="Enter video description"
        value={formData.videoDescription}
        onChange={handleChange}
        className={styles.descriptionInput}
      />
      <input
        type="file"
        name="selectedFile"
        accept="video/*"
        onChange={handleChange}
      />
      <button onClick={handleUpload}>Upload</button>
      {uploadStatus && <p className={styles.statusMessage}>{uploadStatus}</p>}
    </div>
  );
};

export default UploadPage;
