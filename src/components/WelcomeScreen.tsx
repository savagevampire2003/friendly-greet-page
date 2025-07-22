
import React, { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Activity, Brain, Microscope, Stethoscope, Heart, Zap } from 'lucide-react';

interface WelcomeScreenProps {
  onComplete: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onComplete }) => {
  const { language, isRTL } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      icon: Brain,
      title: language === 'ar' ? 'الذكاء الاصطناعي الطبي' : 'AI-Powered Medicine',
      subtitle: language === 'ar' ? 'تحليل طبي متقدم بالذكاء الاصطناعي' : 'Advanced Medical Analysis with AI'
    },
    {
      icon: Microscope,
      title: language === 'ar' ? 'تحليل دقيق' : 'Precise Analysis',
      subtitle: language === 'ar' ? 'تشخيص دقيق للصور الطبية' : 'Accurate Medical Image Diagnosis'
    },
    {
      icon: Activity,
      title: language === 'ar' ? 'نتائج فورية' : 'Instant Results',
      subtitle: language === 'ar' ? 'احصل على النتائج في ثوانٍ' : 'Get Results in Seconds'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          setTimeout(() => onComplete(), 1000);
          return prev;
        }
      });
    }, 2000);

    return () => clearInterval(timer);
  }, [onComplete, steps.length]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-100/30 rounded-full animate-pulse" />
        <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-green-100/30 rounded-full animate-pulse delay-1000" />
        <div className="absolute bottom-1/4 left-1/3 w-32 h-32 bg-purple-100/30 rounded-full animate-pulse delay-2000" />
        
        {/* Floating Medical Icons */}
        <Heart className="absolute top-1/3 right-1/3 w-8 h-8 text-red-300/40 animate-bounce delay-500" />
        <Stethoscope className="absolute bottom-1/3 left-1/4 w-6 h-6 text-blue-300/40 animate-bounce delay-1000" />
        <Zap className="absolute top-1/2 left-1/6 w-5 h-5 text-yellow-300/40 animate-bounce delay-1500" />
      </div>

      <div className="relative z-10 text-center max-w-2xl mx-auto px-8">
        {/* Logo */}
        <div className="mb-12 animate-scale-in">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl shadow-2xl mb-6 relative overflow-hidden">
            <img 
              src="/IMG_5657.jpeg.jpg" 
              alt="MedDx Logo" 
              className="w-16 h-16 object-contain rounded-lg"
            />
          </div>
          <h1 className={`text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4 ${language === 'ar' ? 'font-arabic' : ''}`}>
            MedDx
          </h1>
          <p className={`text-lg text-gray-600 ${language === 'ar' ? 'font-arabic' : ''}`}>
            {language === 'ar' ? 'منصة التشخيص الطبي بالذكاء الاصطناعي' : 'AI-Powered Medical Diagnostics Platform'}
          </p>
        </div>

        {/* Animation Steps */}
        <div className="space-y-8">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            const isActive = index === currentStep;
            const isPassed = index < currentStep;
            
            return (
              <div
                key={index}
                className={`flex items-center justify-center space-x-4 transition-all duration-1000 ${
                  isActive ? 'opacity-100 scale-110' : isPassed ? 'opacity-60 scale-95' : 'opacity-30 scale-90'
                } ${isRTL ? 'space-x-reverse' : ''}`}
              >
                <div className={`flex items-center justify-center w-16 h-16 rounded-full transition-all duration-500 ${
                  isActive ? 'medical-gradient shadow-xl' : 'bg-gray-100'
                }`}>
                  <IconComponent className={`w-8 h-8 transition-colors duration-500 ${
                    isActive ? 'text-white' : 'text-gray-400'
                  }`} />
                </div>
                <div className={`text-left ${isRTL ? 'text-right' : 'text-left'} ${language === 'ar' ? 'font-arabic' : ''}`}>
                  <h3 className={`text-xl font-semibold transition-colors duration-500 ${
                    isActive ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </h3>
                  <p className={`text-sm transition-colors duration-500 ${
                    isActive ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    {step.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="mt-12">
          <div className="w-full bg-gray-200 rounded-full h-2 mx-auto max-w-xs">
            <div 
              className="medical-gradient h-2 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
          <p className={`text-sm text-gray-500 mt-4 ${language === 'ar' ? 'font-arabic' : ''}`}>
            {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
