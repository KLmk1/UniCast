import React, { useState } from 'react';
import styles from './uploadvideo.module.scss';

const UploadPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [videoTitle, setVideoTitle] = useState(''); // Стейт для названия видео
  const [uploadStatus, setUploadStatus] = useState('');

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleTitleChange = (e) => {
    setVideoTitle(e.target.value); // Обновляем название видео
  };

  const handleUpload = async () => {
    if (!selectedFile || !videoTitle) {
      setUploadStatus('Please select a file and enter a title for the video');
      return;
    }

    const formData = new FormData();
    formData.append('video', selectedFile);
    formData.append('title', videoTitle); // Добавляем название видео

    try {
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setUploadStatus(`File uploaded successfully: ${data.fileName}`);
      } else {
        setUploadStatus('Error uploading file');
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
        placeholder="Enter video title"
        value={videoTitle}
        onChange={handleTitleChange}
        className={styles.titleInput}
      />
      <input type="file" accept="video/*" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {uploadStatus && <p className={styles.statusMessage}>{uploadStatus}</p>}
    </div>
  );
};

export default UploadPage;
