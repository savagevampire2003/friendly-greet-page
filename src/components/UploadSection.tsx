
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../hooks/useAuth';
import { useMedicalAnalyses } from '../hooks/useMedicalAnalyses';
import { useFileUpload } from '../hooks/useFileUpload';
import { Button } from '@/components/ui/button';
import { Upload, Loader2, LogIn, Trash2, Languages, LogOut } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAnalysis } from '../hooks/useAnalysis';
import CategorySelector from './CategorySelector';
import FileDropZone from './FileDropZone';
import AnalysisResults from './AnalysisResults';
import AnalysisHistory from './AnalysisHistory';
import AuthModal from './AuthModal';

const UploadSection = () => {
  const { language, t, isRTL } = useLanguage();
  const { user, signOut } = useAuth();
  const { analyses, saveAnalysis } = useMedicalAnalyses();
  const { uploadFile, uploading } = useFileUpload();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('');
  const [responseLanguage, setResponseLanguage] = useState<'en' | 'ar'>('en');
  const [showAuthModal, setShowAuthModal] = useState(false);

  const { 
    isAnalyzing, 
    result, 
    setResult, 
    simulateAnalysis,
    clearResult,
    clearInput
  } = useAnalysis();

  const handleFileSelect = (file: File) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setResult(null);
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    // Reset sub-category when main category changes
    if (category !== 'microscopy' && category !== 'xray') {
      setSelectedSubCategory('');
    }
  };

  const handleAnalyze = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (selectedFile && selectedCategory) {
      // For microscopy and xray, require sub-category selection
      if ((selectedCategory === 'microscopy' || selectedCategory === 'xray') && !selectedSubCategory) {
        return;
      }

      // Upload file first
      const uploadResult = await uploadFile(selectedFile, selectedCategory);
      
      if (uploadResult) {
        // Perform analysis with sub-category info
        await simulateAnalysis(
          selectedCategory, 
          selectedFile, 
          analyses, 
          () => {}, 
          responseLanguage,
          selectedSubCategory
        );
      }
    }
  };

  const handleClearInput = () => {
    const shouldClear = clearInput();
    if (shouldClear) {
      setSelectedFile(null);
      setSelectedCategory('');
      setSelectedSubCategory('');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setSelectedFile(null);
    setResult(null);
    setSelectedSubCategory('');
  };

  // Check if analysis can proceed
  const canAnalyze = selectedFile && selectedCategory && 
    ((selectedCategory !== 'microscopy' && selectedCategory !== 'xray') || selectedSubCategory);

  return (
    <section id="upload-section" className="py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className={`text-3xl md:text-4xl font-bold text-gray-900 mb-4 ${language === 'ar' ? 'font-arabic' : ''}`}>
            {t('uploadTitle')}
          </h2>
          
          {user ? (
            <>
              <div className="flex justify-center items-center gap-4 mb-6">
                <p className={`text-lg text-gray-600 ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {language === 'ar' ? `مرحباً، ${user.user_metadata?.full_name || user.email}` : `Welcome, ${user.user_metadata?.full_name || user.email}`}
                </p>
                <Button variant="outline" onClick={handleSignOut} className={language === 'ar' ? 'font-arabic' : ''}>
                  <LogOut className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {language === 'ar' ? 'تسجيل الخروج' : 'Sign Out'}
                </Button>
              </div>
            </>
          ) : (
            <div className="mb-8">
              <p className={`text-lg text-gray-600 mb-4 ${language === 'ar' ? 'font-arabic' : ''}`}>
                {language === 'ar' ? 'يرجى تسجيل الدخول لتحليل الصور الطبية' : 'Please sign in to analyze medical images'}
              </p>
              <Button onClick={() => setShowAuthModal(true)} className="medical-gradient text-white">
                <LogIn className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                <span className={language === 'ar' ? 'font-arabic' : ''}>
                  {language === 'ar' ? 'تسجيل الدخול' : 'Sign In'}
                </span>
              </Button>
            </div>
          )}
        </div>

        {user && (
          <>
            <CategorySelector 
              selectedCategory={selectedCategory} 
              onCategoryChange={handleCategoryChange}
              selectedSubCategory={selectedSubCategory}
              onSubCategoryChange={setSelectedSubCategory}
            />

            <FileDropZone 
              selectedFile={selectedFile} 
              onFileSelect={handleFileSelect} 
              isFreeLimitReached={false}
            />

            {selectedFile && canAnalyze && (
              <div className="text-center mb-8">
                <div className="mb-4">
                  <label className={`block text-sm font-medium text-gray-700 mb-2 ${language === 'ar' ? 'font-arabic' : ''}`}>
                    {language === 'ar' ? 'لغة الاستجابة' : 'Response Language'}
                  </label>
                  <Select value={responseLanguage} onValueChange={(value: 'en' | 'ar') => setResponseLanguage(value)}>
                    <SelectTrigger className="w-60 mx-auto">
                      <div className="flex items-center gap-2">
                        <Languages className="w-4 h-4" />
                        <SelectValue />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">
                        <span className="flex items-center gap-2">
                          <span>🇺🇸</span>
                          English
                        </span>
                      </SelectItem>
                      <SelectItem value="ar">
                        <span className="flex items-center gap-2">
                          <span>🇸🇦</span>
                          العربية
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || uploading}
                  size="lg"
                  className="medical-gradient text-white px-8 py-3"
                >
                  {(isAnalyzing || uploading) ? (
                    <>
                      <Loader2 className={`w-5 h-5 animate-spin ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      <span className={language === 'ar' ? 'font-arabic' : ''}>
                        {uploading ? (language === 'ar' ? 'جاري الرفع...' : 'Uploading...') : t('analyzing')}
                      </span>
                    </>
                  ) : (
                    <>
                      <Upload className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      <span className={language === 'ar' ? 'font-arabic' : ''}>{t('analyze')}</span>
                    </>
                  )}
                </Button>
              </div>
            )}

            {selectedFile && ((selectedCategory === 'microscopy' && !selectedSubCategory) || (selectedCategory === 'xray' && !selectedSubCategory)) && (
              <div className="text-center mb-8">
                <p className={`text-yellow-600 ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {selectedCategory === 'microscopy' 
                    ? (language === 'ar' ? 'يرجى اختيار نوع التحليل المرضي للمتابعة' : 'Please select a pathology analysis type to proceed')
                    : (language === 'ar' ? 'يرجى اختيار نوع الأشعة السينية للمتابعة' : 'Please select an X-ray type to proceed')
                  }
                </p>
              </div>
            )}

            <AnalysisResults 
              result={result} 
              originalFile={selectedFile} 
              onClear={clearResult}
              onClearInput={handleClearInput}
            />

            {analyses.length > 0 && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className={`text-xl font-semibold ${language === 'ar' ? 'font-arabic' : ''}`}>
                    {language === 'ar' ? 'سجل التحليلات' : 'Analysis History'}
                  </h3>
                </div>
                <AnalysisHistory history={analyses.map(analysis => ({
                  id: analysis.id,
                  date: analysis.created_at,
                  category: analysis.category,
                  fileName: analysis.file_name,
                  result: {
                    diagnosis: typeof analysis.analysis_result === 'object' && analysis.analysis_result && 'analysis' in analysis.analysis_result 
                      ? (analysis.analysis_result as any).analysis 
                      : 'Analysis complete',
                    confidence: analysis.confidence_score || 0
                  },
                  image: analysis.file_url
                }))} />
              </div>
            )}
          </>
        )}

        <AuthModal 
          open={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      </div>
    </section>
  );
};

export default UploadSection;
