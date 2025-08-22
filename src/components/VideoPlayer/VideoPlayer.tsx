import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, Settings, MessageCircle, X, SkipBack, SkipForward, RotateCcw, RotateCw } from 'lucide-react';

interface VideoPlayerProps {
  src: string;
  title: string;
  type: 'lecture' | 'live';
  showChat?: boolean;
  onClose?: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  src, 
  title, 
  type, 
  showChat = false,
  onClose 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState('Auto');
  const [chatVisible, setChatVisible] = useState(showChat);
  const [chatMessages, setChatMessages] = useState<Array<{id: string, user: string, message: string, time: string}>>([
    { id: '1', user: 'Instructor', message: 'Welcome to the live class!', time: '10:00' },
    { id: '2', user: 'Student1', message: 'Thank you for the session', time: '10:01' },
    { id: '3', user: 'Student2', message: 'Great explanation!', time: '10:02' },
  ]);
  const [newMessage, setNewMessage] = useState('');

  let controlsTimeout: NodeJS.Timeout;

  const qualities = ['Auto', '1080p', '720p', '480p', '360p'];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setIsLoading(false);
      setError(null);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    const handleError = (e: any) => {
      console.error('Video error:', e);
      setIsLoading(false);
      setError('Failed to load video. Please check the URL or try again.');
    };

    const handleLoadStart = () => {
      setIsLoading(true);
      setError(null);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
      setError(null);
    };

    const handleWaiting = () => {
      setIsLoading(true);
    };

    const handlePlaying = () => {
      setIsLoading(false);
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('error', handleError);
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('pause', handlePause);

    // Set video source
    if (src) {
      video.src = src;
      video.load();
    }

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('error', handleError);
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('pause', handlePause);
    };
  }, [src]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!videoRef.current) return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          skipBackward();
          break;
        case 'ArrowRight':
          e.preventDefault();
          skipForward();
          break;
        case 'ArrowUp':
          e.preventDefault();
          changeVolume(0.1);
          break;
        case 'ArrowDown':
          e.preventDefault();
          changeVolume(-0.1);
          break;
        case 'KeyM':
          e.preventDefault();
          toggleMute();
          break;
        case 'KeyF':
          e.preventDefault();
          toggleFullscreen();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const togglePlay = async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      if (isPlaying) {
        await video.pause();
      } else {
        await video.play();
      }
    } catch (error) {
      console.error('Error toggling play:', error);
      setError('Unable to play video. Please try again.');
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = parseFloat(e.target.value);
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const changeVolume = (delta: number) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = Math.max(0, Math.min(1, volume + delta));
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = parseFloat(e.target.value);
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isMuted) {
      video.volume = volume > 0 ? volume : 0.5;
      setIsMuted(false);
    } else {
      video.volume = 0;
      setIsMuted(true);
    }
  };

  const skipBackward = () => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = Math.max(0, video.currentTime - 10);
  };

  const skipForward = () => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = Math.min(video.duration, video.currentTime + 10);
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!isFullscreen) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if ((container as any).webkitRequestFullscreen) {
        (container as any).webkitRequestFullscreen();
      } else if ((container as any).msRequestFullscreen) {
        (container as any).msRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    clearTimeout(controlsTimeout);
    controlsTimeout = setTimeout(() => {
      if (isPlaying && !showVolumeSlider && !showQualityMenu) {
        setShowControls(false);
      }
    }, 3000);
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now().toString(),
        user: 'You',
        message: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages([...chatMessages, message]);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const getProgressPercentage = () => {
    if (!duration) return 0;
    return (currentTime / duration) * 100;
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex">
      <div 
        ref={containerRef}
        className={`relative ${chatVisible && showChat ? 'flex-1' : 'w-full'} bg-black flex flex-col`}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setShowControls(true)}
      >
        {/* Header */}
        <div className={`absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/80 to-transparent p-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Play className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-white font-bold text-lg">EduMaster Video Player</h1>
                <p className="text-gray-300 text-sm">{title}</p>
              </div>
              {type === 'live' && (
                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                  🔴 LIVE
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {showChat && (
                <button
                  onClick={() => setChatVisible(!chatVisible)}
                  className="bg-gray-800/80 text-white p-2 rounded-lg hover:bg-gray-700/80 transition-colors"
                >
                  <MessageCircle className="h-5 w-5" />
                </button>
              )}
              <button
                onClick={onClose}
                className="bg-gray-800/80 text-white p-2 rounded-lg hover:bg-gray-700/80 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Video Container */}
        <div className="flex-1 flex items-center justify-center relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-white">Loading EduMaster Player...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
              <div className="text-center max-w-md">
                <div className="bg-red-600 p-4 rounded-full mb-4 inline-block">
                  <X className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-white text-xl font-bold mb-2">Video Error</h3>
                <p className="text-gray-300 mb-4">{error}</p>
                <button
                  onClick={() => {
                    setError(null);
                    if (videoRef.current) {
                      videoRef.current.load();
                    }
                  }}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          )}
          
          <video
            ref={videoRef}
            className="w-full h-full object-contain"
            onClick={togglePlay}
            preload="metadata"
            crossOrigin="anonymous"
          />

          {/* Play/Pause Overlay */}
          {!isPlaying && !isLoading && !error && (
            <div 
              className="absolute inset-0 flex items-center justify-center cursor-pointer z-10"
              onClick={togglePlay}
            >
              <div className="bg-black/50 backdrop-blur-sm rounded-full p-6 hover:bg-black/70 transition-colors">
                <Play className="h-16 w-16 text-white" />
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className={`absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/90 to-transparent p-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="relative">
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer progress-slider"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${getProgressPercentage()}%, #4b5563 ${getProgressPercentage()}%, #4b5563 100%)`
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-300 mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors"
                disabled={!!error}
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </button>

              {/* Skip Backward 10s */}
              <button
                onClick={skipBackward}
                className="text-white hover:text-blue-400 transition-colors p-2 rounded-lg hover:bg-gray-800/50"
                title="Skip backward 10 seconds"
                disabled={!!error}
              >
                <RotateCcw className="h-5 w-5" />
                <span className="text-xs absolute -bottom-1 left-1/2 transform -translate-x-1/2">10</span>
              </button>

              {/* Skip Forward 10s */}
              <button
                onClick={skipForward}
                className="text-white hover:text-blue-400 transition-colors p-2 rounded-lg hover:bg-gray-800/50"
                title="Skip forward 10 seconds"
                disabled={!!error}
              >
                <RotateCw className="h-5 w-5" />
                <span className="text-xs absolute -bottom-1 left-1/2 transform -translate-x-1/2">10</span>
              </button>

              {/* Volume Control */}
              <div className="relative flex items-center space-x-2">
                <button
                  onClick={toggleMute}
                  onMouseEnter={() => setShowVolumeSlider(true)}
                  className="text-white hover:text-blue-400 transition-colors"
                >
                  {isMuted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </button>
                
                {/* Volume Slider */}
                <div 
                  className={`transition-all duration-200 ${showVolumeSlider ? 'w-20 opacity-100' : 'w-0 opacity-0'}`}
                  onMouseEnter={() => setShowVolumeSlider(true)}
                  onMouseLeave={() => setShowVolumeSlider(false)}
                >
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer volume-slider"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* Quality Settings */}
              <div className="relative">
                <button
                  onClick={() => setShowQualityMenu(!showQualityMenu)}
                  className="text-white hover:text-blue-400 transition-colors flex items-center space-x-1"
                >
                  <Settings className="h-5 w-5" />
                  <span className="text-sm">{selectedQuality}</span>
                </button>
                
                {showQualityMenu && (
                  <div className="absolute bottom-full right-0 mb-2 bg-gray-800 rounded-lg shadow-xl border border-gray-600 py-2 min-w-[100px]">
                    {qualities.map((quality) => (
                      <button
                        key={quality}
                        onClick={() => {
                          setSelectedQuality(quality);
                          setShowQualityMenu(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-700 transition-colors ${
                          selectedQuality === quality ? 'text-blue-400' : 'text-white'
                        }`}
                      >
                        {quality}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="text-white hover:text-blue-400 transition-colors"
              >
                {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* EduMaster Watermark */}
        <div className="absolute bottom-20 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-sm font-medium">
          EduMaster Player
        </div>
      </div>

      {/* Live Chat */}
      {chatVisible && showChat && (
        <div className="w-80 bg-gray-900 border-l border-gray-700 flex flex-col">
          {/* Chat Header */}
          <div className="bg-gray-800 p-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold">Live Chat</h3>
              <button
                onClick={() => setChatVisible(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {type === 'live' && (
              <p className="text-gray-400 text-sm mt-1">
                {chatMessages.length} participants
              </p>
            )}
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMessages.map((msg) => (
              <div key={msg.id} className="bg-gray-800 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-blue-400 font-medium text-sm">{msg.user}</span>
                  <span className="text-gray-500 text-xs">{msg.time}</span>
                </div>
                <p className="text-gray-300 text-sm">{msg.message}</p>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-gray-700">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="flex-1 bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-sm"
              />
              <button
                onClick={sendMessage}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .progress-slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        
        .progress-slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        .volume-slider::-webkit-slider-thumb {
          appearance: none;
          height: 12px;
          width: 12px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 1px solid #ffffff;
        }
        
        .volume-slider::-moz-range-thumb {
          height: 12px;
          width: 12px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 1px solid #ffffff;
        }
      `}</style>
    </div>
  );
};

export default VideoPlayer;