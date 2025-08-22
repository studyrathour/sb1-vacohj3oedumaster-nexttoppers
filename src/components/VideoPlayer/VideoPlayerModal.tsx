import React from 'react';
import VideoPlayer from './VideoPlayer';

interface VideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title: string;
  type: 'lecture' | 'live';
  showChat?: boolean;
}

const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  isOpen,
  onClose,
  videoUrl,
  title,
  type,
  showChat = false
}) => {
  if (!isOpen) return null;

  return (
    <VideoPlayer
      src={videoUrl}
      title={title}
      type={type}
      showChat={showChat}
      onClose={onClose}
    />
  );
};

export default VideoPlayerModal;