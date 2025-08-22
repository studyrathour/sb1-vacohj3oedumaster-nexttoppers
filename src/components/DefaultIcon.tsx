import React from 'react';
import { Video, FileText, BookOpen, Radio } from 'lucide-react';

interface DefaultIconProps {
  type: 'video' | 'pdf' | 'book' | 'live' | 'document';
  className?: string;
  playerType?: 'internal' | 'edumaster2';
}

const DefaultIcon: React.FC<DefaultIconProps> = ({ type, className = "h-12 w-12", playerType }) => {
  const iconMap = {
    video: Video,
    pdf: FileText,
    book: BookOpen,
    live: Radio,
    document: FileText
  };

  const Icon = iconMap[type];

  return (
    <div className={`bg-gradient-to-br ${
      type === 'video' && playerType === 'edumaster2' 
        ? 'from-purple-600 to-pink-700' 
        : 'from-blue-600 to-purple-700'
    } rounded-lg p-3 ${className} shadow-lg relative`}>
      <Icon className="h-full w-full text-white" />
      {type === 'video' && playerType === 'edumaster2' && (
        <div className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs px-1 rounded-full font-bold">
          2
        </div>
      )}
    </div>
  );
};

export default DefaultIcon;