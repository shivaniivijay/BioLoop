import React, { useState } from "react";
import { Routes, Route, Link } from 'react-router-dom';
import { FiTrash2, FiLink, FiActivity } from 'react-icons/fi';
import { db } from "./firebase";
import { useEffect } from "react";
import Navbar from './components/navbar';
import { collection, addDoc, getDocs } from "firebase/firestore";
import AddBiogasPlantForm from "./components/AddBiogasPlantForm";
import LogWasteForm from "./components/LogWasteForm";
import MatchWasteForm from "./components/MatchWasteForm";
import Dashboard from "./components/dashboard";
import MapComponent from "./components/mapComponent";
import EducationalContent from "./components/EducationalContent";
import Footer from "./components/Footer";

function App() {
  const [waste, setWaste] = useState({ type: "", quantity: 0, location: "" });
  const [matches, setMatches] = useState([]);
  const [energy, setEnergy] = useState(0);
  const [showEnergyMessage, setShowEnergyMessage] = useState(false);
  const [generatedEnergy, setGeneratedEnergy] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!waste.type || !waste.quantity || !waste.location) {
        alert("Please fill all fields");
        return;
      }
      
      const docRef = await addDoc(collection(db, "waste"), {
        ...waste,
        quantity: Number(waste.quantity),
        timestamp: new Date()
      });
      
      const energyValue = calculateEnergy(waste.quantity);  
      setGeneratedEnergy(energyValue); 
      setShowEnergyMessage(true);
      setTimeout(() => setShowEnergyMessage(false), 5000);
      
      setEnergy(prev => prev + energyValue); 
      setWaste({ type: "", quantity: 0, location: "" }); 
        findMatches(); 
    } catch (error) {
      console.error("Error logging waste: ", error);
    }
  };

  const calculateEnergy = (wasteQuantity) => wasteQuantity * 0.5;

  const findMatches = async () => {
    try {
      const [wasteSnapshot, plantSnapshot] = await Promise.all([
        getDocs(collection(db, "waste")),
        getDocs(collection(db, "plants"))
      ]);

      const newMatches = [];
      let matchEnergy = 0;

      wasteSnapshot.forEach((wasteDoc) => {
        const wasteData = wasteDoc.data();
        plantSnapshot.forEach((plantDoc) => {
          const plantData = plantDoc.data();
          
          if (plantData.location === wasteData.location && 
              plantData.capacity >= wasteData.quantity) {
            const energy = calculateEnergy(wasteData.quantity);
            newMatches.push({
              waste: wasteData,
              plant: plantData,
              energy: energy,
              plantId: plantDoc.id,
              wasteId: wasteDoc.id
            });
            matchEnergy += energy;
          }
        });
      });

      setMatches(newMatches);
      setEnergy(matchEnergy); 
      
      if (newMatches.length === 0) {
        alert("No matches found");
      }
    } catch (error) {
      console.error("Error matching waste:", error);
    }
  };

  const updateEnergy = async () => {
    try {
      const matchesSnapshot = await getDocs(collection(db, "matches"));
      let totalEnergy = 0;
      matchesSnapshot.forEach((doc) => {
        totalEnergy += doc.data().energy || 0;
      });
      setEnergy(totalEnergy);
    } catch (error) {
      console.error("Error updating energy:", error);
    }
  };

  
  async (e) => {
    e.preventDefault();
    await updateEnergy(); 
  };
  
  useEffect(() => {
    updateEnergy();
  }, []);

  const addTestData = async () => {
    try {
      await addDoc(collection(db, "plants"), {
        name: "Toronto Biogas Plant",
        location: "Toronto",
        capacity: 400
      });
      
      await addDoc(collection(db, "waste"), {
        type: "Peel waste",
        quantity: 40,
        location: "Toronto"
      });
      
      alert("Test data added successfully!");
    } catch (error) {
      console.error("Error adding test data: ", error);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-r from-green-100 to-blue-100 flex flex-col">
    <Navbar />
    <div className="container mx-auto p-4 flex-grow">
      {/* Keep only the Home button */}
      <div className="flex space-x-4 mb-4">
        <Link to="/" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Home
        </Link>
      </div>
        
        <Routes>
          <Route path="/add-plant" element={
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <AddBiogasPlantForm />
              <EducationalContent />
            </div>
          } />
          <Route path="/log-waste" element={
            <div>
              <LogWasteForm 
                handleSubmit={handleSubmit}
                waste={waste}
                setWaste={setWaste}
              />
              {showEnergyMessage && (
                <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                  <h3 className="font-bold">Great Job!</h3>
                  <p>You've generated approximately {generatedEnergy} kWh of energy!</p>
                  <p>This could power a light bulb for {Math.round(generatedEnergy * 10)} hours!</p>
                </div>
              )}
            </div>
          } />
          <Route path="/match-waste" element={
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <MatchWasteForm 
                findMatches={findMatches}
                matches={matches}
                energy={energy}
              />
              <MapComponent matches={matches} />
            </div>
          } />
          <Route path="/dashboard" element={
            <Dashboard 
              energy={energy}
              addTestData={addTestData}
            />
          } />
          <Route path="/education" element={<EducationalContent />} />
          <Route path="/" element={
            <div className="max-w-6xl mx-auto px-4 py-8">
              {/* Hero Section */}
              <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-xl shadow-xl p-8 mb-12 text-white text-center">
                <h1 className="text-4xl font-bold mb-4">Transform Waste into Energy</h1>
                <p className="text-xl mb-6 max-w-2xl mx-auto">
                  Join our network to convert your organic waste into renewable biogas energy
                </p>
                <div className="flex justify-center space-x-4">
                  <Link 
                    to="/log-waste" 
                    className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
                  >
                    Get Started
                  </Link>
                  <Link 
                    to="/education" 
                    className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:bg-opacity-10 transition"
                  >
                    Learn More
                  </Link>
                </div>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition border border-gray-100">
                  <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <FiTrash2 className="text-green-600 text-xl" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Log Waste</h3>
                  <p className="text-gray-600">
                    Easily record your food waste with our simple tracking system
                  </p>
                  <Link to="/log-waste" className="text-green-600 font-medium mt-3 inline-block hover:underline">
                    Start logging →
                  </Link>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition border border-gray-100">
                  <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <FiLink className="text-blue-600 text-xl" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Smart Matching</h3>
                  <p className="text-gray-600">
                    Our system automatically connects you with nearby biogas plants
                  </p>
                  <Link to="/match-waste" className="text-blue-600 font-medium mt-3 inline-block hover:underline">
                    Find matches →
                  </Link>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition border border-gray-100">
                  <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <FiActivity className="text-purple-600 text-xl" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Track Impact</h3>
                  <p className="text-gray-600">
                    See exactly how much energy you're generating from your waste
                  </p>
                  <Link to="/dashboard" className="text-purple-600 font-medium mt-3 inline-block hover:underline">
                    View dashboard →
                  </Link>
                </div>
              </div>

              {}
              <div className="bg-green-50 rounded-xl p-8 mb-12">
                <h2 className="text-2xl font-semibold text-center mb-8">Our Collective Impact</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-lg text-center shadow-sm">
                    <div className="text-3xl font-bold text-green-600 mb-2">{Math.round(energy)}</div>
                    <div className="text-gray-600">kWh Generated</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg text-center shadow-sm">
                    <div className="text-3xl font-bold text-green-600 mb-2">{Math.round(energy * 2)}</div>
                    <div className="text-gray-600">kg Waste Processed</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg text-center shadow-sm">
                    <div className="text-3xl font-bold text-green-600 mb-2">{Math.round(energy/10)}</div>
                    <div className="text-gray-600">Plants Active</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg text-center shadow-sm">
                    <div className="text-3xl font-bold text-green-600 mb-2">{Math.round(energy/5)}</div>
                    <div className="text-gray-600">Participants</div>
                  </div>
                </div>
              </div>
            </div>
          } />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;