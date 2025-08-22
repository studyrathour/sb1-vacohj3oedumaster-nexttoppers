import React, { useState, useEffect } from 'react';
import { ArrowLeft, Folder, FolderOpen, FileText, Video, Play, Download, Calendar } from 'lucide-react';
import { Folder as FolderType, Content } from '../../types';
import VideoPlayerModal from '../VideoPlayer/VideoPlayerModal';

interface FolderSystemProps {
  folders: FolderType[];
  onBack?: () => void;
  showBackButton?: boolean;
  batchId: string;
  batchName: string;
}

interface FolderLevel {
  folders: FolderType[];
  content: Content[];
  title: string;
  parentId?: string;
}

const FolderSystem: React.FC<FolderSystemProps> = ({
  folders,
  onBack,
  showBackButton = false,
  batchId,
  batchName
}) => {
  const [folderLevels, setFolderLevels] = useState<FolderLevel[]>([]);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [videoPlayer, setVideoPlayer] = useState<{
    isOpen: boolean;
    url: string;
    title: string;
    type: 'lecture' | 'live';
  }>({
    isOpen: false,
    url: '',
    title: '',
    type: 'lecture'
  });

  // Initialize with root level
  useEffect(() => {
    const rootLevel: FolderLevel = {
      folders: folders,
      content: [],
      title: `${batchName} (Home)`
    };
    setFolderLevels([rootLevel]);
    setCurrentLevelIndex(0);
  }, [folders, batchName]);

  const handleFolderClick = (folder: FolderType) => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    
    const newLevel: FolderLevel = {
      folders: folder.subFolders || [],
      content: folder.content || [],
      title: folder.name,
      parentId: folder.id
    };

    // Add new level and navigate to it
    const newLevels = [...folderLevels.slice(0, currentLevelIndex + 1), newLevel];
    setFolderLevels(newLevels);
    
    setTimeout(() => {
      setCurrentLevelIndex(currentLevelIndex + 1);
      setIsTransitioning(false);
    }, 100);
  };

  const handleBackClick = () => {
    if (isTransitioning) return;
    
    if (currentLevelIndex === 0) {
      // At root level, call parent back function
      onBack?.();
      return;
    }
    
    setIsTransitioning(true);
    
    setTimeout(() => {
      setCurrentLevelIndex(currentLevelIndex - 1);
      setIsTransitioning(false);
    }, 100);
  };

  const handleContentClick = (content: Content) => {
    if (content.type === 'video') {
      // Check if it's EduMaster Player 2
      if (content.playerType === 'edumaster2') {
        // Open in new tab for external player
        window.open(content.url, '_blank');
      } else {
        // Use internal video player
        setVideoPlayer({
          isOpen: true,
          url: content.url,
          title: content.name,
          type: 'lecture'
        });
      }
    } else {
      window.open(content.url, '_blank');
    }
  };

  const closeVideoPlayer = () => {
    setVideoPlayer({
      isOpen: false,
      url: '',
      title: '',
      type: 'lecture'
    });
  };

  const getItemIcon = (item: FolderType | Content) => {
    if ('type' in item) {
      // It's content
      switch (item.type) {
        case 'video':
          return <Video className="h-12 w-12 text-blue-500" />;
        case 'pdf':
          return <FileText className="h-12 w-12 text-red-500" />;
        default:
          return <FileText className="h-12 w-12 text-gray-500" />;
      }
    } else {
      // It's a folder
      return <Folder className="h-12 w-12 text-blue-500" />;
    }
  };

  const getItemDescription = (item: FolderType | Content) => {
    if ('type' in item) {
      // It's content
      return `${item.type.toUpperCase()} • ${new Date(item.createdAt).toLocaleDateString()}`;
    } else {
      // It's a folder
      const totalItems = (item.content?.length || 0) + (item.subFolders?.length || 0);
      return `${totalItems} items • ${new Date(item.createdAt).toLocaleDateString()}`;
    }
  };

  const currentLevel = folderLevels[currentLevelIndex];

  if (!currentLevel) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="folder-system">
      {/* Video Player Modal */}
      <VideoPlayerModal
        isOpen={videoPlayer.isOpen}
        onClose={closeVideoPlayer}
        videoUrl={videoPlayer.url}
        title={videoPlayer.title}
        type={videoPlayer.type}
        showChat={false}
      />

      {/* Back Button */}
      <button
        onClick={handleBackClick}
        className="back-button"
        disabled={isTransitioning}
      >
        <ArrowLeft className="h-6 w-6" />
      </button>

      {/* Stage Container */}
      <div className="stage">
        {folderLevels.map((level, index) => (
          <div
            key={index}
            className={`folder-wrap ${
              index < currentLevelIndex ? 'level-up' :
              index === currentLevelIndex ? 'level-current' :
              index === currentLevelIndex + 1 ? 'level-down' : ''
            }`}
          >
            {/* Level Title */}
            <div className="level-title">{level.title}</div>
            
            {/* Folders */}
            {level.folders.map((folder) => (
              <div
                key={folder.id}
                className="tile folder-tile"
                onClick={() => handleFolderClick(folder)}
              >
                {getItemIcon(folder)}
                <h3>{folder.name}</h3>
                <p>{getItemDescription(folder)}</p>
              </div>
            ))}

            {/* Content */}
            {level.content.map((content) => (
              <div
                key={content.id}
                className="tile content-tile"
                onClick={() => handleContentClick(content)}
              >
                {getItemIcon(content)}
                <h3>{content.name}</h3>
                <p>{getItemDescription(content)}</p>
                
                {/* Action overlay */}
                <div className="tile-overlay">
                  {content.type === 'video' ? (
                    <div className="overlay-content">
                      <Play className="h-6 w-6" />
                      <span>Play Video</span>
                    </div>
                  ) : (
                    <div className="overlay-content">
                      <Download className="h-6 w-6" />
                      <span>Download</span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Empty State */}
            {level.folders.length === 0 && level.content.length === 0 && (
              <div className="empty-state">
                <Folder className="h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-300 mb-2">No Content Available</h3>
                <p className="text-gray-500">This folder is empty.</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <style jsx>{`
        .folder-system {
          position: relative;
          max-width: 90%;
          margin: 0 auto;
          padding: 20px;
        }

        .back-button {
          font-size: 26px;
          border-radius: 50px;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          border: 0;
          color: white;
          width: 60px;
          height: 60px;
          margin: 20px 20px 40px;
          outline: none;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .back-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
          background: linear-gradient(135deg, #1d4ed8, #1e40af);
        }

        .back-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .stage {
          position: relative;
          min-height: 400px;
        }

        .folder-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          position: absolute;
          width: 100%;
          transition: all 0.365s cubic-bezier(0.4, 0, 0.2, 1);
          pointer-events: none;
          opacity: 0;
          top: 0;
        }

        .folder-wrap.level-up {
          transform: scale(1.2);
          opacity: 0;
        }

        .folder-wrap.level-current {
          transform: scale(1);
          pointer-events: all;
          opacity: 1;
          position: relative;
          height: auto;
        }

        .folder-wrap.level-down {
          transform: scale(0.8);
          opacity: 0;
        }

        .level-title {
          position: absolute;
          top: -50px;
          left: 0;
          font-size: 18px;
          font-weight: 600;
          color: #e5e7eb;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .tile {
          border-radius: 16px;
          width: calc(20% - 16px);
          min-width: 200px;
          margin-bottom: 24px;
          text-align: center;
          background: linear-gradient(145deg, #374151, #4b5563);
          border: 1px solid #6b7280;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          padding: 35px 20px 25px;
          cursor: pointer;
          overflow: hidden;
        }

        .tile:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          border-color: #3b82f6;
          background: linear-gradient(145deg, #4b5563, #6b7280);
        }

        .tile h3 {
          font-weight: 600;
          font-size: 16px;
          color: #f9fafb;
          margin: 20px 0 8px;
          line-height: 1.4;
        }

        .tile p {
          font-size: 12px;
          color: #9ca3af;
          margin: 0;
          line-height: 1.4;
        }

        .folder-tile:hover {
          background: linear-gradient(145deg, #1e40af, #3b82f6);
        }

        .content-tile:hover {
          background: linear-gradient(145deg, #7c3aed, #a855f7);
        }

        .tile-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: all 0.3s ease;
        }

        .content-tile:hover .tile-overlay {
          opacity: 1;
        }

        .overlay-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          color: white;
          font-weight: 600;
        }

        .empty-state {
          width: 100%;
          text-align: center;
          padding: 60px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        @media (max-width: 1200px) {
          .tile {
            width: calc(25% - 15px);
          }
        }

        @media (max-width: 900px) {
          .tile {
            width: calc(33.333% - 14px);
          }
        }

        @media (max-width: 600px) {
          .tile {
            width: calc(50% - 10px);
            min-width: 150px;
          }
          
          .folder-system {
            max-width: 95%;
            padding: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default FolderSystem;