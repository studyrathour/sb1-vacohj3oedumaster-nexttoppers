import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAuPesVWNh28W9bcW0go7WbpeTt51oIuDc",
  authDomain: "edumaster-bc237.firebaseapp.com",
  projectId: "edumaster-bc237",
  storageBucket: "edumaster-bc237.firebasestorage.app",
  messagingSenderId: "766181915726",
  appId: "1:766181915726:web:7935aa0ab2ade17308971f",
  measurementId: "G-HNK0BZ3E9E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;