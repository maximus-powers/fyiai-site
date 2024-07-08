import { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
      setIsFocused(false); // Hide button after submission
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      setIsFocused(false);
    }, 100);
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-lg">
      <input
        type="text"
        className="flex-grow py-1 px-3 border border-zinc-600 rounded-l duration-200 bg-zinc-800 text-white w-0 min-w-0"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
      />
      {isFocused && (
        <button
          type="submit"
          className="bg-zinc-300 text-black py-1 px-3 rounded-r hover:bg-zinc-400 transition-all duration-200"
        >
          search
        </button>
      )}
    </form>
  );
};

export default SearchBar;
