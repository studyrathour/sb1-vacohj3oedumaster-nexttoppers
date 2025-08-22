import React from 'react';
import { BookOpen, Video, Users, Archive, Calculator, Lightbulb, Globe, MessageCircle } from 'lucide-react';

export const getContextualSuggestions = (currentPath: string) => {
  const suggestions = [];

  switch (true) {
    case currentPath === '/':
      suggestions.push(
        'EduMaster platform ke baare mein bataiye / Tell me about EduMaster platform',
        'Kaise shuru karein padhai? / How to start studying?',
        'Live classes kaise join karein? / How to join live classes?'
      );
      break;
    
    case currentPath.includes('/batches'):
      suggestions.push(
        'Batch kya hota hai? / What is a batch?',
        'Kaun sa batch choose karun? / Which batch should I choose?',
        'Batch ke andar kya milta hai? / What\'s inside a batch?'
      );
      break;
    
    case currentPath.includes('/live-classes'):
      suggestions.push(
        'Live class mein kaise participate karein? / How to participate in live class?',
        'Screen sharing kaise kaam karta hai? / How does screen sharing work?',
        'Live class miss ho jaye to kya karein? / What if I miss a live class?'
      );
      break;
    
    case currentPath.includes('/books'):
      suggestions.push(
        'Kaun si book padhun? / Which book should I read?',
        'Reading tips diye / Give me reading tips',
        'Notes kaise banayein? / How to make notes?'
      );
      break;
    
    default:
      suggestions.push(
        'Mujhe padhai mein help chahiye / I need help with studies',
        'Doubt solve kariye / Solve my doubt',
        'Study plan banayiye / Create a study plan'
      );
  }

  return suggestions;
};

export const getSubjectHelpers = () => {
  return [
    {
      subject: 'Mathematics',
      icon: Calculator,
      prompts: [
        'Ganit ka sawal solve kariye / Solve this math problem',
        'Formula explain kariye / Explain this formula',
        'Step by step solution diye / Give step by step solution'
      ]
    },
    {
      subject: 'Science',
      icon: Lightbulb,
      prompts: [
        'Science concept samjhaiye / Explain this science concept',
        'Experiment ke baare mein bataiye / Tell me about this experiment',
        'Theory aur practical mein difference / Difference between theory and practical'
      ]
    },
    {
      subject: 'English',
      icon: Globe,
      prompts: [
        'Grammar rules samjhaiye / Explain grammar rules',
        'Essay writing tips / Essay writing tips',
        'Vocabulary improve kaise karein? / How to improve vocabulary?'
      ]
    },
    {
      subject: 'General',
      icon: BookOpen,
      prompts: [
        'Study schedule banayiye / Create a study schedule',
        'Memory techniques bataiye / Tell me memory techniques',
        'Exam preparation tips / Exam preparation tips'
      ]
    }
  ];
};

export const getMotivationalMessages = () => {
  return [
    'Padhai mein mehnat karte rahiye! 💪 / Keep working hard in your studies!',
    'Har sawal ka jawab hai, bas puchna hai! 🤔 / Every question has an answer, just ask!',
    'Aap kar sakte hain! 🌟 / You can do it!',
    'Dhire-dhire sab kuch samajh aayega! 📚 / Gradually everything will become clear!',
    'Practice makes perfect! Abhyas se sab kuch aasan ho jata hai! ✨'
  ];
};

export const getLanguageSupport = () => {
  return {
    hindi: 'Hindi mein puchiye',
    english: 'Ask in English',
    hinglish: 'Hinglish mein bhi puch sakte hain',
    regional: 'Regional languages bhi supported hain'
  };
};