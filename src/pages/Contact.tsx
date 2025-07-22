import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useToast } from '../hooks/use-toast';
import { Mail, Building2, Clock, Globe, MessageSquare, User, AtSign, Tag, Type } from 'lucide-react';

const Contact = () => {
  const { language, t, isRTL } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    toast({
      title: t('success'),
      description: 'Your message has been sent!',
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <div className="relative py-16 bg-white overflow-hidden">
          <div className="hidden lg:block lg:absolute lg:inset-y-0 lg:h-full lg:w-1/2">
            <div className="relative h-full text-lg max-w-prose mx-auto">
              <svg
                className="absolute top-1/2 left-5 transform -translate-y-1/2 -translate-x-1/2 w-32 h-32 text-gray-200 opacity-50"
                fill="currentColor"
                viewBox="0 0 200 200"
                aria-hidden="true"
              >
                <path d="M38.8,130.7c-9.4,7.4-13.5,19-10.9,30.5c2.7,11.5,11.4,20.1,22.9,22.8c11.5,2.7,23.1-1.4,30.5-10.9l104.9-82.3 c9.4-7.4,13.5-19,10.9-30.5c-2.7-11.5-11.4-20.1-22.9-22.8c-11.5-2.7-23.1,1.4-30.5,10.9L38.8,130.7z" />
              </svg>
              <img
                className="relative mx-auto"
                src="https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                alt="Contact Image"
              />
            </div>
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:grid lg:grid-cols-2">
            <div className="lg:pr-8">
              <div className="max-w-md mx-auto sm:max-w-lg lg:mx-0">
                <h2 className={`text-3xl font-extrabold tracking-tight sm:text-4xl ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {t('contactTitle')}
                </h2>
                <p className={`mt-4 text-lg text-gray-500 sm:mt-3 ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {t('contactSubtitle')}
                </p>
                <dl className="mt-8 space-y-6">
                  <div className="flex">
                    <Mail className="flex-shrink-0 h-6 w-6 text-gray-400" aria-hidden="true" />
                    <div className="ml-3 text-base text-gray-500">
                      <dt className="sr-only">{t('emailSupport')}</dt>
                      <dd>
                        <p className={`font-semibold ${language === 'ar' ? 'font-arabic' : ''}`}>{t('emailSupport')}</p>
                        <p className={language === 'ar' ? 'font-arabic' : ''}>{t('emailSupportDesc')}</p>
                        <a href="mailto:support@example.com">support@example.com</a>
                      </dd>
                    </div>
                  </div>
                  <div className="flex">
                    <Building2 className="flex-shrink-0 h-6 w-6 text-gray-400" aria-hidden="true" />
                    <div className="ml-3 text-base text-gray-500">
                      <dt className="sr-only">{t('businessInquiries')}</dt>
                      <dd>
                        <p className={`font-semibold ${language === 'ar' ? 'font-arabic' : ''}`}>{t('businessInquiries')}</p>
                        <p className={language === 'ar' ? 'font-arabic' : ''}>{t('businessInquiriesDesc')}</p>
                        <a href="mailto:sales@example.com">sales@example.com</a>
                      </dd>
                    </div>
                  </div>
                  <div className="flex">
                    <Clock className="flex-shrink-0 h-6 w-6 text-gray-400" aria-hidden="true" />
                    <div className="ml-3 text-base text-gray-500">
                      <dt className="sr-only">{t('responseTime')}</dt>
                      <dd>
                        <p className={`font-semibold ${language === 'ar' ? 'font-arabic' : ''}`}>{t('responseTime')}</p>
                        <p className={language === 'ar' ? 'font-arabic' : ''}>{t('responseTimeDesc')}</p>
                        <ul className="list-disc pl-5">
                          {t('responseTimeList').split('\n').map((item, index) => (
                            <li key={index} className={language === 'ar' ? 'font-arabic' : ''}>{item}</li>
                          ))}
                        </ul>
                      </dd>
                    </div>
                  </div>
                  <div className="flex">
                    <Globe className="flex-shrink-0 h-6 w-6 text-gray-400" aria-hidden="true" />
                    <div className="ml-3 text-base text-gray-500">
                      <dt className="sr-only">{t('globalReach')}</dt>
                      <dd>
                        <p className={`font-semibold ${language === 'ar' ? 'font-arabic' : ''}`}>{t('globalReach')}</p>
                        <p className={language === 'ar' ? 'font-arabic' : ''}>{t('globalReachDesc')}</p>
                      </dd>
                    </div>
                  </div>
                </dl>
              </div>
            </div>
            <div className="mt-12 sm:mt-16 lg:mt-0">
              <h3 className={`text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl ${language === 'ar' ? 'font-arabic' : ''}`}>
                {t('sendMessage')}
              </h3>
              <form onSubmit={handleSubmit} className="mt-9 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
                <div>
                  <label htmlFor="full-name" className={`block text-sm font-medium text-gray-700 ${language === 'ar' ? 'font-arabic' : ''}`}>
                    {t('fullName')}
                  </label>
                  <div className="mt-1">
                    <Input type="text" id="full-name" required />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className={`block text-sm font-medium text-gray-700 ${language === 'ar' ? 'font-arabic' : ''}`}>
                    {t('emailAddress')}
                  </label>
                  <div className="mt-1">
                    <Input id="email" type="email" required />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="category" className={`block text-sm font-medium text-gray-700 ${language === 'ar' ? 'font-arabic' : ''}`}>
                    {t('category')}
                  </label>
                  <div className="mt-1">
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t('category')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technical">{t('emailSupport')}</SelectItem>
                        <SelectItem value="business">{t('businessInquiries')}</SelectItem>
                        <SelectItem value="general">General Inquiry</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="subject" className={`block text-sm font-medium text-gray-700 ${language === 'ar' ? 'font-arabic' : ''}`}>
                    {t('subject')}
                  </label>
                  <div className="mt-1">
                    <Input type="text" id="subject" required />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <div className="flex justify-between">
                    <label htmlFor="message" className={`block text-sm font-medium text-gray-700 ${language === 'ar' ? 'font-arabic' : ''}`}>
                      {t('message')}
                    </label>
                    <span className="text-sm text-gray-500" id="message-max">
                      Max. 500 characters
                    </span>
                  </div>
                  <div className="mt-1">
                    <Textarea id="message" rows={4} maxLength={500} aria-describedby="message-max" required />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? t('loading') : t('sendMessageBtn')}
                  </Button>
                </div>
              </form>
              <p className={`mt-3 text-sm text-gray-500 ${language === 'ar' ? 'font-arabic' : ''}`}>
                {t('urgentNote')}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className={`text-3xl font-extrabold text-gray-900 text-center mb-8 ${language === 'ar' ? 'font-arabic' : ''}`}>
              {t('faq')}
            </h2>
            <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white rounded-lg shadow-md p-5">
                <h3 className={`text-lg font-semibold text-gray-900 ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {t('faqAccuracy')}
                </h3>
                <p className={`mt-2 text-sm text-gray-700 ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {t('faqAccuracyAnswer')}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-5">
                <h3 className={`text-lg font-semibold text-gray-900 ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {t('faqSecurity')}
                </h3>
                <p className={`mt-2 text-sm text-gray-700 ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {t('faqSecurityAnswer')}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-5">
                <h3 className={`text-lg font-semibold text-gray-900 ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {t('faqTraining')}
                </h3>
                <p className={`mt-2 text-sm text-gray-700 ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {t('faqTrainingAnswer')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
