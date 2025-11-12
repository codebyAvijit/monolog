import React, { useEffect, useState, useRef } from "react";
import infoIcon from "../../assets/icons/info.svg";
import searchIcon from "../../assets/icons/search.svg";
import redFlagIcon from "../../assets/icons/redFlag.svg";
import locAdd from "../../assets/icons/locAdd.svg";
import safety from "../../assets/images/safety.jpg";
import sendIcon from "../../assets/icons/send.svg";
import timerClock from "../../assets/icons/timerClock.svg";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { GOOGLE_MAPS_LOADER_CONFIG } from "../../config/googleMapsConfig";

const DriverTracking = () => {
  const [search, setSearch] = useState("");
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isFlagActivated, setIsFlagActivated] = useState(false);
  const [isFlagSafetyClicked, setIsFlagSafetyClicked] = useState(false);
  const [activeTab, setActiveTab] = useState("Store 1");
  const [messages, setMessages] = useState(
    JSON.parse(localStorage.getItem("chatMessages")) || {}
  );
  const [newMessage, setNewMessage] = useState("");

  const mapRef = useRef(null);
  const mapCenter = { lat: 51.509865, lng: -0.118092 }; // London

  //  Load Google Maps JS API from centralized config
  const { isLoaded } = useJsApiLoader(GOOGLE_MAPS_LOADER_CONFIG);

  const driverDetails = [
    {
      driverName: "John Smith (0 Pick-ups)",
      maxCapacity: 150,
      selectedTyres: 110,
      isFlagActivated: true,
    },
    {
      driverName: "David Miller (1 Pick-up)",
      maxCapacity: 120,
      selectedTyres: 80,
      isFlagActivated: true,
    },
    {
      driverName: "Robert Brown (2 Pick-ups)",
      maxCapacity: 160,
      selectedTyres: 120,
      isFlagActivated: false,
    },
    {
      driverName: "Sam Johnson (1 Pick-up)",
      maxCapacity: 140,
      selectedTyres: 95,
      isFlagActivated: false,
    },
    {
      driverName: "Liam Davis (0 Pick-ups)",
      maxCapacity: 100,
      selectedTyres: 60,
      isFlagActivated: false,
    },
  ];

  const tripDetails = [
    {
      storeName: "Store 1",
      requestType: "Standard",
      status: "Completed",
      payment: "£29.99",
      tyreCount: 30,
      address: "47 Baker Street, London, W1U 8ED",
      position: { lat: 51.5225, lng: -0.1571 },
    },
    {
      storeName: "Store 2",
      requestType: "Ad-hoc",
      status: "En-route",
      tyreCount: 50,
      address: "12 High Street, Manchester, M1 4AB",
      position: { lat: 53.4808, lng: -2.2426 },
    },
    {
      storeName: "Store 3",
      requestType: "Express",
      status: "Scheduled",
      tyreCount: 100,
      address: "88 King's Road, Birmingham, B15 2TH",
      position: { lat: 52.4539, lng: -1.9372 },
    },
  ];

  const tabs = [
    { name: "Store 1", path: "store1" },
    { name: "Store 2", path: "store2" },
    { name: "Store 3", path: "store3" },
  ];

  const requestTypeStyles = {
    Standard: "bg-[#EFF3F8] text-[#3E4B5E]",
    Express: "bg-[#EFF3F8] text-[#3E4B5E]",
    "Ad-hoc": "bg-[#EFF3F8] text-[#3E4B5E]",
  };

  const requestStatusType = {
    Completed: "bg-[#D7FCE3] text-[#157535]",
    Scheduled: "bg-[#DBF0FE] text-[#0C6199]",
    "En-route": "bg-[#DBF0FE] text-[#0C6199]",
  };

  const cardBgStyles = {
    Completed: "bg-[#F6FFF9]",
    Scheduled: "bg-[#F9FBFD]",
    "En-route": "bg-[#FFFFFF]",
  };

  // 💬 Chat handling
  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    setMessages((prev) => ({
      ...prev,
      [activeTab]: [...(prev[activeTab] || []), newMessage],
    }));
    setNewMessage("");
  };

  // 🔍 Filter Drivers
  const filteredDrivers = driverDetails.filter((driver) => {
    const matchesSearch = driver.driverName
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesFlag = !isFlagActivated || driver.isFlagActivated;
    return matchesSearch && matchesFlag;
  });

  //  Add Advanced Markers once map is loaded
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    (async () => {
      const { AdvancedMarkerElement } = await window.google.maps.importLibrary(
        "marker"
      );

      tripDetails.forEach((trip, idx) => {
        const markerLabel = document.createElement("div");
        markerLabel.style.background = "#003B36";
        markerLabel.style.color = "white";
        markerLabel.style.padding = "4px 8px";
        markerLabel.style.borderRadius = "4px";
        markerLabel.style.fontSize = "12px";
        markerLabel.textContent = `${idx + 1}`;

        new AdvancedMarkerElement({
          map: mapRef.current,
          position: trip.position,
          title: trip.storeName,
          content: markerLabel,
        });
      });
    })();
  }, [isLoaded]);

  return (
    <div className="flex flex-col xl:flex-row gap-5">
      {/* LEFT PANEL */}
      <div className="flex flex-col gap-5 w-full xl:w-auto">
        {/* Driver List */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 w-full xl:w-[326px]">
          <div className="flex items-center mb-3 gap-2">
            <input
              type="checkbox"
              id="flag"
              className="w-4 h-4 accent-[#012622]"
              checked={isFlagActivated}
              onChange={(e) => setIsFlagActivated(e.target.checked)}
            />
            <label htmlFor="flag" className="text-sm text-gray-700">
              Flag / Safety Stop
            </label>
          </div>

          {/* Search Bar */}
          <div className="flex items-center bg-[#F5F5F5] rounded-md px-2 mb-4">
            <input
              type="search"
              placeholder="Search Driver..."
              className="w-full bg-transparent py-2 text-sm outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <img src={searchIcon} alt="search" className="w-4 h-4" />
          </div>

          {/* Driver List Items */}
          <div className="flex flex-col gap-3 max-h-[340px] overflow-y-auto pr-1">
            {filteredDrivers.map((driver, index) => (
              <div
                key={index}
                className="flex justify-between items-center hover:bg-[#F5F5F5] transition-all rounded-md p-2"
              >
                <div className="flex items-center gap-2">
                  <input type="radio" name="driver" />
                  <div>
                    <p className="text-[13px] font-medium text-gray-800">
                      {driver.driverName}
                    </p>
                    <p className="text-[11px] text-gray-500">
                      Max Cap: {driver.maxCapacity}
                    </p>
                    <p className="text-[11px] text-gray-500">
                      Selected Tyres: {driver.selectedTyres}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <img
                    src={infoIcon}
                    alt="info"
                    className="w-4 h-4 cursor-pointer"
                  />
                  {driver.isFlagActivated && (
                    <img
                      src={redFlagIcon}
                      alt="flag"
                      className="w-4 h-4 cursor-pointer"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Safety Panel */}
        <div className="w-full xl:w-[326px] min-h-[303px] flex flex-col border border-gray-200 rounded-2xl bg-white shadow-sm">
          <p className="text-lg md:text-[20px] mt-5 ml-5 text-[#012622] font-semibold">
            Flag/Safety Stop
          </p>
          <div className="flex items-center justify-center flex-1 p-4">
            {isFlagSafetyClicked ? (
              <div className="flex flex-col justify-center items-center gap-4 text-center">
                <img
                  src={timerClock}
                  className="w-[100px] h-[83px] md:w-[142px] md:h-[118px]"
                  alt="timer-clock"
                />
                <p className="text-sm text-gray-700 px-2">
                  Reason: Lorem ipsum dolor sit amet consectetur. Diam velit
                  gravida tempus dui convallis dui id nam amet. At in imperdiet
                  neque vulputate a augue.
                </p>
              </div>
            ) : (
              <img
                src={safety}
                className="w-[100px] h-[83px] md:w-[142px] md:h-[118px]"
                alt="Safety"
              />
            )}
          </div>
        </div>
      </div>

      {/* MIDDLE PANEL - Map + Trips */}
      <div className="flex flex-col w-full xl:flex-1">
        {/* Google Map */}
        <div className="relative w-full h-[300px] md:h-[433px] rounded-2xl overflow-hidden shadow-sm">
          {isLoaded ? (
            <GoogleMap
              onLoad={(map) => (mapRef.current = map)}
              mapContainerClassName="absolute inset-0 w-full h-full rounded-2xl"
              center={mapCenter}
              zoom={6}
              options={{
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: false,
              }}
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-gray-100 text-gray-500">
              Loading map...
            </div>
          )}
        </div>

        {/* Trip Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-11.5">
          {tripDetails.map((trip, index) => (
            <div
              key={index}
              className={`${cardBgStyles[trip.status] || "bg-white"} 
                rounded-[12px] border border-[#D6D7DB] shadow-sm relative`}
            >
              <div className="flex flex-wrap justify-between items-center gap-2 p-3">
                <h6 className="font-semibold text-[#012622] text-sm md:text-base">
                  {trip.storeName}
                </h6>
                <div className="flex items-center gap-2 flex-wrap">
                  <p
                    className={`${
                      requestTypeStyles[trip.requestType] || "bg-gray-100"
                    } px-3 py-1 rounded-md text-xs font-medium`}
                  >
                    {trip.requestType}
                  </p>
                  <div
                    className={`${
                      requestStatusType[trip.status] || "bg-[#EFF3F8]"
                    } text-center rounded-[30px] px-3 py-1 text-xs font-medium`}
                  >
                    {trip.status}
                  </div>

                  {/* Tooltip */}
                  {trip.status === "Completed" && (
                    <div
                      className="relative"
                      onMouseEnter={() => setHoveredCard(index)}
                      onMouseLeave={() => setHoveredCard(null)}
                    >
                      <img
                        src={infoIcon}
                        className="w-4 h-4 cursor-pointer"
                        alt="Info"
                      />
                      {hoveredCard === index && (
                        <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 rounded-lg w-[199px] p-4 bg-white shadow-lg z-50 text-[12px] text-gray-700 flex flex-col justify-center items-center gap-2 before:content-[''] before:absolute before:top-full before:left-1/2 before:-translate-x-1/2 before:border-8 before:border-transparent before:border-t-white">
                          <p>Tyres: {trip.tyreCount}</p>
                          <p>Payment: {trip.payment}</p>
                          <p className="underline cursor-pointer">
                            View Invoice
                          </p>
                          <p className="underline cursor-pointer">View WTN</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <p className="px-3 pb-2 text-sm text-gray-700">
                {trip.tyreCount} Tyres to be picked up
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-600 px-3 pb-3">
                <img src={locAdd} alt="location" className="w-4 h-4" />
                <span className="break-words">{trip.address}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL - Chat Section */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 flex flex-col w-full xl:w-[400px] 2xl:w-[600px] h-[600px] xl:h-[811px]">
        <div className="flex gap-6 md:gap-12 border-b mb-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`pb-2 text-sm font-semibold whitespace-nowrap ${
                activeTab === tab.name
                  ? "text-[#E98A15] border-b-2 border-[#E98A15]"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto border border-gray-200 rounded-lg p-3 space-y-2">
          {messages[activeTab]?.length ? (
            messages[activeTab].map((msg, idx) => (
              <p
                key={idx}
                className="text-sm bg-[#F5F5F5] p-2 rounded-md text-gray-700 w-fit max-w-[90%] break-words"
              >
                {msg}
              </p>
            ))
          ) : (
            <p className="text-sm text-gray-500">
              No active chats for {activeTab}
            </p>
          )}
        </div>

        {/* Input */}
        <div className="mt-3 flex items-center border border-gray-300 rounded-lg px-3 py-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 text-sm outline-none"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button onClick={handleSend} className="ml-2 flex-shrink-0">
            <img src={sendIcon} alt="Send" className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DriverTracking;
