import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Video, Calendar, Users, Radio, Play, ExternalLink, Globe, Monitor, Clock, Zap } from 'lucide-react';
import ThumbnailImage from '../components/ThumbnailImage';
import VideoPlayerModal from '../components/VideoPlayer/VideoPlayerModal';
import CountdownTimer from '../components/LiveClass/CountdownTimer';

const LiveClasses: React.FC = () => {
  const { liveClasses, batches, goLiveSessions } = useApp();
  const [activeTab, setActiveTab] = useState<'live' | 'upcoming'>('live');
  
  const [videoPlayer, setVideoPlayer] = React.useState<{
    isOpen: boolean;
    url: string;
    title: string;
    type: 'lecture' | 'live';
  }>({
    isOpen: false,
    url: '',
    title: '',
    type: 'live'
  });

  const activeLiveSessions = goLiveSessions.filter(session => session.isActive);
  const liveLiveClasses = liveClasses.filter(lc => lc.isLive);
  const scheduledLiveClasses = liveClasses.filter(lc => !lc.isLive);

  const getBatchName = (batchId: string) => {
    const batch = batches.find(b => b.id === batchId);
    return batch?.name || 'Unknown Batch';
  };

  const handleJoinLive = (item: any) => {
    if (item.playerType === 'external' && item.externalMeetingLink) {
      window.open(item.externalMeetingLink, '_blank');
    } else if (item.streamUrl) {
      const finalUrl = `https://edumastervideoplarerwatch.netlify.app/live/${encodeURIComponent(item.streamUrl)}`;
      window.open(finalUrl, '_blank');
    } else {
      // Fallback to external live class URL
      window.open('https://edumasterliveclasses.netlify.app/?video=https%3A%2F%2Fbitdash-a.akamaihd.net%2Fcontent%2Fsintel%2Fhls%2Fplaylist.m3u8&source=edumaster&player=EduMaster%20Video%20Player&chat=true&type=live', '_blank');
    }
  };

  const closeVideoPlayer = () => {
    setVideoPlayer({
      isOpen: false,
      url: '',
      title: '',
      type: 'live'
    });
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Live Classes</h1>
          <p className="text-gray-400">Join live sessions, screen shares, and interactive classes</p>
          
          {/* Tab Navigation */}
          <div className="flex space-x-2 mt-6">
            <button
              onClick={() => setActiveTab('live')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 border-2 ${
                activeTab === 'live'
                  ? 'bg-red-600 border-red-600 text-white shadow-lg shadow-red-600/30'
                  : 'bg-gray-800 border-gray-600 text-gray-300 hover:border-gray-500 hover:bg-gray-700'
              }`}
            >
              🔴 Live Now
            </button>
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 border-2 ${
                activeTab === 'upcoming'
                  ? 'bg-red-600 border-red-600 text-white shadow-lg shadow-red-600/30'
                  : 'bg-gray-800 border-gray-600 text-gray-300 hover:border-gray-500 hover:bg-gray-700'
              }`}
            >
              📅 Upcoming
            </button>
          </div>
        </div>

        {/* Video Player Modal */}
        <VideoPlayerModal
          isOpen={videoPlayer.isOpen}
          onClose={closeVideoPlayer}
          videoUrl={videoPlayer.url}
          title={videoPlayer.title}
          type={videoPlayer.type}
          showChat={true}
        />

        {/* Tab Content */}
        {activeTab === 'live' && (
          <div className="space-y-8">
            {/* Active Live Sessions (Screen Shares) */}
            {activeLiveSessions.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <Radio className="h-6 w-6 text-blue-500 mr-2" />
                  🔴 Live Sessions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeLiveSessions.map((session) => (
                    <div 
                      key={session.id} 
                      className="bg-gray-800 rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-200 border-2 border-red-600 relative group"
                    >
                      <div className="h-48 bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center relative">
                        <Radio className="h-16 w-16 text-white" />
                        <div className="absolute top-4 right-4 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse-red">
                          LIVE
                        </div>
                        {session.playerType === 'external' && (
                          <div className="absolute bottom-4 left-4 bg-green-600 text-white px-2 py-1 rounded text-xs font-medium">
                            External Meeting
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold text-white mb-2">{session.title}</h3>
                        <p className="text-gray-400 mb-4">Batch: {getBatchName(session.batchId)}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">
                            Started: {new Date(session.startTime).toLocaleTimeString()}
                          </span>
                          <button
                            onClick={() => handleJoinLive(session)}
                            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center space-x-2 shadow-lg"
                          >
                            {session.playerType === 'external' ? (
                              <>
                                <ExternalLink className="h-4 w-4" />
                                <span>Join Meeting</span>
                              </>
                            ) : (
                              <>
                                <Play className="h-4 w-4" />
                                <span>Join Session</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Live Classes */}
            {liveLiveClasses.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <Video className="h-6 w-6 text-blue-500 mr-2" />
                  Active Live Classes
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {liveLiveClasses.map((liveClass) => (
                    <div 
                      key={liveClass.id} 
                      className="bg-gray-800 rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-200 border-2 border-blue-600 relative group"
                    >
                      <div className="h-48 relative">
                        <ThumbnailImage
                          src={liveClass.thumbnail}
                          alt={liveClass.title}
                          type="live"
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute top-4 right-4 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse-red">
                          LIVE
                        </div>
                        {liveClass.thumbnail && (
                          <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-medium">
                            EduMaster Player
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold text-white mb-2">{liveClass.title}</h3>
                        <p className="text-gray-400 mb-2">{liveClass.description}</p>
                        <div className="flex items-center text-sm text-gray-500 mb-4">
                          <Users className="h-4 w-4 mr-1" />
                          <span>Batch: {getBatchName(liveClass.batchId)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">
                            {new Date(liveClass.scheduledAt).toLocaleString()}
                          </span>
                          <button
                            onClick={() => handleJoinLive(liveClass)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2"
                          >
                            <Play className="h-4 w-4" />
                            <span>Join Live</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State for Live Tab */}
            {liveLiveClasses.length === 0 && activeLiveSessions.length === 0 && (
              <div className="text-center py-12">
                <Video className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Live Classes Active</h3>
               <p className="text-gray-400">Live classes and sessions will appear here when they are active.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'upcoming' && (
          <div className="space-y-8">
            {/* Scheduled Classes */}
            {scheduledLiveClasses.length > 0 ? (
              <div>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <Calendar className="h-6 w-6 text-green-500 mr-2" />
                  Scheduled Classes
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {scheduledLiveClasses.map((liveClass) => (
                   <div 
                     key={liveClass.id} 
                     className="bg-gray-800 rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-200 border border-gray-700 relative group"
                   >
                      <div className="h-48 relative">
                        <ThumbnailImage
                          src={liveClass.thumbnail}
                          alt={liveClass.title}
                          type="live"
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute top-4 right-4 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                          SCHEDULED
                        </div>
                        {liveClass.playerType === 'external' && (
                          <div className="absolute bottom-4 left-4 bg-green-600 text-white px-2 py-1 rounded text-xs font-medium">
                            External Meeting
                          </div>
                        )}
                        {liveClass.urlToBeAdded && (
                          <div className="absolute bottom-4 right-4 bg-yellow-600 text-white px-2 py-1 rounded text-xs font-medium">
                            URL Pending
                          </div>
                        )}
                        {liveClass.thumbnail && (
                          <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-medium">
                            EduMaster Player
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold text-white mb-2">{liveClass.title}</h3>
                        <p className="text-gray-400 mb-2">{liveClass.description}</p>
                        <div className="flex items-center text-sm text-gray-500 mb-4">
                          <Users className="h-4 w-4 mr-1" />
                          <span>Batch: {getBatchName(liveClass.batchId)}</span>
                        </div>
                        
                        {/* Countdown Timer */}
                        <CountdownTimer liveClass={liveClass} />
                        
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-gray-500">
                            <div>{new Date(liveClass.scheduledAt).toLocaleString()}</div>
                            {liveClass.endTime && (
                              <div className="text-xs">End: {new Date(liveClass.endTime).toLocaleString()}</div>
                            )}
                          </div>
                          <div className="flex items-center space-x-1">
                            {liveClass.playerType === 'external' ? (
                              <Globe className="h-4 w-4 text-green-400" />
                            ) : (
                              <Monitor className="h-4 w-4 text-blue-400" />
                            )}
                            <span className="text-xs text-gray-400">
                              {liveClass.playerType === 'external' ? 'External' : 'Player'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Upcoming Classes</h3>
                <p className="text-gray-400">Scheduled classes will appear here when they are created.</p>
              </div>
            )}
          </div>
        )}

        {/* Info Section */}
        <div className="mt-12 bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">How to Join Live Sessions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Radio className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="text-white font-semibold mb-1">Live Sessions</h4>
                <p className="text-gray-400 text-sm">
                  Join live sessions with interactive content and real-time communication with instructors.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Video className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="text-white font-semibold mb-1">Video Classes</h4>
                <p className="text-gray-400 text-sm">
                  Pre-recorded or live video content played through the EduMaster Video Player 
                  with interactive chat and quality controls.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveClasses;