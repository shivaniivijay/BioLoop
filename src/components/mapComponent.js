import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "12px",
};

const defaultCenter = {
  lat: 43.6532, 
  lng: -79.3832,
};

const MapComponent = ({ matches = [] }) => {
  const validMatches = matches
    .filter(match => match?.plantData && match?.wasteData)
    .map(match => ({
      plant: {
        id: match.plantId,
        name: match.plantData?.name || "Unknown Plant",
        location: match.plantData?.location || "Unknown Location",
        position: {
          lat: match.plantData?.lat || defaultCenter.lat + (Math.random() * 0.01 - 0.005),
          lng: match.plantData?.lng || defaultCenter.lng + (Math.random() * 0.01 - 0.005),
        }
      },
      waste: {
        id: match.wasteId,
        type: match.wasteData?.type || "Unknown Waste",
        position: {
          lat: match.wasteData?.lat || defaultCenter.lat + (Math.random() * 0.01 - 0.005),
          lng: match.wasteData?.lng || defaultCenter.lng + (Math.random() * 0.01 - 0.005),
        }
      }
    }));

  const bounds = validMatches.length > 0 ? new window.google.maps.LatLngBounds() : null;
  validMatches.forEach(match => {
    bounds?.extend(new window.google.maps.LatLng(match.plant.position.lat, match.plant.position.lng));
    bounds?.extend(new window.google.maps.LatLng(match.waste.position.lat, match.waste.position.lng));
  });

  return (
    <LoadScript googleMapsApiKey="AIzaSyC6zEw5FcdrW6na50JeUYVlYKDxxY5Rl94">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={validMatches.length ? 10 : 12}
        center={bounds ? undefined : defaultCenter}
        options={bounds ? {
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          ...(bounds && { bounds: bounds })
        } : {}}
      >
        {validMatches.map((match, index) => (
          <React.Fragment key={`match-${index}`}>
            {}
            <Marker
              position={match.plant.position}
              label={match.plant.name}
              icon={{
                url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png"
              }}
            />
            
            {/* Waste Marker (Blue) */}
            <Marker
              position={match.waste.position}
              label={`${match.waste.type} Waste`}
              icon={{
                url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
              }}
            />
          </React.Fragment>
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;