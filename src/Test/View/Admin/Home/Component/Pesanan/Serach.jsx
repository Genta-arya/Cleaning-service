import React, { useState } from "react";

const SearchOrders = ({ onSearch }) => {
  const [searchUsername, setSearchUsername] = useState("");

  const handleSearch = () => {
    // Call the onSearch prop with the current searchUsername
    onSearch(searchUsername);
  };

  return (
    <div className="flex items-center mt-4">
      <input
        type="text"
        placeholder="Search by username..."
        value={searchUsername}
        onChange={(e) => setSearchUsername(e.target.value)}
        className="border p-2 rounded focus:outline-none focus:border-blue-500 flex-grow mr-2"
      />
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue"
        onClick={handleSearch}
      >
        Search
      </button>
    </div>
  );
};

export default SearchOrders;
