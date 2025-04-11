import React from "react";

const EducationalContent = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-green-800 mb-4">About Biogas</h2>
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">What is Biogas?</h3>
          <p className="text-gray-700">
            Biogas is a renewable energy source produced when organic matter breaks down in the absence of oxygen.
            It's primarily composed of methane and carbon dioxide.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Benefits</h3>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Reduces greenhouse gas emissions</li>
            <li>Produces renewable energy</li>
            <li>Creates nutrient-rich fertilizer as byproduct</li>
            <li>Reduces waste going to landfills</li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold">How It Works</h3>
          <p className="text-gray-700">
            Organic waste is fed into an anaerobic digester where bacteria break it down,
            producing biogas that can be used for heating, electricity, or vehicle fuel.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EducationalContent;