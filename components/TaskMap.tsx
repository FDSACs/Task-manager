import React from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '20px'
};

// Default location (e.g., Al Khobar, Saudi Arabia)
const center = {
  lat: 26.2172,
  lng: 50.1971
};

const TaskMap: React.FC = () => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "YOUR_FIREBASE_API_KEY" // Use the key from your firebase.ts
  });

  return isLoaded ? (
    <div className="shadow-xl rounded-3xl overflow-hidden border border-slate-200">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={12}
      >
        {/* This adds the red pin */}
        <Marker position={center} title="Task Location" />
      </GoogleMap>
    </div>
  ) : <div className="animate-pulse bg-slate-200 h-[400px] rounded-3xl" />;
}

