import React, { useState, useEffect, useRef } from "react";
import ButtonComp from "../../components/reusableComps/ButtonComp";
import dragIndicator from "../../assets/icons/dragIndicator.svg";
import locAdd from "../../assets/icons/locAdd.svg";
import { useNavigate } from "react-router-dom";
import SuccessConfirmationDialog from "../../components/reusableComps/SuccessConfirmationDialog";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { GOOGLE_MAPS_LOADER_CONFIG } from "../../config/googleMapsConfig";

// Default map center (London)
const mapCenter = { lat: 51.509865, lng: -0.118092 };

// Dummy pickup data
const arrDetails = [
  {
    storeName: "Store 1",
    tyreCount: 30,
    address: "47 Baker Street, London, W1U 8ED",
    type: "Standard",
    position: { lat: 51.5225, lng: -0.1571 },
  },
  {
    storeName: "Store 2",
    tyreCount: 50,
    address: "12 High Street, Manchester, M1 4AB",
    type: "Ad-hoc",
    position: { lat: 53.4808, lng: -2.2426 },
  },
  {
    storeName: "Store 3",
    tyreCount: 30,
    address: "88 King's Road, Birmingham, B15 2TH",
    type: "Express",
    position: { lat: 52.4539, lng: -1.9372 },
  },
];

const ManageScheduleAssign = () => {
  const [successOpen, setSuccessOpen] = useState(false);
  const navigate = useNavigate();
  const mapRef = useRef(null);

  //  Load Google Maps JS API using global config
  const { isLoaded } = useJsApiLoader(GOOGLE_MAPS_LOADER_CONFIG);

  const handleBack = () => navigate("/pickups/manage");
  const handleAssign = () => setSuccessOpen(true);
  const handleSuccessConfirm = () => navigate("/pickups/drivertracking");

  //  Add Advanced Markers when map is ready
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    (async () => {
      const { AdvancedMarkerElement } = await window.google.maps.importLibrary(
        "marker"
      );

      // Clear old markers if any
      mapRef.current.advancedMarkers?.forEach((marker) => (marker.map = null));
      mapRef.current.advancedMarkers = [];

      const bounds = new window.google.maps.LatLngBounds();

      arrDetails.forEach((d, idx) => {
        const markerLabel = document.createElement("div");
        markerLabel.style.background = "#003B36";
        markerLabel.style.color = "white";
        markerLabel.style.padding = "4px 8px";
        markerLabel.style.borderRadius = "4px";
        markerLabel.style.fontSize = "12px";
        markerLabel.textContent = `${idx + 1}`;

        const marker = new AdvancedMarkerElement({
          map: mapRef.current,
          position: d.position,
          title: d.storeName,
          content: markerLabel,
        });

        mapRef.current.advancedMarkers.push(marker);
        bounds.extend(d.position);
      });

      // Fit map to markers if multiple
      if (arrDetails.length > 1) {
        mapRef.current.fitBounds(bounds, {
          top: 50,
          right: 50,
          bottom: 50,
          left: 50,
        });
      }
    })();
  }, [isLoaded]);

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-5 lg:gap-8 w-full">
        {/* LEFT SECTION - Driver Info & Cards */}
        <div className="flex flex-col gap-5 w-full lg:max-w-[520px]">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-5">
            <p className="text-base md:text-lg font-normal text-[#012622]">
              Driver: John Smith
            </p>
            <div className="flex flex-col sm:flex-row sm:gap-6 text-sm md:text-base text-[#012622]">
              <p>Max. Tyre Capacity: 150</p>
              <p>Selected tyre count: 110</p>
            </div>
          </div>

          {/* Store Cards */}
          <div className="flex flex-col gap-4">
            {arrDetails.map((singleCard, index) => (
              <div
                key={index}
                className="flex items-start gap-3 w-full max-w-full"
              >
                <img
                  src={dragIndicator}
                  alt="drag indicator"
                  className="w-5 h-5 md:w-6 md:h-6 mt-3 flex-shrink-0 cursor-move"
                />

                <div className="flex flex-col rounded-[12px] w-full border border-[#D6D7DB] shadow-sm bg-white hover:shadow-md transition-shadow">
                  {/* Header */}
                  <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-2 p-4 pb-3 border-b border-gray-100">
                    <h6 className="text-base md:text-lg font-semibold text-[#012622]">
                      {singleCard.storeName}
                    </h6>
                    <div className="text-[#3E4B5E] bg-[#EFF3F8] text-center rounded-md px-3 py-1 text-xs md:text-sm font-medium whitespace-nowrap">
                      {singleCard.type}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="flex flex-col gap-2 p-4 pt-3">
                    <p className="text-sm md:text-base text-[#012622]">
                      {singleCard.tyreCount} Tyres to be picked-up
                    </p>
                    <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
                      <img
                        src={locAdd}
                        alt="location"
                        className="w-4 h-4 flex-shrink-0"
                      />
                      <span className="break-words">{singleCard.address}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4 mt-2">
            <ButtonComp
              variant="outlined"
              sx={{
                width: { xs: "100%", sm: "auto" },
                minWidth: { sm: "108px" },
                height: { xs: "50px", md: "60px" },
                fontSize: { xs: "14px", md: "16px" },
                borderRadius: "6px",
              }}
              onClick={handleBack}
            >
              Back
            </ButtonComp>

            <ButtonComp
              variant="contained"
              sx={{
                width: { xs: "100%", sm: "auto" },
                minWidth: { sm: "108px" },
                height: { xs: "50px", md: "60px" },
                fontSize: { xs: "14px", md: "16px" },
                borderRadius: "6px",
              }}
              onClick={handleAssign}
            >
              Assign
            </ButtonComp>
          </div>
        </div>

        {/* RIGHT SECTION - Google Map */}
        <div className="w-full lg:flex-1 mt-5 lg:mt-0 flex flex-col">
          {isLoaded ? (
            <div className="relative w-full h-[400px] lg:h-[693px] rounded-lg overflow-hidden shadow-md">
              <GoogleMap
                onLoad={(map) => (mapRef.current = map)}
                mapContainerClassName="absolute inset-0 w-full h-full rounded-lg"
                center={mapCenter}
                zoom={6}
                options={{
                  mapTypeControl: false,
                  streetViewControl: false,
                  fullscreenControl: false,
                  zoomControl: true,
                }}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center w-full h-[400px] rounded-lg bg-gray-100 text-gray-500">
              Loading map...
            </div>
          )}
        </div>
      </div>

      {/* SUCCESS DIALOG */}
      <SuccessConfirmationDialog
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        title="Driver Assigned!"
        message="Driver has been successfully assigned to the selected pickups."
        buttonText="OK"
        onConfirm={handleSuccessConfirm}
      />
    </>
  );
};

export default ManageScheduleAssign;
