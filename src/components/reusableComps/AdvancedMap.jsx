import React, { useEffect, useRef } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { GOOGLE_MAPS_LOADER_CONFIG } from "../../config/googleMapsConfig";

// Default map settings
const MAP_CENTER = { lat: 51.509865, lng: -0.118092 }; // London
const CONTAINER_CLASS = "absolute inset-0 w-full h-full rounded-2xl";

const AdvancedMap = ({
  tripDetails = [],
  heightClass = "h-[400px] lg:h-[693px]",
}) => {
  const mapRef = useRef(null);

  //  Use shared loader configuration (no performance warnings)
  const { isLoaded } = useJsApiLoader(GOOGLE_MAPS_LOADER_CONFIG);

  // Render advanced markers when map & API are ready
  useEffect(() => {
    if (!isLoaded || !mapRef.current || !tripDetails.length) return;

    (async () => {
      const { AdvancedMarkerElement } = await window.google.maps.importLibrary(
        "marker"
      );

      // Clear existing markers
      mapRef.current.advancedMarkers?.forEach((marker) => (marker.map = null));
      mapRef.current.advancedMarkers = [];

      const bounds = new window.google.maps.LatLngBounds();

      // Add new markers
      tripDetails.forEach((trip, idx) => {
        const markerLabel = document.createElement("div");
        markerLabel.style.background = "#003B36";
        markerLabel.style.color = "white";
        markerLabel.style.padding = "4px 8px";
        markerLabel.style.borderRadius = "4px";
        markerLabel.style.fontSize = "12px";
        markerLabel.textContent = `${idx + 1}`;

        const marker = new AdvancedMarkerElement({
          map: mapRef.current,
          position: trip.position,
          title: trip.storeName,
          content: markerLabel,
        });

        mapRef.current.advancedMarkers.push(marker);
        bounds.extend(trip.position);
      });

      // Auto-fit bounds if multiple markers
      if (tripDetails.length > 1) {
        mapRef.current.fitBounds(bounds, {
          top: 50,
          right: 50,
          bottom: 50,
          left: 50,
        });
      }
    })();
  }, [isLoaded, tripDetails]);

  //  Render Map
  return (
    <div
      className={`relative w-full ${heightClass} rounded-2xl overflow-hidden shadow-sm`}
    >
      {isLoaded ? (
        <GoogleMap
          onLoad={(map) => (mapRef.current = map)}
          mapContainerClassName={CONTAINER_CLASS}
          center={MAP_CENTER}
          zoom={6}
          options={{
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            zoomControl: true,
          }}
        />
      ) : (
        <div className="flex items-center justify-center w-full h-full bg-gray-100 text-gray-500">
          Loading map...
        </div>
      )}
    </div>
  );
};

export default AdvancedMap;
