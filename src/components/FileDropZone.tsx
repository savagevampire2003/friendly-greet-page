
import React, { useRef, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { FileImage, CheckCircle } from 'lucide-react';

interface FileDropZoneProps {
  selectedFile: File | null;
  onFileSelect: (file: File) => void;
  isFreeLimitReached: boolean;
}

const FileDropZone: React.FC<FileDropZoneProps> = ({ selectedFile, onFileSelect, isFreeLimitReached }) => {
  const { language } = useLanguage();
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      onFileSelect(file);
    }
  };

  return (
    <Card className="mb-8">
      <CardContent className="p-8">
        <div
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer ${
            dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
          } ${isFreeLimitReached ? 'opacity-50' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isFreeLimitReached && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
            disabled={isFreeLimitReached}
          />
          
          {selectedFile ? (
            <div className="space-y-4">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              <div>
                <p className={`text-lg font-medium text-gray-900 ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {selectedFile.name}
                </p>
                <p className="text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <FileImage className="w-16 h-16 text-gray-400 mx-auto" />
              <div>
                <p className={`text-lg font-medium text-gray-900 ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {isFreeLimitReached ? 
                    (language === 'ar' ? 'يرجى الدفع للمتابعة' : 'Please upgrade to continue') :
                    (language === 'ar' ? 'اسحب وأفلت الصورة هنا أو انقر للتحميل' : 'Drag and drop image here or click to upload')
                  }
                </p>
                <p className={`text-gray-500 ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {isFreeLimitReached ? 
                    (language === 'ar' ? 'انتهت التحليلات المجانية' : 'Free limit reached') :
                    'PNG, JPG, JPEG up to 10MB'
                  }
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FileDropZone;
