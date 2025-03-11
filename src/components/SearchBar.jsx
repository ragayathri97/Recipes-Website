import React from 'react';

function SearchBar({ setSearchQuery }) {
  return (
    <div style={{ margin: '20px', textAlign: 'center',display: 'inline-block' }}>
      <input
        type="text"
        placeholder="Search term"
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ padding: '10px', width: '300px', border: '1px solid #ccc', borderRadius: '5px'}}
      />
    </div>
  );
}

export default SearchBar;