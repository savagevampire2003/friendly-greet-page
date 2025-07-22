import { toast } from '@/hooks/use-toast';

export interface MedicalAnalysisRequest {
  image: File;
  category: 'cbc' | 'ecg' | 'xray' | 'microscopy';
  language?: 'en' | 'ar';
  subCategory?: string;
  patientInfo?: {
    name?: string;
    age?: number;
    gender?: string;
  };
}

export interface MedicalParameter {
  name: string;
  value: string;
  unit: string;
  referenceRange: string;
  status: 'normal' | 'high' | 'low';
}

export interface MedicalAnalysisResponse {
  analysis: string;
  parameters: MedicalParameter[];
  findings: string[];
  recommendations: string[];
  severity: 'normal' | 'mild' | 'moderate' | 'severe';
  confidence: number;
  timestamp: string;
  category: 'cbc' | 'ecg' | 'xray' | 'microscopy';
}

export class MedicalAnalysisService {
  private static readonly API_BASE_URL = 'http://localhost:8000';

  static async analyzeMedicalImage(request: MedicalAnalysisRequest): Promise<MedicalAnalysisResponse> {
    console.log(`Starting ${request.category.toUpperCase()} analysis...`, { fileName: request.image.name, size: request.image.size, subCategory: request.subCategory });
    
    try {
      // Health check
      try {
        const healthCheck = await fetch(`${this.API_BASE_URL}/health`);
        if (!healthCheck.ok) {
          throw new Error('Backend health check failed');
        }
        console.log('Backend health check passed');
      } catch (healthError) {
        console.error('Backend not accessible:', healthError);
        throw new Error('Backend server is not running. Please start the FastAPI server first.');
      }

      const formData = new FormData();
      formData.append('file', request.image);
      formData.append('category', request.category);
      
      // Enhanced language instruction for GPT
      const language = request.language || 'en';
      formData.append('language', language);
      
      // Add sub-category for microscopy
      if (request.subCategory) {
        formData.append('sub_category', request.subCategory);
      }
      
      // Add specific language instruction for GPT
      const languageInstruction = language === 'ar' 
        ? 'Please respond in Arabic language. All medical analysis, findings, recommendations, and explanations should be in Arabic.' 
        : 'Please respond in English language.';
      formData.append('language_instruction', languageInstruction);
      
      if (request.patientInfo) {
        formData.append('patient_info', JSON.stringify(request.patientInfo));
      }

      console.log(`Sending ${request.category} analysis request to backend with language: ${language}, subCategory: ${request.subCategory}...`);
      const response = await fetch(`${this.API_BASE_URL}/api/medical/analyze`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`Analysis failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Analysis successful:', result);
      
      return {
        ...result,
        category: request.category,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error(`${request.category.toUpperCase()} Analysis Error:`, error);
      
      if (error instanceof Error) {
        if (error.message.includes('Backend server is not running')) {
          toast({
            title: 'Backend Not Running',
            description: 'Please start the FastAPI server by running "python setup.py" in the backend folder.',
            variant: 'destructive',
          });
        } else if (error.message.includes('Failed to fetch')) {
          toast({
            title: 'Connection Failed',
            description: 'Cannot connect to the analysis server. Make sure it\'s running http://localhost:8000',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Analysis Failed',
            description: error.message || `Failed to analyze ${request.category.toUpperCase()} image. Please try again.`,
            variant: 'destructive',
          });
        }
      }
      
      throw error;
    }
  }

  static async generatePDFReport(result: MedicalAnalysisResponse, imageFile: File, patientInfo?: any, language: 'en' | 'ar' = 'en', userInfo?: any): Promise<void> {
    try {
      console.log('Generating PDF report using Puppeteer service...');
      
      // Prepare form data for backend PDF generation
      const formData = new FormData();
      formData.append('analysis_data', JSON.stringify(result));
      formData.append('category', result.category);
      formData.append('language', language);
      
      // Combine patient info and user info
      const combinedInfo = {
        ...patientInfo,
        ...(userInfo && {
          generated_by: userInfo.full_name || userInfo.email,
          user_email: userInfo.email
        })
      };
      
      if (combinedInfo && Object.keys(combinedInfo).length > 0) {
        formData.append('patient_info', JSON.stringify(combinedInfo));
      }
      
      if (imageFile) {
        formData.append('image_file', imageFile);
      }
      
      // Call backend PDF generation endpoint
      const response = await fetch(`${this.API_BASE_URL}/generate-pdf`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`PDF generation failed: ${response.status} ${response.statusText}`);
      }
      
      // Get PDF blob from response
      const pdfBlob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      
      // Set filename based on category and language
      const categoryNames = {
        en: {
          cbc: 'CBC_Analysis_Report',
          ecg: 'ECG_Analysis_Report', 
          xray: 'XRay_Analysis_Report',
          microscopy: 'Microscopy_Analysis_Report'
        },
        ar: {
          cbc: 'تقرير_تحليل_صورة_الدم',
          ecg: 'تقرير_تخطيط_القلب',
          xray: 'تقرير_الأشعة_السينية', 
          microscopy: 'تقرير_التحليل_المجهري'
        }
      };
      
      const categoryName = categoryNames[language][result.category] || result.category;
      const timestamp = new Date().toISOString().split('T')[0];
      link.download = `${categoryName}_${timestamp}.pdf`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      
      toast({
        title: language === 'ar' ? 'تم تحميل التقرير' : 'Report Downloaded',
        description: language === 'ar' ? 
          'تم إنشاء وتحميل تقرير PDF بنجاح مع دعم كامل للنصوص العربية.' : 
          'PDF report has been generated and downloaded successfully with full Arabic text support.',
        duration: 3000, // Auto-dismiss after 3 seconds to prevent accumulation
      });
      
    } catch (error) {
      console.error('Puppeteer PDF generation error:', error);
      
      // Show specific error messages
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          toast({
            title: language === 'ar' ? 'فشل الاتصال' : 'Connection Failed',
            description: language === 'ar' ? 
              'تعذر الاتصال بخدمة إنشاء PDF. تأكد من تشغيل الخادم الخلفي.' : 
              'Cannot connect to PDF generation service. Make sure the backend server is running.',
            variant: 'destructive',
          });
        } else {
          toast({
            title: language === 'ar' ? 'فشل في إنشاء PDF' : 'PDF Generation Failed',
            description: language === 'ar' ? 
              'فشل في إنشاء تقرير PDF. يرجى المحاولة مرة أخرى.' : 
              'Failed to generate PDF report. Please try again.',
            variant: 'destructive',
          });
        }
      }
      
      throw error;
    }
  }
}
