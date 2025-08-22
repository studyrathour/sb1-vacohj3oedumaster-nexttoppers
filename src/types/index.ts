export interface Batch {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  createdAt: string;
  folders: Folder[];
  liveClasses: LiveClass[];
  streamingConfig?: {
    hlsUrl?: string;
    server?: string;
    streamKey?: string;
  };
  internetArchive?: {
    identifier: string;
    url: string;
    lastSync: string;
    autoUpdate: boolean;
  };
}

export interface Folder {
  id: string;
  name: string;
  parentId?: string;
  batchId: string;
  subFolders: Folder[];
  content: Content[];
  createdAt: string;
}

export interface Content {
  id: string;
  name: string;
  type: 'video' | 'pdf' | 'document';
  url: string;
  thumbnail?: string;
  folderId: string;
  batchId: string;
  createdAt: string;
  playerType?: 'internal' | 'edumaster2';
}

export interface LiveClass {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  batchId: string;
  scheduledAt: string;
  endTime: string;
  isLive: boolean;
  streamUrl?: string;
  playerType: 'internal' | 'external';
  externalMeetingLink?: string;
  urlToBeAdded?: boolean;
  createdAt: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  thumbnail?: string;
  url: string;
  category: string;
  createdAt: string;
}

export interface GoLiveSession {
  id: string;
  title: string;
  batchId: string;
  isActive: boolean;
  startTime: string;
  streamUrl?: string;
  playerType?: 'internal' | 'external';
  externalMeetingLink?: string;
  thumbnail?: string;
}

export interface AdminUser {
  id: string;
  username: string;
  password: string;
  role: 'master' | 'batch' | 'book';
  name: string;
  email: string;
  batchId?: string; // For batch admins
  createdAt: string;
}

export interface MasterCode {
  id: string;
  code: string;
  purpose: string;
  description: string;
  isActive: boolean;
  createdAt: string;
}

export type AdminRole = 'master' | 'batch' | 'book';