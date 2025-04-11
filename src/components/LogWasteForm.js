import React, { useState } from "react";
import { logWaste } from "../backend";

const LogWasteForm = ({ handleSubmit, waste, setWaste }) => {
    const handleChange = (e) => {
      setWaste({ ...waste, [e.target.name]: e.target.value });
    };

    return (
        <div className="max-w-md mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-bold text-green-800 mb-4">Log Your Waste</h2>
            <div>
              <label className="block text-gray-700 mb-1">Waste Type</label>
              <input
                type="text"
                name="type"
                placeholder="Vegetables, fruits, etc."
                value={waste.type}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Quantity (kg)</label>
              <input
                type="number"
                name="quantity"
                placeholder="Quantity in kilograms"
                value={waste.quantity}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Location</label>
              <input
                type="text"
                name="location"
                placeholder="Your location"
                value={waste.location}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
            >
              Log Waste
            </button>
          </form>
        </div>
      );
    };
    
    export default LogWasteForm;