import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import TelegramPopup from './components/TelegramPopup';
import LoadingSpinner from './components/LoadingSpinner';
import DevToolsProtection from './components/DevToolsProtection';
import Home from './pages/Home';
import Batches from './pages/Batches';
import LiveClasses from './pages/LiveClasses';
import Books from './pages/Books';
import BatchDetail from './pages/BatchDetail';
import FolderDetail from './pages/FolderDetail';
import NextToppersBatches from './pages/NextToppersBatches';
import AIChatbot from './components/AIChatbot/AIChatbot';

const AppContent: React.FC = () => {
  const { loading } = useApp();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-gray-100 scrollbar-dark select-none">
        <DevToolsProtection />
        <Routes>
          <Route path="/" element={
            <>
              <Header />
              <Home />
            </>
          } />
          
          <Route path="/batches" element={
            <>
              <Header />
              <Batches />
            </>
          } />
          
          <Route path="/live-classes" element={
            <>
              <Header />
              <LiveClasses />
            </>
          } />
          
          <Route path="/books" element={
            <>
              <Header />
              <Books />
            </>
          } />
          
          <Route path="/next-toppers" element={
            <>
              <Header />
              <NextToppersBatches />
            </>
          } />
          
          <Route path="/batch/:batchId" element={
            <>
              <Header />
              <BatchDetail />
            </>
          } />
          
          <Route path="/batch/:batchId/folder/:folderId" element={
            <>
              <Header />
              <FolderDetail />
            </>
          } />
          
          {/* Catch all route for 404 - redirect to home */}
          <Route path="*" element={
            <>
              <Header />
              <Home />
            </>
          } />
        </Routes>
        
        <TelegramPopup />
        <AIChatbot />
      </div>
    </Router>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;