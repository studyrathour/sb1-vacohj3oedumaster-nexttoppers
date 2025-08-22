import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Batch, LiveClass, Book, GoLiveSession } from '../types';
import { 
  batchService, 
  liveClassService, 
  bookService, 
  goLiveService,
  initializeDefaultData
} from '../services/firebaseService';

interface AppContextType {
  batches: Batch[];
  liveClasses: LiveClass[];
  books: Book[];
  goLiveSessions: GoLiveSession[];
  loading: boolean;
  error: string | null;
  retryConnection: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [goLiveSessions, setGoLiveSessions] = useState<GoLiveSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize Firebase listeners and default data
  const initializeApp = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Initializing EduMaster app...');
      
      // Set a timeout to prevent infinite loading
      const timeoutId = setTimeout(() => {
        setError('Connection timeout. Please check your internet connection and try again.');
        setLoading(false);
      }, 15000); // 15 second timeout

      // Initialize default data first
      await initializeDefaultData();
      console.log('Default data initialized');
      
      // Load initial data with individual error handling
      const dataPromises = [
        batchService.getAll().catch(err => { console.warn('Failed to load batches:', err); return []; }),
        liveClassService.getAll().catch(err => { console.warn('Failed to load live classes:', err); return []; }),
        bookService.getAll().catch(err => { console.warn('Failed to load books:', err); return []; }),
        goLiveService.getAll().catch(err => { console.warn('Failed to load go live sessions:', err); return []; })
      ];

      const [initialBatches, initialLiveClasses, initialBooks, initialGoLiveSessions] = await Promise.all(dataPromises);

      setBatches(initialBatches);
      setLiveClasses(initialLiveClasses);
      setBooks(initialBooks);
      setGoLiveSessions(initialGoLiveSessions);

      console.log('Initial data loaded successfully');

      // Set up real-time listeners with error handling
      try {
        const unsubscribeBatches = batchService.onSnapshot(setBatches);
        const unsubscribeLiveClasses = liveClassService.onSnapshot(setLiveClasses);
        const unsubscribeBooks = bookService.onSnapshot(setBooks);
        const unsubscribeGoLiveSessions = goLiveService.onSnapshot(setGoLiveSessions);

        console.log('Real-time listeners established');

        // Clear timeout and set loading to false
        clearTimeout(timeoutId);
        setLoading(false);

        // Cleanup listeners on unmount
        return () => {
          unsubscribeBatches();
          unsubscribeLiveClasses();
          unsubscribeBooks();
          unsubscribeGoLiveSessions();
        };
      } catch (listenerError) {
        console.warn('Failed to set up real-time listeners:', listenerError);
        // Still allow the app to work without real-time updates
        clearTimeout(timeoutId);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error initializing app:', error);
      setError('Failed to connect to Firebase. Please check your internet connection and try again.');
      setLoading(false);
    }
  };

  const retryConnection = () => {
    console.log('Retrying connection...');
    initializeApp();
  };

  useEffect(() => {
    initializeApp();
  }, []);

  return (
    <AppContext.Provider value={{
      batches,
      liveClasses,
      books,
      goLiveSessions,
      loading,
      error,
      retryConnection
    }}>
      {children}
    </AppContext.Provider>
  );
};