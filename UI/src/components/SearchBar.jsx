import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function SearchBar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    const trimmedQuery = query.trim();
    if (trimmedQuery) {
      navigate(`/search?query=${encodeURIComponent(trimmedQuery)}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex mx-4 w-full max-w-xl items-center bg-white border border-gray-300 rounded-full shadow-sm focus-within:ring-1 focus-within:ring-red-500">
      <input
        type="text"
        placeholder="Search videos..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-grow min-w-0 px-5 py-2 text-sm text-gray-700 bg-transparent rounded-l-full focus:outline-none"
      />
      <button
        onClick={handleSearch}
        className="flex items-center justify-center px-5 py-2 text-white bg-red-600 rounded-r-full hover:bg-red-600 transition-colors"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
          />
        </svg>
      </button>
    </div>
  );
}

export default SearchBar;
