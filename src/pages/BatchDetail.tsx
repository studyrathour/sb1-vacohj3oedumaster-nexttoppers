import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Archive, Calendar, Users, Folder } from 'lucide-react';
import FolderSystem from '../components/FolderSystem/FolderSystem';

const BatchDetail: React.FC = () => {
  const { batchId } = useParams<{ batchId: string }>();
  const navigate = useNavigate();
  const { batches } = useApp();

  const batch = batches.find(b => b.id === batchId);

  if (!batch) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Batch Not Found</h2>
          <p className="text-gray-400 mb-6">The requested batch could not be found.</p>
          <button
            onClick={() => navigate('/batches')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Back to Batches
          </button>
        </div>
      </div>
    );
  }

  const getBatchGradient = () => {
    return 'bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800';
  };

  const handleBack = () => {
    navigate('/batches');
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className={`${getBatchGradient()} text-white`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 text-white/80 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Batches</span>
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                {batch.internetArchive?.identifier ? (
                  <Archive className="h-8 w-8 text-white" />
                ) : (
                  <Folder className="h-8 w-8 text-white" />
                )}
                <h1 className="text-3xl font-bold">{batch.name}</h1>
              </div>
              <p className="text-white/80 mb-4">{batch.description}</p>
              
              {batch.internetArchive?.identifier && (
                <div className="flex items-center space-x-2 text-sm text-blue-200">
                  <Archive className="h-4 w-4" />
                  <span>Imported from Internet Archive</span>
                  <span>•</span>
                  <span>Last synced: {new Date(batch.internetArchive.lastSync).toLocaleDateString()}</span>
                </div>
              )}
              
              <div className="flex items-center space-x-6 text-sm text-white/70 mt-2">
                <div className="flex items-center space-x-1">
                  <Folder className="h-4 w-4" />
                  <span>{batch.folders?.length || 0} folders</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{batch.liveClasses?.length || 0} live classes</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Created: {new Date(batch.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Folder System */}
      <div className="py-8">
        {batch.folders && batch.folders.length > 0 ? (
          <FolderSystem
            folders={batch.folders}
            onBack={handleBack}
            showBackButton={true}
            batchId={batch.id}
            batchName={batch.name}
          />
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <Folder className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No Folders Available</h3>
              <p className="text-gray-500">Course materials will appear here once they are uploaded.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BatchDetail;