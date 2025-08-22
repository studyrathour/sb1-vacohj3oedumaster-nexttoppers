import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BookOpen, Search, Filter } from 'lucide-react';
import ThumbnailImage from '../components/ThumbnailImage';

const Books: React.FC = () => {
  const { books } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Extract unique categories from books
  const categories = ['all', ...Array.from(new Set(books.map(book => book.category)))];

  const handleReadBook = (book: any) => {
    window.open(book.url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Digital Library</h1>
          <p className="text-gray-400">Explore our collection of educational books and resources</p>
        </div>

        {/* Search and Filter */}
        <div className="bg-gray-800 rounded-xl shadow-xl p-6 mb-8 border border-gray-700">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search books by title or author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category} ({category === 'all' ? books.length : books.filter(b => b.category === category).length})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Books Grid */}
        {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <div key={book.id} className="bg-gray-800 rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-200 border border-gray-700">
                <div className="h-64 relative">
                  <ThumbnailImage
                    src={book.thumbnail}
                    alt={book.title}
                    type="book"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                    {book.category}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-2 line-clamp-2">{book.title}</h3>
                  <p className="text-gray-400 mb-2">by {book.author}</p>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-3">{book.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      Added: {new Date(book.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => handleReadBook(book)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                      <BookOpen className="h-4 w-4" />
                      <span>Read</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              {books.length === 0 ? 'No Books Available' : 'No Books Found'}
            </h3>
            <p className="text-gray-400">
              {books.length === 0
                ? 'Books will appear here once they are uploaded to the library.'
                : 'Try adjusting your search terms or filter options.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Books;