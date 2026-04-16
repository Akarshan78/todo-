import { HiOutlineSearch, HiX } from 'react-icons/hi';
import { useState, useEffect } from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import './SearchBar.css';

const SearchBar = ({ value, onChange }) => {
  const [localValue, setLocalValue] = useState(value);
  const debouncedValue = useDebounce(localValue, 300);

  useEffect(() => {
    onChange(debouncedValue);
  }, [debouncedValue]);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  return (
    <div className="search-bar">
      <HiOutlineSearch size={18} className="search-icon" />
      <input
        type="text"
        className="search-input"
        placeholder="Search tasks..."
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        id="search-input"
      />
      {localValue && (
        <button className="search-clear" onClick={() => setLocalValue('')} aria-label="Clear search">
          <HiX size={16} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
