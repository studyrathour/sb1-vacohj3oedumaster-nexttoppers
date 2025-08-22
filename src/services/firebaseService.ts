import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  writeBatch,
  connectFirestoreEmulator,
  setDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Batch, LiveClass, Book, GoLiveSession, AdminUser, MasterCode } from '../types';
import { auditService } from './auditService';

// Collection names
const COLLECTIONS = {
  BATCHES: 'batches',
  LIVE_CLASSES: 'liveClasses',
  BOOKS: 'books',
  GO_LIVE_SESSIONS: 'goLiveSessions',
  ADMIN_USERS: 'adminUsers',
  MASTER_CODES: 'masterCodes'
};

// Helper function to handle Firestore timestamp conversion
const convertTimestamp = (timestamp: any): string => {
  if (!timestamp) return new Date().toISOString();
  if (timestamp.toDate) return timestamp.toDate().toISOString();
  if (timestamp.seconds) return new Date(timestamp.seconds * 1000).toISOString();
  return new Date().toISOString();
};

// Batch operations
export const batchService = {
  // Add a new batch
  async add(batchData: Omit<Batch, 'id' | 'createdAt'>) {
    try {
      console.log('Adding batch:', batchData.name);
      const docRef = await addDoc(collection(db, COLLECTIONS.BATCHES), {
        ...batchData,
        createdAt: serverTimestamp(),
        folders: batchData.folders || [],
        liveClasses: batchData.liveClasses || []
      });
      console.log('Batch added successfully:', docRef.id);
      
      // Log the action (will be called from context with admin info)
      return docRef.id;
    } catch (error) {
      console.error('Error adding batch:', error);
      throw error;
    }
  },

  // Get all batches
  async getAll(): Promise<Batch[]> {
    try {
      console.log('Fetching all batches...');
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.BATCHES));
      const batches = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: convertTimestamp(doc.data().createdAt)
      })) as Batch[];
      console.log(`Fetched ${batches.length} batches`);
      return batches;
    } catch (error) {
      console.error('Error getting batches:', error);
      throw error;
    }
  },

  // Get batch by ID
  async getById(id: string): Promise<Batch | null> {
    try {
      console.log('Fetching batch by ID:', id);
      const docRef = doc(db, COLLECTIONS.BATCHES, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const batch = {
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: convertTimestamp(docSnap.data().createdAt)
        } as Batch;
        console.log('Batch found:', batch.name);
        return batch;
      } else {
        console.log('Batch not found');
        return null;
      }
    } catch (error) {
      console.error('Error getting batch by ID:', error);
      throw error;
    }
  },

  // Update a batch
  async update(id: string, updates: Partial<Batch>) {
    try {
      console.log('Updating batch:', id);
      
      // Get current data for audit log
      const currentDoc = await getDoc(doc(db, COLLECTIONS.BATCHES, id));
      const beforeData = currentDoc.exists() ? currentDoc.data() : null;
      
      const docRef = doc(db, COLLECTIONS.BATCHES, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      console.log('Batch updated successfully');
      
      // Return before and after data for audit logging
      return { beforeData, afterData: { ...beforeData, ...updates } };
    } catch (error) {
      console.error('Error updating batch:', error);
      throw error;
    }
  },

  // Delete a batch
  async delete(id: string) {
    try {
      console.log('Deleting batch:', id);
      
      // Get current data before deletion for recovery
      const docRef = doc(db, COLLECTIONS.BATCHES, id);
      const docSnap = await getDoc(docRef);
      const dataToStore = docSnap.exists() ? docSnap.data() : null;
      
      await deleteDoc(doc(db, COLLECTIONS.BATCHES, id));
      console.log('Batch deleted successfully');
      
      // Return deleted data for audit logging and recovery
      return dataToStore;
    } catch (error) {
      console.error('Error deleting batch:', error);
      throw error;
    }
  },

  // Listen to real-time updates
  onSnapshot(callback: (batches: Batch[]) => void) {
    console.log('Setting up batches real-time listener...');
    return onSnapshot(
      query(collection(db, COLLECTIONS.BATCHES), orderBy('createdAt', 'desc')),
      (snapshot) => {
        const batches = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: convertTimestamp(doc.data().createdAt)
        })) as Batch[];
        console.log(`Real-time update: ${batches.length} batches`);
        callback(batches);
      },
      (error) => {
        console.error('Error listening to batches:', error);
      }
    );
  }
};

// Live Classes operations
export const liveClassService = {
  async add(liveClassData: Omit<LiveClass, 'id' | 'createdAt'>) {
    try {
      console.log('Adding live class:', liveClassData.title);
      const docRef = await addDoc(collection(db, COLLECTIONS.LIVE_CLASSES), {
        ...liveClassData,
        createdAt: serverTimestamp()
      });
      console.log('Live class added successfully:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error adding live class:', error);
      throw error;
    }
  },

  async getAll(): Promise<LiveClass[]> {
    try {
      console.log('Fetching all live classes...');
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.LIVE_CLASSES));
      const liveClasses = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: convertTimestamp(doc.data().createdAt)
      })) as LiveClass[];
      console.log(`Fetched ${liveClasses.length} live classes`);
      return liveClasses;
    } catch (error) {
      console.error('Error getting live classes:', error);
      throw error;
    }
  },

  async update(id: string, updates: Partial<LiveClass>) {
    try {
      console.log('Updating live class:', id);
      
      // Get current data for audit log
      const currentDoc = await getDoc(doc(db, COLLECTIONS.LIVE_CLASSES, id));
      const beforeData = currentDoc.exists() ? currentDoc.data() : null;
      
      const docRef = doc(db, COLLECTIONS.LIVE_CLASSES, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      console.log('Live class updated successfully');
      
      return { beforeData, afterData: { ...beforeData, ...updates } };
    } catch (error) {
      console.error('Error updating live class:', error);
      throw error;
    }
  },

  async delete(id: string) {
    try {
      console.log('Deleting live class:', id);
      
      const docRef = doc(db, COLLECTIONS.LIVE_CLASSES, id);
      const docSnap = await getDoc(docRef);
      const dataToStore = docSnap.exists() ? docSnap.data() : null;
      
      await deleteDoc(doc(db, COLLECTIONS.LIVE_CLASSES, id));
      console.log('Live class deleted successfully');
      
      return dataToStore;
    } catch (error) {
      console.error('Error deleting live class:', error);
      throw error;
    }
  },

  onSnapshot(callback: (liveClasses: LiveClass[]) => void) {
    console.log('Setting up live classes real-time listener...');
    return onSnapshot(
      query(collection(db, COLLECTIONS.LIVE_CLASSES), orderBy('createdAt', 'desc')),
      (snapshot) => {
        const liveClasses = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: convertTimestamp(doc.data().createdAt)
        })) as LiveClass[];
        console.log(`Real-time update: ${liveClasses.length} live classes`);
        callback(liveClasses);
      },
      (error) => {
        console.error('Error listening to live classes:', error);
      }
    );
  }
};

// Books operations
export const bookService = {
  async add(bookData: Omit<Book, 'id' | 'createdAt'>) {
    try {
      console.log('Adding book:', bookData.title);
      const docRef = await addDoc(collection(db, COLLECTIONS.BOOKS), {
        ...bookData,
        createdAt: serverTimestamp()
      });
      console.log('Book added successfully:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error adding book:', error);
      throw error;
    }
  },

  async getAll(): Promise<Book[]> {
    try {
      console.log('Fetching all books...');
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.BOOKS));
      const books = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: convertTimestamp(doc.data().createdAt)
      })) as Book[];
      console.log(`Fetched ${books.length} books`);
      return books;
    } catch (error) {
      console.error('Error getting books:', error);
      throw error;
    }
  },

  async update(id: string, updates: Partial<Book>) {
    try {
      console.log('Updating book:', id);
      
      const currentDoc = await getDoc(doc(db, COLLECTIONS.BOOKS, id));
      const beforeData = currentDoc.exists() ? currentDoc.data() : null;
      
      const docRef = doc(db, COLLECTIONS.BOOKS, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      console.log('Book updated successfully');
      
      return { beforeData, afterData: { ...beforeData, ...updates } };
    } catch (error) {
      console.error('Error updating book:', error);
      throw error;
    }
  },

  async delete(id: string) {
    try {
      console.log('Deleting book:', id);
      
      const docRef = doc(db, COLLECTIONS.BOOKS, id);
      const docSnap = await getDoc(docRef);
      const dataToStore = docSnap.exists() ? docSnap.data() : null;
      
      await deleteDoc(doc(db, COLLECTIONS.BOOKS, id));
      console.log('Book deleted successfully');
      
      return dataToStore;
    } catch (error) {
      console.error('Error deleting book:', error);
      throw error;
    }
  },

  onSnapshot(callback: (books: Book[]) => void) {
    console.log('Setting up books real-time listener...');
    return onSnapshot(
      query(collection(db, COLLECTIONS.BOOKS), orderBy('createdAt', 'desc')),
      (snapshot) => {
        const books = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: convertTimestamp(doc.data().createdAt)
        })) as Book[];
        console.log(`Real-time update: ${books.length} books`);
        callback(books);
      },
      (error) => {
        console.error('Error listening to books:', error);
      }
    );
  }
};

// Go Live Sessions operations
export const goLiveService = {
  async add(sessionData: Omit<GoLiveSession, 'id' | 'startTime'>) {
    try {
      console.log('Adding go live session:', sessionData.title);
      const docRef = await addDoc(collection(db, COLLECTIONS.GO_LIVE_SESSIONS), {
        ...sessionData,
        startTime: serverTimestamp()
      });
      console.log('Go live session added successfully:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error adding go live session:', error);
      throw error;
    }
  },

  async getAll(): Promise<GoLiveSession[]> {
    try {
      console.log('Fetching all go live sessions...');
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.GO_LIVE_SESSIONS));
      const sessions = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        startTime: convertTimestamp(doc.data().startTime)
      })) as GoLiveSession[];
      console.log(`Fetched ${sessions.length} go live sessions`);
      return sessions;
    } catch (error) {
      console.error('Error getting go live sessions:', error);
      throw error;
    }
  },

  async update(id: string, updates: Partial<GoLiveSession>) {
    try {
      console.log('Updating go live session:', id);
      
      const currentDoc = await getDoc(doc(db, COLLECTIONS.GO_LIVE_SESSIONS, id));
      const beforeData = currentDoc.exists() ? currentDoc.data() : null;
      
      const docRef = doc(db, COLLECTIONS.GO_LIVE_SESSIONS, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      console.log('Go live session updated successfully');
      
      return { beforeData, afterData: { ...beforeData, ...updates } };
    } catch (error) {
      console.error('Error updating go live session:', error);
      throw error;
    }
  },

  async delete(id: string) {
    try {
      console.log('Deleting go live session:', id);
      
      const docRef = doc(db, COLLECTIONS.GO_LIVE_SESSIONS, id);
      const docSnap = await getDoc(docRef);
      const dataToStore = docSnap.exists() ? docSnap.data() : null;
      
      await deleteDoc(doc(db, COLLECTIONS.GO_LIVE_SESSIONS, id));
      console.log('Go live session deleted successfully');
      
      return dataToStore;
    } catch (error) {
      console.error('Error deleting go live session:', error);
      throw error;
    }
  },

  onSnapshot(callback: (sessions: GoLiveSession[]) => void) {
    console.log('Setting up go live sessions real-time listener...');
    return onSnapshot(
      query(collection(db, COLLECTIONS.GO_LIVE_SESSIONS), orderBy('startTime', 'desc')),
      (snapshot) => {
        const sessions = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          startTime: convertTimestamp(doc.data().startTime)
        })) as GoLiveSession[];
        console.log(`Real-time update: ${sessions.length} go live sessions`);
        callback(sessions);
      },
      (error) => {
        console.error('Error listening to go live sessions:', error);
      }
    );
  }
};

// Admin Users operations
export const adminUserService = {
  async add(userData: Omit<AdminUser, 'id' | 'createdAt'>) {
    try {
      console.log('Adding admin user:', userData.username);
      const docRef = await addDoc(collection(db, COLLECTIONS.ADMIN_USERS), {
        ...userData,
        createdAt: serverTimestamp()
      });
      console.log('Admin user added successfully:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error adding admin user:', error);
      throw error;
    }
  },

  async getAll(): Promise<AdminUser[]> {
    try {
      console.log('Fetching all admin users...');
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.ADMIN_USERS));
      const adminUsers = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: convertTimestamp(doc.data().createdAt)
      })) as AdminUser[];
      console.log(`Fetched ${adminUsers.length} admin users`);
      return adminUsers;
    } catch (error) {
      console.error('Error getting admin users:', error);
      throw error;
    }
  },

  async authenticate(username: string, password: string, role: string, batchId?: string): Promise<AdminUser | null> {
    try {
      console.log('Authenticating admin user:', username, role);
      let q = query(
        collection(db, COLLECTIONS.ADMIN_USERS),
        where('username', '==', username),
        where('password', '==', password),
        where('role', '==', role)
      );

      if (role === 'batch' && batchId) {
        q = query(q, where('batchId', '==', batchId));
      }

      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const user = {
          id: doc.id,
          ...doc.data(),
          createdAt: convertTimestamp(doc.data().createdAt)
        } as AdminUser;
        console.log('Admin user authenticated successfully');
        return user;
      }
      
      console.log('Admin user authentication failed');
      return null;
    } catch (error) {
      console.error('Error authenticating admin user:', error);
      throw error;
    }
  },

  async update(id: string, updates: Partial<AdminUser>) {
    try {
      console.log('Updating admin user:', id);
      
      const currentDoc = await getDoc(doc(db, COLLECTIONS.ADMIN_USERS, id));
      const beforeData = currentDoc.exists() ? currentDoc.data() : null;
      
      const docRef = doc(db, COLLECTIONS.ADMIN_USERS, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      console.log('Admin user updated successfully');
      
      return { beforeData, afterData: { ...beforeData, ...updates } };
    } catch (error) {
      console.error('Error updating admin user:', error);
      throw error;
    }
  },

  async delete(id: string) {
    try {
      console.log('Deleting admin user:', id);
      
      const docRef = doc(db, COLLECTIONS.ADMIN_USERS, id);
      const docSnap = await getDoc(docRef);
      const dataToStore = docSnap.exists() ? docSnap.data() : null;
      
      await deleteDoc(doc(db, COLLECTIONS.ADMIN_USERS, id));
      console.log('Admin user deleted successfully');
      
      return dataToStore;
    } catch (error) {
      console.error('Error deleting admin user:', error);
      throw error;
    }
  }
};

// Master Codes operations
export const masterCodeService = {
  async add(codeData: Omit<MasterCode, 'id' | 'createdAt'>) {
    try {
      console.log('Adding master code:', codeData.code);
      const docRef = await addDoc(collection(db, COLLECTIONS.MASTER_CODES), {
        ...codeData,
        createdAt: serverTimestamp()
      });
      console.log('Master code added successfully:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error adding master code:', error);
      throw error;
    }
  },

  async getAll(): Promise<MasterCode[]> {
    try {
      console.log('Fetching all master codes...');
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.MASTER_CODES));
      const masterCodes = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: convertTimestamp(doc.data().createdAt)
      })) as MasterCode[];
      console.log(`Fetched ${masterCodes.length} master codes`);
      return masterCodes;
    } catch (error) {
      console.error('Error getting master codes:', error);
      throw error;
    }
  },

  async verify(code: string, purpose: string): Promise<boolean> {
    try {
      console.log('Verifying master code:', code, purpose);
      const q = query(
        collection(db, COLLECTIONS.MASTER_CODES),
        where('code', '==', code),
        where('purpose', '==', purpose),
        where('isActive', '==', true)
      );

      const querySnapshot = await getDocs(q);
      const isValid = !querySnapshot.empty;
      console.log('Master code verification result:', isValid);
      return isValid;
    } catch (error) {
      console.error('Error verifying master code:', error);
      throw error;
    }
  },

  async update(id: string, updates: Partial<MasterCode>) {
    try {
      console.log('Updating master code:', id);
      
      const currentDoc = await getDoc(doc(db, COLLECTIONS.MASTER_CODES, id));
      const beforeData = currentDoc.exists() ? currentDoc.data() : null;
      
      const docRef = doc(db, COLLECTIONS.MASTER_CODES, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      console.log('Master code updated successfully');
      
      return { beforeData, afterData: { ...beforeData, ...updates } };
    } catch (error) {
      console.error('Error updating master code:', error);
      throw error;
    }
  },

  async delete(id: string) {
    try {
      console.log('Deleting master code:', id);
      
      const docRef = doc(db, COLLECTIONS.MASTER_CODES, id);
      const docSnap = await getDoc(docRef);
      const dataToStore = docSnap.exists() ? docSnap.data() : null;
      
      await deleteDoc(doc(db, COLLECTIONS.MASTER_CODES, id));
      console.log('Master code deleted successfully');
      
      return dataToStore;
    } catch (error) {
      console.error('Error deleting master code:', error);
      throw error;
    }
  }
};

// Initialize default data - ONLY essential admin and codes, NO dummy batches
export const initializeDefaultData = async () => {
  try {
    console.log('Initializing essential default data...');
    
    // Check if data already exists
    const adminUsers = await adminUserService.getAll();
    const masterCodes = await masterCodeService.getAll();
    
    // Clean up any existing fake/dummy batches
    await cleanupFakeBatches();

    // Initialize master admin if not exists
    const masterAdmin = adminUsers.find(user => user.role === 'master' && user.username === 'suraj2008');
    if (!masterAdmin) {
      console.log('Creating default master admin...');
      await adminUserService.add({
        username: 'admin',
        password: 'admin123',
        role: 'master',
        name: 'System Administrator',
        email: 'admin@edumaster.com'
      });
    }

    // Initialize essential master codes if not exists
    if (masterCodes.length === 0) {
      console.log('Creating essential master codes...');
      
      const essentialMasterCodes = [
        { code: 'MASTER2024', purpose: 'create_batch_admin', description: 'Create new batch administrators', isActive: true },
        { code: 'BOOK2024', purpose: 'create_book_admin', description: 'Create new book administrators', isActive: true },
        { code: 'ADMIN2024', purpose: 'create_master_admin', description: 'Create new master administrators', isActive: true },
        { code: 'SUPER2024', purpose: 'super_admin', description: 'Super admin access code', isActive: true },
        { code: 'ARCHIVE2024', purpose: 'archive_management', description: 'Internet Archive management', isActive: true }
      ];

      for (const code of essentialMasterCodes) {
        await masterCodeService.add(code);
      }
    }

    console.log('Essential default data initialization completed successfully');
  } catch (error) {
    console.error('Error initializing default data:', error);
    // Don't throw error here to prevent app from failing
  }
};

// Clean up fake/dummy batches from Firebase
export const cleanupFakeBatches = async () => {
  try {
    console.log('Cleaning up fake/dummy batches from Firebase...');
    
    const batches = await batchService.getAll();
    const fakeBatchNames = [
      'Music Theory',
      'Art and Design',
      'Economics Principles',
      'History World Wars',
      'Biology Advanced',
      'English Literature',
      'Computer Science Fundamentals',
      'Chemistry Grade 12',
      'Physics Grade 11',
      'Mathematics Grade 10'
    ];
    
    // Delete batches that match fake batch names or have dummy descriptions
    for (const batch of batches) {
      const isFakeBatch = fakeBatchNames.includes(batch.name) ||
                         batch.description.includes('Learn music') ||
                         batch.description.includes('Creative arts') ||
                         batch.description.includes('Microeconomics') ||
                         batch.description.includes('Comprehensive study') ||
                         batch.description.includes('Advanced biology') ||
                         batch.description.includes('Classic and modern') ||
                         batch.description.includes('Introduction to programming') ||
                         batch.description.includes('Comprehensive chemistry') ||
                         batch.description.includes('Advanced physics') ||
                         batch.description.includes('Complete mathematics');
      
      if (isFakeBatch) {
        console.log(`Deleting fake batch: ${batch.name}`);
        await batchService.delete(batch.id);
      }
    }
    
    console.log('Fake batches cleanup completed');
  } catch (error) {
    console.error('Error cleaning up fake batches:', error);
  }
};

// Function to manually trigger cleanup (for admin use)
export const manualCleanupFakeBatches = async () => {
  await cleanupFakeBatches();
};
// Initialize default master admin if not exists (legacy function)
export const initializeDefaultAdmin = async () => {
  try {
    console.log('Checking for default master admin...');
    const adminUsers = await adminUserService.getAll();
    const masterAdmin = adminUsers.find(user => user.role === 'master' && user.username === 'admin');
    
    if (!masterAdmin) {
      console.log('Creating default master admin...');
      await adminUserService.add({
        username: 'admin',
        password: 'admin123',
        role: 'master',
        name: 'System Administrator',
        email: 'admin@edumaster.com'
      });
      console.log('Default master admin created successfully');
    } else {
      console.log('Default master admin already exists');
    }
  } catch (error) {
    console.error('Error initializing default admin:', error);
    // Don't throw error here to prevent app from failing
  }
};