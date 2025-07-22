
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AnalysisHistoryProps {
  history: any[];
}

const AnalysisHistory: React.FC<AnalysisHistoryProps> = ({ history }) => {
  const { language, isRTL } = useLanguage();

  const categories = [
    { value: 'xray', label: 'X-Ray', icon: '🫁' },
    { value: 'cbc', label: 'CBC', icon: '🩸' },
    { value: 'ecg', label: 'ECG', icon: '💓' },
    { value: 'microscopy', label: 'Microscopy', icon: '🔬' }
  ];

  if (history.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className={language === 'ar' ? 'font-arabic' : ''}>
          {language === 'ar' ? 'سجل التحليلات' : 'Analysis History'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {history.slice(0, 3).map((item) => (
            <div key={item.id} className={`flex items-center space-x-4 p-3 border rounded-lg ${isRTL ? 'space-x-reverse' : ''}`}>
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-lg">
                  {categories.find(cat => cat.value === item.category)?.icon || '🔬'}
                </span>
              </div>
              <div className="flex-1">
                <p className={`font-medium ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {item.fileName}
                </p>
                <p className={`text-sm text-gray-500 ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {new Date(item.date).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                </p>
              </div>
              <div className={`text-right ${isRTL ? 'text-left' : ''}`}>
                <p className={`text-sm font-medium text-green-600 ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {item.result.diagnosis.length > 30 ? 
                    `${item.result.diagnosis.substring(0, 30)}...` : 
                    item.result.diagnosis
                  }
                </p>
                <p className="text-xs text-gray-500">{item.result.confidence}% confidence</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalysisHistory;
