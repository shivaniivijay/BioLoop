import React from 'react';
import { Link } from 'react-router-dom';
import { FiActivity, FiPlusCircle, FiTrash2, FiLink } from 'react-icons/fi';

const Dashboard = ({ energy = 0 }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-xl shadow-xl p-8 mb-8 text-white">
        <h1 className="text-4xl font-bold mb-2">Welcome to BioLoop</h1>
        <p className="text-xl opacity-90">Transforming food waste into renewable energy</p>
      </div>

      {/* Energy Stats Card */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border-l-8 border-green-500">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-1">Total Energy Generated</h2>
            <p className="text-gray-600">From all matched waste</p>
          </div>
          <div className="text-5xl font-bold text-green-600 flex items-center">
            <FiActivity className="mr-3" />
            {energy.toFixed(2)} kWh
          </div>
        </div>
        <div className="mt-4 bg-gray-100 rounded-full h-4">
          <div 
            className="bg-green-500 h-4 rounded-full" 
            style={{ width: `${Math.min(100, energy/10)}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-500 mt-2 text-right">
          Equivalent to powering {Math.round(energy/0.5)} LED bulbs for 1 hour
        </p>
      </div>

      {/* Quick Actions */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link 
          to="/add-plant" 
          className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-green-200 group"
        >
          <div className="flex items-center mb-3">
            <div className="bg-green-100 p-3 rounded-full mr-4 group-hover:bg-green-200 transition">
              <FiPlusCircle className="text-green-600 text-xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Add Biogas Plant</h3>
          </div>
          <p className="text-gray-600">Register new biogas facilities in our network</p>
        </Link>
        
        <Link 
          to="/log-waste" 
          className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-200 group"
        >
          <div className="flex items-center mb-3">
            <div className="bg-blue-100 p-3 rounded-full mr-4 group-hover:bg-blue-200 transition">
              <FiTrash2 className="text-blue-600 text-xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Log Waste</h3>
          </div>
          <p className="text-gray-600">Record your organization's food waste</p>
        </Link>
        
        <Link 
          to="/match-waste" 
          className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-yellow-200 group"
        >
          <div className="flex items-center mb-3">
            <div className="bg-yellow-100 p-3 rounded-full mr-4 group-hover:bg-yellow-200 transition">
              <FiLink className="text-yellow-600 text-xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Match Waste</h3>
          </div>
          <p className="text-gray-600">Connect with nearby biogas plants</p>
        </Link>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <div className="bg-green-100 p-2 rounded-full mr-4">
              <FiActivity className="text-green-600" />
            </div>
            <div>
              <p className="font-medium">New waste match completed</p>
              <p className="text-sm text-gray-500">5 minutes ago</p>
            </div>
            <div className="ml-auto text-green-600 font-medium">+25 kWh</div>
          </div>
          {/* Add more activity items here */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;