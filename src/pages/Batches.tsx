import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { BookOpen, Archive, ChevronRight } from 'lucide-react';

const Batches: React.FC = () => {
  const { batches } = useApp();

  const getBatchGradient = (index: number) => {
    const gradients = [
      'bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800',
      'bg-gradient-to-br from-green-600 via-teal-600 to-green-800',
      'bg-gradient-to-br from-purple-600 via-pink-600 to-purple-800',
      'bg-gradient-to-br from-orange-600 via-red-600 to-orange-800',
      'bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-800'
    ];
    return gradients[index % gradients.length];
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Course Batches</h1>
              <p className="text-white/80">Explore and access all available course materials</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Batches List */}
        {batches.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No Batches Available</h3>
            <p className="text-gray-500 mb-6">Course batches will appear here once they are created.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {batches.map((batch, index) => (
              <div
                key={batch.id}
                className="group bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-700 relative"
              >
                <Link to={`/batch/${batch.id}`} className="block w-full h-full">
                  <div className={`h-32 ${getBatchGradient(index)} flex items-center justify-center relative`}>
                    {batch.thumbnail ? (
                      <div className="absolute inset-0">
                        <img
                          src={batch.thumbnail}
                          alt={batch.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              const icon = document.createElement('div');
                              icon.className = 'flex items-center justify-center h-full w-full';
                              icon.innerHTML = batch.internetArchive?.identifier 
                                ? '<svg class="h-12 w-12 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M3 3h18v18H3V3zm16 16V5H5v14h14z"/><path d="M7 7h10v2H7V7zm0 4h10v2H7v-2zm0 4h7v2H7v-2z"/></svg>'
                                : '<svg class="h-12 w-12 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/></svg>';
                              parent.appendChild(icon);
                            }
                          }}
                        />
                        <div className="absolute inset-0 bg-black/20"></div>
                      </div>
                    ) : batch.internetArchive?.identifier ? (
                      <Archive className="h-12 w-12 text-white" />
                    ) : (
                      <BookOpen className="h-12 w-12 text-white" />
                    )}
                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-bold">
                      {batch.folders?.length || 0} Folders
                    </div>
                    {batch.internetArchive?.identifier && (
                      <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-medium">
                        Internet Archive
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                      {batch.name}
                    </h3>
                    <p className="text-gray-400 mb-4 line-clamp-2">{batch.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        {batch.liveClasses?.length || 0} Live Classes
                      </span>
                      <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Batches;