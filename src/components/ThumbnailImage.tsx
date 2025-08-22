import React, { useState } from 'react';
import DefaultIcon from './DefaultIcon';

interface ThumbnailImageProps {
  src?: string;
  alt: string;
  type: 'video' | 'pdf' | 'book' | 'live' | 'document';
  className?: string;
  playerType?: 'internal' | 'edumaster2';
}

const ThumbnailImage: React.FC<ThumbnailImageProps> = ({ src, alt, type, className = "h-48 w-full object-cover", playerType }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Show default icon if no src, error occurred, or src is empty/whitespace
  if (!src || !src.trim() || imageError) {
    return <DefaultIcon type={type} className={className} playerType={playerType} />;
  }

  return (
    <div className="relative">
      {imageLoading && (
        <div className={`absolute inset-0 flex items-center justify-center bg-gray-700 ${className}`}>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}
      <img
        src={src.trim()}
        alt={alt}
        className={`${className} ${imageLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={() => setImageLoading(false)}
        onError={() => {
          setImageError(true);
          setImageLoading(false);
        }}
        crossOrigin="anonymous"
      />
      {type === 'video' && playerType === 'edumaster2' && !imageLoading && !imageError && (
        <div className="absolute top-2 right-2 bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-bold">
          Player 2
        </div>
      )}
    </div>
  );
};

export default ThumbnailImage;