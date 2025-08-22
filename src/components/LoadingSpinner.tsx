import React from 'react';
import { BookOpen, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { useApp } from '../context/AppContext';

const LoadingSpinner: React.FC = () => {
  const { error, retryConnection } = useApp();

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="relative mb-8">
            <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto">
              <WifiOff className="h-8 w-8 text-red-500" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-4">Connection Error</h2>
          <p className="text-gray-400 mb-6 leading-relaxed">{error}</p>
          
          <div className="space-y-4">
            <button
              onClick={retryConnection}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <RefreshCw className="h-5 w-5" />
              <span>Retry Connection</span>
            </button>
            
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gray-700 text-gray-300 px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
            >
              Reload Page
            </button>
          </div>
          
          <div className="mt-8 p-4 bg-gray-800 rounded-lg border border-gray-700">
            <h3 className="text-white font-semibold mb-2">Troubleshooting:</h3>
            <ul className="text-gray-400 text-sm space-y-1 text-left">
              <li>• Check your internet connection</li>
              <li>• Disable VPN if active</li>
              <li>• Clear browser cache and cookies</li>
              <li>• Try refreshing the page</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-8">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <BookOpen className="h-6 w-6 text-blue-500" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-2">Loading EduMaster</h2>
        <p className="text-gray-400 mb-6">Initializing application...</p>
        
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Wifi className="h-4 w-4 text-blue-500" />
          <span className="text-gray-500 text-sm">Loading resources</span>
        </div>
        
        <div className="flex justify-center space-x-1">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
        
        <div className="mt-8 text-xs text-gray-600">
          <p>If this takes too long, please check your internet connection</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;