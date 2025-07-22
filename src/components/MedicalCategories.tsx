
import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Activity, Droplets, Heart, Microscope, ArrowRight } from 'lucide-react';

const MedicalCategories = () => {
  const { language, t, isRTL } = useLanguage();

  const categories = [
    {
      id: 'xray',
      icon: Activity,
      title: t('xrayAnalysis'),
      description: t('xrayDesc'),
      color: 'blue',
      gradient: 'from-blue-500 to-blue-600',
      details: {
        en: 'Our AI-powered X-ray analysis can detect pneumonia, fractures, and other chest abnormalities with 95% accuracy. The system analyzes chest X-rays in seconds and provides detailed diagnostic insights.',
        ar: 'تحليل الأشعة السينية المدعوم بالذكاء الاصطناعي يمكنه اكتشاف الالتهاب الرئوي والكسور وتشوهات الصدر الأخرى بدقة 95%. يحلل النظام أشعة الصدر في ثوانٍ ويقدم رؤى تشخيصية مفصلة.'
      }
    },
    {
      id: 'cbc',
      icon: Droplets,
      title: t('cbcAnalysis'),
      description: t('cbcDesc'),
      color: 'red',
      gradient: 'from-red-500 to-red-600',
      details: {
        en: 'Complete Blood Count analysis helps identify infections, anemia, leukemia, and other blood disorders. Our AI analyzes blood cell counts and morphology to provide comprehensive insights.',
        ar: 'تحليل تعداد الدم الكامل يساعد في تحديد العدوى وفقر الدم وسرطان الدم واضطرابات الدم الأخرى. يحلل الذكاء الاصطناعي لدينا عدد خلايا الدم والشكل المورفولوجي لتقديم رؤى شاملة.'
      }
    },
    {
      id: 'ecg',
      icon: Heart,
      title: t('ecgAnalysis'),
      description: t('ecgDesc'),
      color: 'green',
      gradient: 'from-green-500 to-green-600',
      details: {
        en: 'ECG analysis detects heart rhythm abnormalities, arrhythmias, and cardiac conditions. Our advanced algorithms can identify over 30 different cardiac abnormalities with clinical-grade accuracy.',
        ar: 'تحليل تخطيط القلب يكتشف اضطرابات نظم القلب وعدم انتظام ضربات القلب وحالات القلب. خوارزمياتنا المتقدمة يمكنها تحديد أكثر من 30 شذوذ قلبي مختلف بدقة سريرية.'
      }
    },
    {
      id: 'microscopy',
      icon: Microscope,
      title: t('microscopyAnalysis'),
      description: t('microscopyDesc'),
      color: 'purple',
      gradient: 'from-purple-500 to-purple-600',
      details: {
        en: 'Microscopy image analysis for cellular abnormalities, parasites, and pathogenic organisms. Our AI can identify malaria parasites, bacteria, and other microscopic findings with high precision.',
        ar: 'تحليل صور المجهر للتشوهات الخلوية والطفيليات والكائنات المسببة للأمراض. يمكن للذكاء الاصطناعي لدينا تحديد طفيليات الملاريا والبكتيريا والنتائج المجهرية الأخرى بدقة عالية.'
      }
    }
  ];

  return (
    <section id="features-section" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className={`text-3xl md:text-4xl font-bold text-gray-900 mb-4 ${language === 'ar' ? 'font-arabic' : ''}`}>
            {t('featuresTitle')}
          </h2>
          <p className={`text-xl text-gray-600 max-w-2xl mx-auto ${language === 'ar' ? 'font-arabic' : ''}`}>
            Advanced AI analysis for various types of medical imaging
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Card key={category.id} className="medical-card-hover cursor-pointer group">
                <CardHeader className="text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${category.gradient} rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className={`text-lg ${language === 'ar' ? 'font-arabic' : ''}`}>
                    {category.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className={`text-center mb-4 ${language === 'ar' ? 'font-arabic' : ''}`}>
                    {category.description}
                  </CardDescription>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" className={`w-full group-hover:bg-gray-100 ${language === 'ar' ? 'font-arabic' : ''}`}>
                        {t('learnMore')}
                        <ArrowRight className={`w-4 h-4 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'} group-hover:translate-x-1 transition-transform`} />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle className={`flex items-center gap-3 ${language === 'ar' ? 'font-arabic' : ''}`}>
                          <div className={`inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r ${category.gradient} rounded-lg`}>
                            <IconComponent className="w-5 h-5 text-white" />
                          </div>
                          {category.title}
                        </DialogTitle>
                        <DialogDescription className={`text-left ${language === 'ar' ? 'font-arabic text-right' : ''}`}>
                          {category.details[language as keyof typeof category.details]}
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MedicalCategories;
