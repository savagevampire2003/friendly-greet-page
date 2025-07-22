
import { useState, useEffect } from 'react';

export const useUploadLimit = () => {
  const [uploadCount, setUploadCount] = useState(0);

  useEffect(() => {
    const savedCount = localStorage.getItem('nashmed_upload_count');
    if (savedCount) {
      setUploadCount(parseInt(savedCount));
    }
  }, []);

  const incrementUploadCount = () => {
    const newCount = uploadCount + 1;
    setUploadCount(newCount);
    localStorage.setItem('nashmed_upload_count', newCount.toString());
  };

  const resetUploadCount = () => {
    setUploadCount(0);
    localStorage.setItem('nashmed_upload_count', '0');
  };

  const remainingUploads = Math.max(0, 3 - uploadCount);
  const isFreeLimitReached = uploadCount >= 3;

  return {
    uploadCount,
    remainingUploads,
    isFreeLimitReached,
    incrementUploadCount,
    resetUploadCount
  };
};
