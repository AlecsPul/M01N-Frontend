import React from 'react';

const SearchBar: React.FC = () => {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search products..."
        className="search-input"
      />
      <button className="search-button">
        Search
      </button>
    </div>
  );
};

export default SearchBar;
