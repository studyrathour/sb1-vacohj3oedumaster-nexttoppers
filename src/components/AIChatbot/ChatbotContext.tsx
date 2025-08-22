import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ChatbotContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  unreadCount: number;
  setUnreadCount: (count: number) => void;
  addUnreadMessage: () => void;
  clearUnreadMessages: () => void;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error('useChatbot must be used within ChatbotProvider');
  }
  return context;
};

export const ChatbotProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const addUnreadMessage = () => {
    if (!isOpen) {
      setUnreadCount(prev => prev + 1);
    }
  };

  const clearUnreadMessages = () => {
    setUnreadCount(0);
  };

  return (
    <ChatbotContext.Provider value={{
      isOpen,
      setIsOpen,
      unreadCount,
      setUnreadCount,
      addUnreadMessage,
      clearUnreadMessages
    }}>
      {children}
    </ChatbotContext.Provider>
  );
};