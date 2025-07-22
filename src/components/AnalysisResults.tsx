import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Activity, Download, FileText, X, RefreshCw } from 'lucide-react';
import { MedicalAnalysisService } from '../services/medicalAnalysisService';
import FormattedText from './FormattedText';

interface AnalysisResultsProps {
  result: any;
  originalFile?: File;
  onClear?: () => void;
  onClearInput?: () => void;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ result, originalFile, onClear, onClearInput }) => {
  const { language, t, isRTL } = useLanguage();
  const { user } = useAuth();

  if (!result) return null;

  const handleDownloadReport = () => {
    const userInfo = user ? {
      full_name: user.user_metadata?.full_name,
      email: user.email
    } : undefined;

    if (result.fullAnalysis && originalFile) {
      MedicalAnalysisService.generatePDFReport(result.fullAnalysis, originalFile, undefined, language, userInfo);
    } else {
      // Fallback for simulated results
      const mockAnalysis = {
        analysis: result.details,
        parameters: result.parameters || [],
        findings: result.findings || [],
        recommendations: Array.isArray(result.recommendations) ? result.recommendations : [result.recommendations],
        severity: result.severity || 'normal',
        confidence: result.confidence || 85,
        timestamp: new Date().toISOString(),
        category: result.category || 'general'
      };
      
      if (originalFile) {
        MedicalAnalysisService.generatePDFReport(mockAnalysis, originalFile, undefined, language, userInfo);
      }
    }
  };

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'normal': return 'border-green-200 bg-green-50';
      case 'mild': return 'border-yellow-200 bg-yellow-50';
      case 'moderate': return 'border-orange-200 bg-orange-50';
      case 'severe': return 'border-red-200 bg-red-50';
      default: return 'border-green-200 bg-green-50';
    }
  };

  const getSeverityIcon = (severity?: string) => {
    switch (severity) {
      case 'severe':
      case 'moderate':
        return <AlertCircle className={`w-6 h-6 text-red-600 ${isRTL ? 'ml-2' : 'mr-2'}`} />;
      case 'mild':
        return <AlertCircle className={`w-6 h-6 text-yellow-600 ${isRTL ? 'ml-2' : 'mr-2'}`} />;
      default:
        return <CheckCircle className={`w-6 h-6 text-green-600 ${isRTL ? 'ml-2' : 'mr-2'}`} />;
    }
  };

  return (
    <Card className={`border-2 ${getSeverityColor(result.severity)} mb-8`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className={`flex items-center text-green-800 ${language === 'ar' ? 'font-arabic' : ''} ${isRTL ? 'flex-row-reverse' : ''}`}>
            {result.severity ? getSeverityIcon(result.severity) : <CheckCircle className={`w-6 h-6 ${isRTL ? 'ml-2' : 'mr-2'}`} />}
            {t('resultsTitle')}
          </CardTitle>
          <div className="flex items-center space-x-2">
            {result.severity && (
              <Badge variant="outline" className={getSeverityColor(result.severity)}>
                {result.severity.toUpperCase()}
              </Badge>
            )}
            {onClearInput && (
              <Button variant="outline" size="sm" onClick={onClearInput}>
                <RefreshCw className={`w-4 h-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                <span className={language === 'ar' ? 'font-arabic' : ''}>
                  {language === 'ar' ? 'مسح الإدخال' : 'Clear Input'}
                </span>
              </Button>
            )}
            {onClear && (
              <Button variant="outline" size="sm" onClick={onClear}>
                <X className={`w-4 h-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                <span className={language === 'ar' ? 'font-arabic' : ''}>
                  {language === 'ar' ? 'مسح' : 'Clear'}
                </span>
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Diagnosis */}
        {result.diagnosis && (
          <div>
            <h3 className={`font-semibold text-gray-900 mb-2 ${language === 'ar' ? 'font-arabic' : ''}`}>
              {t('diagnosis')}:
            </h3>
            <p className={`text-gray-700 ${language === 'ar' ? 'font-arabic' : ''}`}>
              {result.diagnosis}
            </p>
          </div>
        )}
        
        {/* Confidence Bar */}
        <div>
          <h3 className={`font-semibold text-gray-900 mb-2 ${language === 'ar' ? 'font-arabic' : ''}`}>
            {t('confidence')}:
          </h3>
          <div className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${result.confidence}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium text-gray-700">{result.confidence}%</span>
          </div>
        </div>

        {/* Detailed Analysis with Formatted Text */}
        <div>
          <h3 className={`font-semibold text-gray-900 mb-2 ${language === 'ar' ? 'font-arabic' : ''}`}>
            {language === 'ar' ? 'التحليل التفصيلي:' : 'Detailed Analysis:'}
          </h3>
          <div className={`bg-gray-50 p-4 rounded-lg ${language === 'ar' ? 'font-arabic' : ''}`}>
            <FormattedText 
              text={result.details} 
              className="text-gray-700"
            />
          </div>
        </div>

        {/* Parameters Table - if available */}
        {result.parameters && result.parameters.length > 0 && (
          <div>
            <h3 className={`font-semibold text-gray-900 mb-3 ${language === 'ar' ? 'font-arabic' : ''}`}>
              {language === 'ar' ? 'المعايير المختبرية:' : 'Laboratory Parameters:'}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className={`text-left p-3 border-b ${language === 'ar' ? 'font-arabic' : ''}`}>
                      {language === 'ar' ? 'المعيار' : 'Parameter'}
                    </th>
                    <th className={`text-left p-3 border-b ${language === 'ar' ? 'font-arabic' : ''}`}>
                      {language === 'ar' ? 'القيمة' : 'Value'}
                    </th>
                    <th className={`text-left p-3 border-b ${language === 'ar' ? 'font-arabic' : ''}`}>
                      {language === 'ar' ? 'الحالة' : 'Status'}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {result.parameters.map((param: any, index: number) => (
                    <tr key={index} className="border-b">
                      <td className={`p-3 font-medium ${language === 'ar' ? 'font-arabic' : ''}`}>
                        {param.name}
                      </td>
                      <td className="p-3">
                        {param.value} {param.unit}
                      </td>
                      <td className="p-3">
                        <Badge 
                          variant={param.status === 'normal' ? 'default' : 'destructive'}
                          className="text-xs"
                        >
                          {param.status.toUpperCase()}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Findings */}
        {result.findings && result.findings.length > 0 && (
          <div>
            <h3 className={`font-semibold text-gray-900 mb-2 ${language === 'ar' ? 'font-arabic' : ''}`}>
              {language === 'ar' ? 'النتائج:' : 'Findings:'}
            </h3>
            <ul className="space-y-2">
              {result.findings.map((finding: string, index: number) => (
                <li key={index} className={`flex items-start space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className={`text-gray-700 ${language === 'ar' ? 'font-arabic' : ''}`}>
                    <FormattedText text={finding} />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Recommendations */}
        <div>
          <h3 className={`font-semibold text-gray-900 mb-2 ${language === 'ar' ? 'font-arabic' : ''}`}>
            {language === 'ar' ? 'التوصيات:' : 'Recommendations:'}
          </h3>
          <div className={`bg-blue-50 p-4 rounded-lg ${language === 'ar' ? 'font-arabic' : ''}`}>
            <div className="text-blue-800">
              <FormattedText text={result.recommendations} />
            </div>
          </div>
        </div>

        {/* Severity Indicator */}
        {result.severity && (
          <div className={`p-3 rounded-lg border ${getSeverityColor(result.severity)}`}>
            <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Activity className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              <span className={`font-medium ${language === 'ar' ? 'font-arabic' : ''}`}>
                {language === 'ar' ? 'مستوى الخطورة:' : 'Severity Level:'} 
                <span className={`ml-2 ${isRTL ? 'mr-2 ml-0' : ''}`}>
                  {result.severity.charAt(0).toUpperCase() + result.severity.slice(1)}
                </span>
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <Button onClick={handleDownloadReport} className="flex-1" variant="outline">
            <Download className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            <span className={language === 'ar' ? 'font-arabic' : ''}>{t('downloadReport')}</span>
          </Button>
        </div>

        {/* Disclaimer */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className={language === 'ar' ? 'font-arabic' : ''}>
            {t('disclaimerText')}
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default AnalysisResults;
