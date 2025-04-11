import React, { useState, useEffect, useRef } from "react";
import { db } from "../firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
import MapComponent from "./mapComponent";
import { Chart } from "chart.js/auto";

const MatchWasteForm = () => {
  const [wasteEntries, setWasteEntries] = useState([]);
  const [plants, setPlants] = useState([]);
  const [selectedWaste, setSelectedWaste] = useState("");
  const [matches, setMatches] = useState([]);
  const [totalEnergy, setTotalEnergy] = useState(0);
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const [wasteSnapshot, plantsSnapshot] = await Promise.all([
        getDocs(collection(db, "waste")),
        getDocs(collection(db, "plants"))
      ]);
      
      setWasteEntries(wasteSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setPlants(plantsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchData();

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  const calculateEnergy = (quantity) => quantity * 0.5;

  const findMatches = async () => {
    if (!selectedWaste) {
      alert("Please select a waste entry");
      return;
    }

    const waste = wasteEntries.find(w => w.id === selectedWaste);
    if (!waste) return;

    const suitablePlants = plants.filter(plant => 
      plant.location === waste.location && 
      plant.capacity >= waste.quantity
    );

    const newMatches = suitablePlants.map(plant => ({
      wasteId: waste.id,
      plantId: plant.id,
      wasteData: waste,
      plantData: plant,
      energy: calculateEnergy(waste.quantity),
      matchedAt: new Date()
    }));

    setMatches(newMatches);
    setTotalEnergy(newMatches.reduce((sum, match) => sum + match.energy, 0));

    await Promise.all(
      newMatches.map(match => 
        addDoc(collection(db, "matches"), match)
      )
    );

    renderChart(newMatches);
  };

  const renderChart = (matchesData) => {
    const ctx = document.getElementById('energyChart');
    
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: matchesData.map((_, i) => `Match ${i+1}`),
        datasets: [{
          label: 'Energy Generated (kWh)',
          data: matchesData.map(m => m.energy),
          backgroundColor: 'rgba(75, 192, 192, 0.6)'
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-green-800 mb-6">Match Waste to Plants</h2>
        
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Select Waste Entry</label>
          <select
            value={selectedWaste}
            onChange={(e) => setSelectedWaste(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">-- Select Waste --</option>
            {wasteEntries.map(waste => (
              <option key={waste.id} value={waste.id}>
                {waste.type} ({waste.quantity}kg) - {waste.location}
              </option>
            ))}
          </select>
        </div>

        <button 
          onClick={findMatches}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mb-6"
        >
          Find Matching Plants
        </button>

        {matches.length > 0 && (
          <div>
            <h3 className="font-bold text-lg mb-4">
              Total Energy Potential: {totalEnergy.toFixed(2)} kWh
            </h3>
            
            <div className="mb-6" style={{ position: 'relative', height: '200px', width: '100%' }}>
              <canvas id="energyChart"></canvas>
            </div>

            <h4 className="font-bold mb-2">Matches Found ({matches.length}):</h4>
            <ul className="space-y-4">
              {matches.map((match, index) => (
                <li key={index} className="p-4 bg-gray-50 rounded-lg border">
                  <p className="font-semibold">{match.plantData.name}</p>
                  <p>Location: {match.plantData.location}</p>
                  <p>Capacity: {match.plantData.capacity} kg/day</p>
                  <p className="text-green-600 font-medium">
                    Energy: {match.energy.toFixed(2)} kWh from {match.wasteData.quantity}kg waste
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold text-green-800 mb-4">Matched Locations</h3>
        <div className="h-96">
          <MapComponent matches={matches} />
        </div>
      </div>
    </div>
  );
};

export default MatchWasteForm;