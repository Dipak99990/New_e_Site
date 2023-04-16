import React, { useState } from "react";
import Image from "next/image";
function SearchPage({ searchTerm, handleSearchChange }) {
  return (
    <div>
      <input
        type="text"
        className="bg-white outline-green-700 mx-3 rounded-md"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearchChange} // Update search term state on input change
      />
    </div>
  );
}

export default SearchPage;
