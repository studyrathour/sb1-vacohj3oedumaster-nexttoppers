import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Users, Video, BookOpen, Zap, Trophy } from 'lucide-react';

const Home: React.FC = () => {
  const { batches, liveClasses, books, goLiveSessions } = useApp();

  const activeLiveSessions = goLiveSessions.filter(session => session.isActive);
  const liveLiveClasses = liveClasses.filter(lc => lc.isLive);

  const stats = [
    { label: 'Total Batches', value: batches.length, icon: Users, color: 'from-blue-600 to-blue-700' },
    { label: 'Live Classes', value: liveLiveClasses.length, icon: Video, color: 'from-red-600 to-red-700' },
    { label: 'Books Available', value: books.length, icon: BookOpen, color: 'from-green-600 to-green-700' },
    { label: 'Active Sessions', value: activeLiveSessions.length, icon: Zap, color: 'from-purple-600 to-purple-700' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Welcome to <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">EduMaster</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Your comprehensive educational platform for live classes, course materials, and interactive learning experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/batches"
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Explore Batches
            </Link>
            <Link
              to="/live-classes"
              className="bg-gray-800 text-white px-8 py-3 rounded-lg font-semibold border-2 border-blue-600 hover:bg-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Join Live Classes
            </Link>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-gray-800 rounded-xl shadow-xl p-6 hover:shadow-2xl transition-all duration-200 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-gray-400">{stat.label}</p>
                  </div>
                  <div className={`bg-gradient-to-br ${stat.color} p-3 rounded-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Access */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Link
            to="/batches"
            className="bg-gray-800 rounded-xl shadow-xl p-8 hover:shadow-2xl transition-all duration-200 group border border-gray-700 hover:border-blue-500"
          >
            <Users className="h-12 w-12 text-blue-500 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-semibold text-white mb-2">Browse Batches</h3>
            <p className="text-gray-400">Explore all available courses and educational content organized by batches.</p>
          </Link>

          <Link
            to="/live-classes"
            className="bg-gray-800 rounded-xl shadow-xl p-8 hover:shadow-2xl transition-all duration-200 group border border-gray-700 hover:border-red-500"
          >
            <Video className="h-12 w-12 text-red-500 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-semibold text-white mb-2">Live Classes</h3>
            <p className="text-gray-400">Join interactive live sessions and connect with instructors in real-time.</p>
          </Link>

          <Link
            to="/books"
            className="bg-gray-800 rounded-xl shadow-xl p-8 hover:shadow-2xl transition-all duration-200 group border border-gray-700 hover:border-green-500"
          >
            <BookOpen className="h-12 w-12 text-green-500 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-semibold text-white mb-2">Digital Library</h3>
            <p className="text-gray-400">Access a vast collection of educational books and reading materials.</p>
          </Link>

          <Link
            to="/next-toppers"
            className="bg-gray-800 rounded-xl shadow-xl p-8 hover:shadow-2xl transition-all duration-200 group border border-gray-700 hover:border-yellow-500"
          >
            <Trophy className="h-12 w-12 text-yellow-500 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-semibold text-white mb-2">Next Toppers</h3>
            <p className="text-gray-400">Elite coaching programs designed for future toppers and achievers.</p>
          </Link>
        </div>

        {/* Live Now Section */}
        {(liveLiveClasses.length > 0 || activeLiveSessions.length > 0) && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">🔴 Live Now</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {liveLiveClasses.map((liveClass) => (
                <div key={liveClass.id} className="bg-gray-800 rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-200 border border-gray-700">
                  <div className="h-48 bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center relative">
                    <Video className="h-16 w-16 text-white" />
                    <div className="absolute top-4 right-4 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse-red">
                      LIVE
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-2">{liveClass.title}</h3>
                    <p className="text-gray-400 mb-4">{liveClass.description}</p>
                    <Link
                      to={`/live-classes/${liveClass.id}`}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Join Live
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;