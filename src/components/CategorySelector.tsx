
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CategorySelectorProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedSubCategory?: string;
  onSubCategoryChange?: (subCategory: string) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ 
  selectedCategory, 
  onCategoryChange,
  selectedSubCategory,
  onSubCategoryChange
}) => {
  const { language, t, isRTL } = useLanguage();

  const categories = [
    { value: 'xray', label: t('xray'), icon: '🫁' },
    { value: 'cbc', label: t('cbc'), icon: '🩸' },
    { value: 'ecg', label: t('ecg'), icon: '💓' },
    { value: 'microscopy', label: t('microscopy'), icon: '🔬' }
  ];

  const microscopySubCategories = [
    { 
      value: 'tumor_classification', 
      label: language === 'ar' ? 'تصنيف الأورام (حميدة/خبيثة)' : 'Tumor Classification (Benign/Malignant)' 
    },
    { 
      value: 'breast_biopsy', 
      label: language === 'ar' ? 'خزعة الثدي' : 'Breast Biopsy' 
    },
    { 
      value: 'skin_biopsy', 
      label: language === 'ar' ? 'خزعة الجلد' : 'Skin Biopsy' 
    },
    { 
      value: 'colon_biopsy', 
      label: language === 'ar' ? 'خزعة القولون' : 'Colon Biopsy' 
    },
    { 
      value: 'cervical_biopsy', 
      label: language === 'ar' ? 'خزعة عنق الرحم' : 'Cervical Biopsy' 
    },
    { 
      value: 'prostate_biopsy', 
      label: language === 'ar' ? 'خزعة البروستاتا' : 'Prostate Biopsy' 
    },
    { 
      value: 'lung_biopsy', 
      label: language === 'ar' ? 'خزعة الرئة' : 'Lung Biopsy' 
    },
    { 
      value: 'liver_biopsy', 
      label: language === 'ar' ? 'خزعة الكبد' : 'Liver Biopsy' 
    }
  ];

  const xraySubCategories = [
    { 
      value: 'chest_lung', 
      label: language === 'ar' ? 'أشعة الصدر والرئتين' : 'Chest/Lung X-ray' 
    },
    { 
      value: 'abdominal', 
      label: language === 'ar' ? 'أشعة البطن' : 'Abdominal X-ray' 
    },
    { 
      value: 'skeletal', 
      label: language === 'ar' ? 'أشعة العظام والهيكل العظمي' : 'Skeletal/Bone X-ray' 
    }
  ];

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className={language === 'ar' ? 'font-arabic' : ''}>
          {t('selectCategory')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t('selectCategory')} />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                <div className={`flex items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
                  <span className="text-lg">{category.icon}</span>
                  <span className={language === 'ar' ? 'font-arabic' : ''}>
                    {category.label}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedCategory === 'microscopy' && (
          <div>
            <label className={`block text-sm font-medium text-gray-700 mb-2 ${language === 'ar' ? 'font-arabic' : ''}`}>
              {language === 'ar' ? 'نوع الخزعة/التحليل المرضي' : 'Biopsy/Pathology Type'}
            </label>
            <Select value={selectedSubCategory} onValueChange={onSubCategoryChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={language === 'ar' ? 'اختر نوع التحليل' : 'Select analysis type'} />
              </SelectTrigger>
              <SelectContent>
                {microscopySubCategories.map((subCategory) => (
                  <SelectItem key={subCategory.value} value={subCategory.value}>
                    <span className={language === 'ar' ? 'font-arabic' : ''}>
                      {subCategory.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {selectedCategory === 'xray' && (
          <div>
            <label className={`block text-sm font-medium text-gray-700 mb-2 ${language === 'ar' ? 'font-arabic' : ''}`}>
              {language === 'ar' ? 'نوع الأشعة السينية' : 'X-ray Type'}
            </label>
            <Select value={selectedSubCategory} onValueChange={onSubCategoryChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={language === 'ar' ? 'اختر نوع الأشعة' : 'Select X-ray type'} />
              </SelectTrigger>
              <SelectContent>
                {xraySubCategories.map((subCategory) => (
                  <SelectItem key={subCategory.value} value={subCategory.value}>
                    <span className={language === 'ar' ? 'font-arabic' : ''}>
                      {subCategory.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CategorySelector;
