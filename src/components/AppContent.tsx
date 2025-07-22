
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import WelcomeScreen from './WelcomeScreen';
import AuthModal from './AuthModal';
import Index from '../pages/Index';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [showWelcome, setShowWelcome] = useState(true);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    // If user is already authenticated, skip welcome screen
    if (user && !loading) {
      setShowWelcome(false);
      setShowAuth(false);
    }
  }, [user, loading]);

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
    // Always go to main app after welcome, regardless of auth status
  };

  const handleAuthClose = () => {
    setShowAuth(false);
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl shadow-2xl mb-4 relative overflow-hidden">
            <img 
              src="/IMG_5657.jpeg.jpg" 
              alt="MedDx Logo" 
              className="w-12 h-12 object-contain rounded-lg"
            />
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  // Show welcome screen first
  if (showWelcome) {
    return <WelcomeScreen onComplete={handleWelcomeComplete} />;
  }

  // Always show main app after welcome (auth will be handled within the app)
  return <Index />;
};

export default AppContent;
