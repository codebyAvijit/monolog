import React from "react";
import ButtonComp from "../../components/reusableComps/ButtonComp";
import dragIndicator from "../../assets/icons/dragIndicator.svg";
import locAdd from "../../assets/icons/locAdd.svg";
import sampleMap from "../../assets/images/sampleMap.jpg";
import { useNavigate } from "react-router-dom";

const arrDetails = [
  {
    storeName: "Store 1",
    tyreCount: 30,
    address: "47 Baker Street, London, W1U 8ED",
    type: "Standard",
  },
  {
    storeName: "Store 2",
    tyreCount: 50,
    address: "12 High Street, Manchester, M1 4AB",
    type: "Ad-hoc",
  },
  {
    storeName: "Store 3",
    tyreCount: 30,
    address: "88 King's Road, Birmingham, B15 2TH",
    type: "Express",
  },
];

const ManageScheduleAssign = ({ onBack }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/pickups/manage");
  };

  const handleAssign = (e) => {
    console.log("Successfully Assigned");
    alert("Successfully Assigned");
    navigate("/pickups/drivertracking");
  };

  return (
    <div className="flex flex-col lg:flex-row gap-5 lg:gap-8 w-full">
      {/* Left Section - Driver Info & Cards */}
      <div className="flex flex-col gap-5 w-full lg:max-w-[520px]">
        {/* Driver Info Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-5">
          <p className="text-base md:text-lg font-normal text-[#012622]">
            Driver: John Smith
          </p>
          <div className="flex flex-col sm:flex-row sm:gap-6 text-sm md:text-base text-[#012622]">
            <p>Max. Tyre Capacity: 150</p>
            <p>Selected tyre count: 110</p>
          </div>
        </div>

        {/* Dynamic Store Cards */}
        <div className="flex flex-col gap-4">
          {arrDetails.map((singleCard, index) => (
            <div key={index} className="flex items-start gap-3 w-full">
              {/* Drag Indicator */}
              <img
                src={dragIndicator}
                alt="drag indicator"
                className="w-5 h-5 md:w-6 md:h-6 mt-3 flex-shrink-0 cursor-move"
              />

              {/* Card Content */}
              <div className="flex flex-col rounded-[12px] w-full border border-[#D6D7DB] shadow-sm bg-white hover:shadow-md transition-shadow">
                {/* Card Header - Store Name & Type Badge */}
                <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-2 p-4 pb-3 border-b border-gray-100">
                  <h6 className="text-base md:text-lg font-semibold text-[#012622]">
                    {singleCard.storeName}
                  </h6>
                  <div className="text-[#3E4B5E] bg-[#EFF3F8] text-center rounded-md px-3 py-1 text-xs md:text-sm font-medium whitespace-nowrap">
                    {singleCard.type}
                  </div>
                </div>

                {/* Card Body - Tyre Count & Address */}
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

      {/* Right Section - Map */}
      <div className="w-full lg:flex-1 mt-5 lg:mt-0">
        <img
          src={sampleMap}
          alt="Map"
          className="w-full h-full min-h-[400px] lg:min-h-[600px] rounded-lg shadow-md object-cover"
        />
      </div>
    </div>
  );
};

export default ManageScheduleAssign;
