import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Folder, Calendar, Video, FileText } from 'lucide-react';
import FolderSystem from '../components/FolderSystem/FolderSystem';

const FolderDetail: React.FC = () => {
  const { batchId, folderId } = useParams<{ batchId: string; folderId: string }>();
  const navigate = useNavigate();
  const { batches } = useApp();

  const batch = batches.find(b => b.id === batchId);
  
  // Find the folder recursively
  const findFolder = (folders: any[], targetId: string): any => {
    for (const folder of folders) {
      if (folder.id === targetId) {
        return folder;
      }
      if (folder.subFolders && folder.subFolders.length > 0) {
        const found = findFolder(folder.subFolders, targetId);
        if (found) return found;
      }
    }
    return null;
  };

  const folder = batch ? findFolder(batch.folders || [], folderId || '') : null;

  if (!batch || !folder) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Folder Not Found</h2>
          <p className="text-gray-400 mb-6">The requested folder could not be found.</p>
          <button
            onClick={() => navigate(`/batch/${batchId}`)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Back to Batch
          </button>
        </div>
      </div>
    );
  };

  const getBatchGradient = () => {
    return 'bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800';
  };

  const handleBack = () => {
    navigate(`/batch/${batchId}`);
  };

  const getContentByType = (content: any[], type: 'video' | 'pdf' | 'document') => {
    return content.filter(item => item.type === type);
  };
  
  const getPlayerTypeCount = (content: any[], playerType: 'internal' | 'edumaster2') => {
    return content.filter(item => 
      item.type === 'video' && 
      (item.playerType || 'internal') === playerType
    ).length;
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
            <span>Back to {batch.name}</span>
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <Folder className="h-8 w-8 text-white" />
                <h1 className="text-3xl font-bold">{folder.name}</h1>
              </div>
              
              <div className="flex items-center space-x-6 text-sm text-white/70">
                <div className="flex items-center space-x-1">
                  <Video className="h-4 w-4" />
                  <span>
                    {getContentByType(folder.content || [], 'video').length} videos
                    {getPlayerTypeCount(folder.content || [], 'edumaster2') > 0 && (
                      <span className="ml-1 text-purple-300">
                        ({getPlayerTypeCount(folder.content || [], 'edumaster2')} Player 2)
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <FileText className="h-4 w-4" />
                  <span>{getContentByType(folder.content || [], 'pdf').length + getContentByType(folder.content || [], 'document').length} documents</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Created: {new Date(folder.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Folder System - Show this folder as root */}
      <div className="py-8">
        <FolderSystem
          folders={[folder]} // Pass the current folder as the root
          onBack={handleBack}
          showBackButton={true}
          batchId={batch.id}
          batchName={folder.name}
        />
      </div>
    </div>
  );
};

export default FolderDetail;