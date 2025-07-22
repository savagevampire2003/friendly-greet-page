
import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Crown, CheckCircle, Loader2, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PaymentModalProps {
  showPaymentModal: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ showPaymentModal, onClose, onPaymentSuccess }) => {
  const { language, isRTL } = useLanguage();
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const { toast } = useToast();

  const handlePayment = async () => {
    setIsPaymentProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    onPaymentSuccess();
    onClose();
    setIsPaymentProcessing(false);
    
    toast({
      title: language === 'ar' ? 'تم الدفع بنجاح' : 'Payment Successful',
      description: language === 'ar' ? 
        'يمكنك الآن الاستمتاع بالتحليلات غير المحدودة' : 
        'You can now enjoy unlimited analyses',
    });
  };

  return (
    <Dialog open={showPaymentModal} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className={`flex items-center ${language === 'ar' ? 'font-arabic' : ''} ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Crown className={`w-6 h-6 text-yellow-500 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {language === 'ar' ? 'ترقية إلى النسخة المميزة' : 'Upgrade to Premium'}
          </DialogTitle>
          <DialogDescription className={language === 'ar' ? 'font-arabic text-right' : ''}>
            {language === 'ar' ? 
              'لقد استنفدت التحليلات المجانية الثلاثة. قم بالترقية للحصول على تحليلات غير محدودة.' :
              'You have used your 3 free analyses. Upgrade for unlimited medical image analysis.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border">
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div>
                <h3 className={`font-semibold text-lg ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {language === 'ar' ? 'النسخة المميزة' : 'Premium Plan'}
                </h3>
                <p className={`text-sm text-gray-600 ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {language === 'ar' ? 'تحليلات غير محدودة' : 'Unlimited analyses'}
                </p>
              </div>
              <div className={`text-right ${isRTL ? 'text-left' : ''}`}>
                <div className="text-2xl font-bold text-blue-600">$9.99</div>
                <div className={`text-sm text-gray-500 ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {language === 'ar' ? '/شهر' : '/month'}
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className={`text-sm ${language === 'ar' ? 'font-arabic' : ''}`}>
                {language === 'ar' ? 'تحليلات غير محدودة' : 'Unlimited analyses'}
              </span>
            </div>
            <div className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className={`text-sm ${language === 'ar' ? 'font-arabic' : ''}`}>
                {language === 'ar' ? 'تقارير PDF مفصلة' : 'Detailed PDF reports'}
              </span>
            </div>
            <div className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className={`text-sm ${language === 'ar' ? 'font-arabic' : ''}`}>
                {language === 'ar' ? 'سجل كامل للتحليلات' : 'Complete analysis history'}
              </span>
            </div>
            <div className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className={`text-sm ${language === 'ar' ? 'font-arabic' : ''}`}>
                {language === 'ar' ? 'دعم فني مميز' : 'Priority support'}
              </span>
            </div>
          </div>
          
          <Button
            onClick={handlePayment}
            disabled={isPaymentProcessing}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            {isPaymentProcessing ? (
              <>
                <Loader2 className={`w-4 h-4 animate-spin ${isRTL ? 'ml-2' : 'mr-2'}`} />
                <span className={language === 'ar' ? 'font-arabic' : ''}>
                  {language === 'ar' ? 'جاري المعالجة...' : 'Processing...'}
                </span>
              </>
            ) : (
              <>
                <Zap className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                <span className={language === 'ar' ? 'font-arabic' : ''}>
                  {language === 'ar' ? 'ترقية الآن' : 'Upgrade Now'}
                </span>
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
