import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-green-800 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold">BioLoop</span>
        </div>
        <div className="flex space-x-4">
          <Link 
            to="/add-plant" 
            className="px-4 py-2 bg-white text-green-800 rounded hover:bg-gray-100 transition"
          >
            Add Biogas Plant
          </Link>
          <Link 
            to="/log-waste" 
            className="px-4 py-2 bg-white text-green-800 rounded hover:bg-gray-100 transition"
          >
            Log Waste
          </Link>
          <Link 
            to="/match-waste" 
            className="px-4 py-2 bg-white text-green-800 rounded hover:bg-gray-100 transition"
          >
            Match Waste
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;