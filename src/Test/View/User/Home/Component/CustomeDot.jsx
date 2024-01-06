import React from 'react';

const CustomDot = ({ onClick, index, active }) => (
  <button
    onClick={(event) => {
      event.preventDefault(); // Memastikan event ada sebelum menggunakan preventDefault
      onClick(event);
    }}
    className={`w-4 h-4 mx-2 rounded-full focus:outline-none ${
      active ? 'bg-white' : 'bg-gray-500'
    }`}
  />
);

export default CustomDot;
