// src/api/videoApi.js

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Получение данных о видео по ID
export const getVideoById = async (videoId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/videos/${videoId}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching video:', error);
    throw error;
  }
};

export const getAllVideos = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/videos`);
    if (!response.ok) {
      throw new Error('Failed to fetch videos');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching videos:', error);
    throw error;
  }
};




const uploadVideo = async (videoFile) => {
  const formData = new FormData();
  formData.append('video', videoFile);

  try {
    const response = await fetch('http://localhost:5000/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload video');
    }

    const data = await response.json();
    console.log('Video uploaded successfully:', data);
  } catch (error) {
    console.error('Error uploading video:', error);
  }
};

