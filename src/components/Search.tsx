import React from 'react';
import { SearchProps } from '@/utils/interfaceSearch';

export const Search: React.FC<SearchProps> = ({ 
  searchTerm, 
  onSearchChange, 
  placeholder = "Search albums or artists..." 
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  const clearSearch = () => {
    onSearchChange('');
  };

  return (
    <div className="search">
      <div className="search__container">
        <div className="search__inputWrapper">
          <input
            type="text"
            className="search__input"
            placeholder={placeholder}
            value={searchTerm}
            onChange={handleInputChange}
          />
          {searchTerm && (
            <button 
              className="search__clearButton"
              onClick={clearSearch}
              type="button"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
        <div className="search__icon">
          🔍
        </div>
      </div>
      {searchTerm.length > 0 && searchTerm.length < 2 && (
        <div className="search__hint">
          Type at least 2 characters to search
        </div>
      )}
    </div>
  );
};
