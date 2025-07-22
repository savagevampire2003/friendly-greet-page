
import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Mail, Lock, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SignInModalProps {
  showSignInModal: boolean;
  onClose: () => void;
  onSignInSuccess: () => void;
}

const SignInModal: React.FC<SignInModalProps> = ({ showSignInModal, onClose, onSignInSuccess }) => {
  const { language, isRTL } = useLanguage();
  const { toast } = useToast();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulate successful authentication
    toast({
      title: language === 'ar' ? 'تم تسجيل الدخول بنجاح' : 'Successfully signed in',
      description: language === 'ar' ? 'مرحباً بك في نش ميد' : 'Welcome to NashMed',
    });

    setIsLoading(false);
    onSignInSuccess();
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);

    // Simulate Google sign-in delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: language === 'ar' ? 'تم تسجيل الدخول بنجاح' : 'Successfully signed in',
      description: language === 'ar' ? 'تم تسجيل الدخول باستخدام جوجل' : 'Signed in with Google',
    });

    setIsLoading(false);
    onSignInSuccess();
  };

  return (
    <Dialog open={showSignInModal} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className={`text-center ${language === 'ar' ? 'font-arabic' : ''}`}>
            {isSignUp ? 
              (language === 'ar' ? 'إنشاء حساب جديد' : 'Create Account') :
              (language === 'ar' ? 'تسجيل الدخول' : 'Sign In')
            }
          </DialogTitle>
          <DialogDescription className={`text-center ${language === 'ar' ? 'font-arabic' : ''}`}>
            {language === 'ar' ? 
              'يرجى تسجيل الدخول للوصول إلى ميزات تحليل الصور الطبية' :
              'Please sign in to access medical image analysis features'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Button 
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            variant="outline" 
            className="w-full"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className={language === 'ar' ? 'font-arabic' : ''}>
              {language === 'ar' ? 'تسجيل الدخول بجوجل' : 'Continue with Google'}
            </span>
          </Button>

          <div className="relative">
            <Separator />
            <span className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-sm text-gray-500 ${language === 'ar' ? 'font-arabic' : ''}`}>
              {language === 'ar' ? 'أو' : 'or'}
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="name" className={language === 'ar' ? 'font-arabic' : ''}>
                  {language === 'ar' ? 'الاسم' : 'Name'}
                </Label>
                <div className="relative">
                  <User className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400`} />
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`${isRTL ? 'pr-10' : 'pl-10'}`}
                    placeholder={language === 'ar' ? 'أدخل اسمك' : 'Enter your name'}
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className={language === 'ar' ? 'font-arabic' : ''}>
                {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
              </Label>
              <div className="relative">
                <Mail className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400`} />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`${isRTL ? 'pr-10' : 'pl-10'}`}
                  placeholder={language === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className={language === 'ar' ? 'font-arabic' : ''}>
                {language === 'ar' ? 'كلمة المرور' : 'Password'}
              </Label>
              <div className="relative">
                <Lock className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400`} />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${isRTL ? 'pr-10' : 'pl-10'}`}
                  placeholder={language === 'ar' ? 'أدخل كلمة المرور' : 'Enter your password'}
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full medical-gradient text-white"
            >
              <span className={language === 'ar' ? 'font-arabic' : ''}>
                {isLoading ? 
                  (language === 'ar' ? 'جارٍ التحميل...' : 'Loading...') :
                  isSignUp ? 
                    (language === 'ar' ? 'إنشاء حساب' : 'Create Account') :
                    (language === 'ar' ? 'تسجيل الدخول' : 'Sign In')
                }
              </span>
            </Button>
          </form>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className={`text-sm text-blue-600 hover:underline ${language === 'ar' ? 'font-arabic' : ''}`}
            >
              {isSignUp ? 
                (language === 'ar' ? 'لديك حساب؟ تسجيل الدخول' : 'Already have an account? Sign In') :
                (language === 'ar' ? 'ليس لديك حساب؟ إنشاء حساب' : "Don't have an account? Sign Up")
              }
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SignInModal;
