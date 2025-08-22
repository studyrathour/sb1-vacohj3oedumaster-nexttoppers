import React, { useState, useEffect } from 'react';
import { X, MessageCircle } from 'lucide-react';

const TelegramPopup: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Show popup after 2 seconds on every page load/reload
    const timer = setTimeout(() => {
      setIsVisible(true);
      setIsAnimating(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
    }, 300);
  };

  const handleJoinChannel = () => {
    window.open('https://t.me/EduMaster2008', '_blank');
    handleClose();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        className={`bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl max-w-md w-full border border-gray-700 transform transition-all duration-300 ${
          isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-2xl p-6 text-center">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="flex justify-center mb-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
              {/* Telegram Logo SVG */}
              <svg 
                className="h-12 w-12 text-white" 
                viewBox="0 0 24 24" 
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.13-.31-1.09-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
              </svg>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-2">Join Our Community!</h2>
          <p className="text-white/90 text-sm">Stay updated with the latest educational content</p>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-white mb-3">
              🎓 EduMaster Official Channel
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Get instant notifications about:
            </p>
            <ul className="text-gray-400 text-sm mt-3 space-y-1">
              <li>📚 New course materials</li>
              <li>🔴 Live class announcements</li>
              <li>📖 Latest book uploads</li>
              <li>💡 Study tips & resources</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleJoinChannel}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
            >
              <MessageCircle className="h-5 w-5" />
              <span>Join Telegram Channel</span>
            </button>
            
            <button
              onClick={handleClose}
              className="w-full bg-gray-700 text-gray-300 py-3 px-6 rounded-xl font-medium hover:bg-gray-600 hover:text-white transition-all duration-200"
            >
              Maybe Later
            </button>
          </div>

          {/* Footer */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Join our community for the latest updates!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TelegramPopup;