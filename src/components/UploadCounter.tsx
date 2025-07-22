
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Star } from 'lucide-react';

interface UploadCounterProps {
  remainingUploads: number;
  isFreeLimitReached: boolean;
}

const UploadCounter: React.FC<UploadCounterProps> = ({ remainingUploads, isFreeLimitReached }) => {
  const { language, isRTL } = useLanguage();

  return (
    <div className="flex justify-center mb-6">
      <div className={`bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
        <Star className="w-5 h-5" />
        <span className={`font-semibold ${language === 'ar' ? 'font-arabic' : ''}`}>
          {isFreeLimitReached ? 
            (language === 'ar' ? 'انتهت التحليلات المجانية' : 'Free uploads exhausted') :
            (language === 'ar' ? `${remainingUploads} تحليلات مجانية متبقية` : `${remainingUploads} free uploads left`)
          }
        </span>
      </div>
    </div>
  );
};

export default UploadCounter;
