
import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, Upload, FileText, Activity, Download, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { CBCAnalysisService, CBCAnalysisRequest, CBCAnalysisResponse } from '../services/cbcAnalysisService';

const CBCAnalysis = () => {
  const { language, isRTL } = useLanguage();
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<CBCAnalysisResponse | null>(null);
  const [patientInfo, setPatientInfo] = useState({
    name: '',
    age: '',
    gender: ''
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setAnalysisResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    try {
      const request: CBCAnalysisRequest = {
        image: selectedFile,
        patientInfo: {
          name: patientInfo.name || undefined,
          age: patientInfo.age ? parseInt(patientInfo.age) : undefined,
          gender: patientInfo.gender || undefined,
        }
      };

      const result = await CBCAnalysisService.analyzeCBCReport(request);
      setAnalysisResult(result);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDownloadReport = () => {
    if (analysisResult) {
      const userInfo = user ? {
        full_name: user.user_metadata?.full_name,
        email: user.email
      } : undefined;
      CBCAnalysisService.generatePDFReport(analysisResult, patientInfo, userInfo);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'normal': return 'text-green-600 bg-green-50 border-green-200';
      case 'mild': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'moderate': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'severe': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'high': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'low': return <XCircle className="w-4 h-4 text-blue-600" />;
      default: return <CheckCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'bg-green-100 text-green-800';
      case 'high': return 'bg-red-100 text-red-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className={`flex items-center ${language === 'ar' ? 'font-arabic' : ''} ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Activity className={`w-6 h-6 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {language === 'ar' ? 'تحليل CBC المتقدم' : 'Advanced CBC Analysis'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Patient Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="patient-name" className={language === 'ar' ? 'font-arabic' : ''}>
                {language === 'ar' ? 'اسم المريض' : 'Patient Name'}
              </Label>
              <Input
                id="patient-name"
                value={patientInfo.name}
                onChange={(e) => setPatientInfo(prev => ({ ...prev, name: e.target.value }))}
                placeholder={language === 'ar' ? 'اختياري' : 'Optional'}
              />
            </div>
            <div>
              <Label htmlFor="patient-age" className={language === 'ar' ? 'font-arabic' : ''}>
                {language === 'ar' ? 'العمر' : 'Age'}
              </Label>
              <Input
                id="patient-age"
                type="number"
                value={patientInfo.age}
                onChange={(e) => setPatientInfo(prev => ({ ...prev, age: e.target.value }))}
                placeholder={language === 'ar' ? 'اختياري' : 'Optional'}
              />
            </div>
            <div>
              <Label htmlFor="patient-gender" className={language === 'ar' ? 'font-arabic' : ''}>
                {language === 'ar' ? 'الجنس' : 'Gender'}
              </Label>
              <Input
                id="patient-gender"
                value={patientInfo.gender}
                onChange={(e) => setPatientInfo(prev => ({ ...prev, gender: e.target.value }))}
                placeholder={language === 'ar' ? 'ذكر/أنثى' : 'Male/Female'}
              />
            </div>
          </div>

          {/* File Upload */}
          <div>
            <Label htmlFor="cbc-file" className={language === 'ar' ? 'font-arabic' : ''}>
              {language === 'ar' ? 'صورة تقرير CBC' : 'CBC Report Image'}
            </Label>
            <Input
              id="cbc-file"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="mt-1"
            />
          </div>

          {selectedFile && (
            <div className="text-sm text-gray-600">
              <p className={language === 'ar' ? 'font-arabic' : ''}>
                {language === 'ar' ? 'الملف المحدد:' : 'Selected file:'} {selectedFile.name}
              </p>
            </div>
          )}

          <Button
            onClick={handleAnalyze}
            disabled={!selectedFile || isAnalyzing}
            className="w-full medical-gradient text-white"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className={`w-4 h-4 animate-spin ${isRTL ? 'ml-2' : 'mr-2'}`} />
                <span className={language === 'ar' ? 'font-arabic' : ''}>
                  {language === 'ar' ? 'جاري التحليل...' : 'Analyzing...'}
                </span>
              </>
            ) : (
              <>
                <Upload className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                <span className={language === 'ar' ? 'font-arabic' : ''}>
                  {language === 'ar' ? 'تحليل التقرير' : 'Analyze Report'}
                </span>
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysisResult && (
        <div className="space-y-6">
          {/* Summary Card */}
          <Card className={`border-2 ${getSeverityColor(analysisResult.severity)}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className={`flex items-center ${language === 'ar' ? 'font-arabic' : ''}`}>
                  <FileText className={`w-6 h-6 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {language === 'ar' ? 'ملخص التحليل' : 'Analysis Summary'}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className={getSeverityColor(analysisResult.severity)}>
                    {analysisResult.severity.toUpperCase()}
                  </Badge>
                  <span className="text-sm text-gray-600">
                    {analysisResult.confidence}% {language === 'ar' ? 'ثقة' : 'Confidence'}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className={`font-semibold mb-2 ${language === 'ar' ? 'font-arabic' : ''}`}>
                    {language === 'ar' ? 'التحليل التفصيلي:' : 'Detailed Analysis:'}
                  </h3>
                  <p className={`text-gray-700 leading-relaxed ${language === 'ar' ? 'font-arabic' : ''}`}>
                    {analysisResult.analysis}
                  </p>
                </div>
                
                <Button onClick={handleDownloadReport} className="w-full" variant="outline">
                  <Download className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  <span className={language === 'ar' ? 'font-arabic' : ''}>
                    {language === 'ar' ? 'تحميل التقرير' : 'Download Report'}
                  </span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Parameters Table */}
          {analysisResult.parameters && analysisResult.parameters.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className={language === 'ar' ? 'font-arabic' : ''}>
                  {language === 'ar' ? 'المعايير المختبرية' : 'Laboratory Parameters'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className={`text-left py-2 ${language === 'ar' ? 'font-arabic' : ''}`}>
                          {language === 'ar' ? 'المعيار' : 'Parameter'}
                        </th>
                        <th className={`text-left py-2 ${language === 'ar' ? 'font-arabic' : ''}`}>
                          {language === 'ar' ? 'القيمة' : 'Value'}
                        </th>
                        <th className={`text-left py-2 ${language === 'ar' ? 'font-arabic' : ''}`}>
                          {language === 'ar' ? 'المرجع' : 'Reference'}
                        </th>
                        <th className={`text-left py-2 ${language === 'ar' ? 'font-arabic' : ''}`}>
                          {language === 'ar' ? 'الحالة' : 'Status'}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {analysisResult.parameters.map((param, index) => (
                        <tr key={index} className="border-b">
                          <td className={`py-2 font-medium ${language === 'ar' ? 'font-arabic' : ''}`}>
                            {param.name}
                          </td>
                          <td className="py-2">
                            {param.value} {param.unit}
                          </td>
                          <td className={`py-2 text-sm text-gray-600 ${language === 'ar' ? 'font-arabic' : ''}`}>
                            {param.referenceRange}
                          </td>
                          <td className="py-2">
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(param.status)}
                              <Badge className={getStatusColor(param.status)}>
                                {param.status.toUpperCase()}
                              </Badge>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Findings & Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Findings */}
            <Card>
              <CardHeader>
                <CardTitle className={language === 'ar' ? 'font-arabic' : ''}>
                  {language === 'ar' ? 'النتائج الرئيسية' : 'Key Findings'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysisResult.findings.map((finding, index) => (
                    <li key={index} className={`flex items-start space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className={`text-gray-700 ${language === 'ar' ? 'font-arabic' : ''}`}>
                        {finding}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className={language === 'ar' ? 'font-arabic' : ''}>
                  {language === 'ar' ? 'التوصيات' : 'Recommendations'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysisResult.recommendations.map((rec, index) => (
                    <li key={index} className={`flex items-start space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className={`text-gray-700 ${language === 'ar' ? 'font-arabic' : ''}`}>
                        {rec}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Disclaimer */}
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className={language === 'ar' ? 'font-arabic' : ''}>
              {language === 'ar' 
                ? 'هذا التحليل للأغراض التعليمية فقط ولا يغني عن استشارة طبية متخصصة. يرجى استشارة طبيب مختص للحصول على تفسير طبي صحيح.'
                : 'This analysis is for educational purposes only and does not replace professional medical consultation. Please consult with a qualified healthcare provider for proper medical interpretation.'
              }
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
};

export default CBCAnalysis;
