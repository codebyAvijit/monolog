import React, { useState } from "react";
import DatePickerComp from "../../components/reusableComps/DatePickerComp";
import SelectMenuComp from "../../components/reusableComps/SelectMenuComp";
import ButtonComp from "../../components/reusableComps/ButtonComp";
import DriverTableDataComp from "../../components/reusableComps/DriverTableDataComp";
import ManageScheduleAssign from "./ManageScheduleAssign";
import { Navigate, useNavigate } from "react-router-dom";

const ManageSchedulePickups = () => {
  const [filterPostcodes, setFilterPostcodes] = useState("");
  const [filterRequestType, setFilterRequestType] = useState("");
  const [filterStore, setFilterStore] = useState("");

  const navigate = useNavigate();

  //state to render component when next button is clicked

  // const [isNextClicked, setIsNextClicked] = useState(false);

  const driverRequests = [
    {
      driverId: 1,
      driverName: "John Smith (0 Pick-ups)",
      vehicleName: "Scania R450",
      maxCapacity: 150,
      selectedTyres: 110,
      requestId: "REQ-1001",
      store: "Store 1",
      pickupLocation: "47 Baker Street, London, W1U 8ED",
      pickupDateTime: "05/09/2025, 10:30 AM",
      requestType: "Standard",
      tyres: 30,
    },
    {
      driverId: 2,
      driverName: "Adam (0 Pick-ups)",
      vehicleName: "Scania R450",
      maxCapacity: 150,
      selectedTyres: 50,
      requestId: "REQ-1002",
      store: "Store 2",
      pickupLocation: "12 High Street, Manchester, M1 4AB",
      pickupDateTime: "04/08/2025, 02:00 PM",
      requestType: "Ad-hoc",
      tyres: 50,
    },
    // {
    //   driverId: 2,
    //   driverName: "Adam (0 Pick-ups)",
    //   vehicleName: "Scania R450",
    //   maxCapacity: 150,
    //   selectedTyres: 50,
    //   requestId: "REQ-1003",
    //   store: "Store 3",
    //   pickupLocation: "88 King's Road, Birmingham, B15 2TH",
    //   pickupDateTime: "03/07/2025, 09:00 AM",
    //   requestType: "Express",
    //   tyres: 30,
    // },
    // {
    //   driverId: 2,
    //   driverName: "Adam (0 Pick-ups)",
    //   vehicleName: "Scania R450",
    //   maxCapacity: 150,
    //   selectedTyres: 50,
    //   requestId: "REQ-1004",
    //   store: "Store 4",
    //   pickupLocation: "88 King's Road, Birmingham, B15 2TH",
    //   pickupDateTime: "03/07/2025, 10:00 AM",
    //   requestType: "Express",
    //   tyres: 50,
    // },
    {
      driverId: 3,
      driverName: "Smith (2 Pick-ups Today)",
      vehicleName: "Volvo FH16",
      maxCapacity: 180,
      selectedTyres: 90,
      requestId: "REQ-1003",
      store: "Store 3",
      pickupLocation: "88 King's Road, Birmingham, B15 2TH",
      pickupDateTime: "03/07/2025, 11:00 AM",
      requestType: "Express",
      tyres: 51,
    },
    {
      driverId: 4,
      driverName: "Emily John (1 Pick-ups)",
      vehicleName: "Scania R450",
      maxCapacity: 200,
      selectedTyres: 100,
      requestId: "REQ-1004",
      store: "Store 4",
      pickupLocation: "12 High Street, Manchester, M1 4AB",
      pickupDateTime: "04/08/2025, 02:00 PM",
      requestType: "Ad-hoc",
      tyres: 50,
    },
    {
      driverId: 5,
      driverName: "Michael (3 Pick-ups Today)",
      vehicleName: "Mercedes Actros",
      maxCapacity: 170,
      selectedTyres: 85,
      requestId: "REQ-1005",
      store: "Store 5",
      pickupLocation: "12 High Street, Manchester, M1 4AB",
      pickupDateTime: "04/08/2025, 02:00 PM",
      requestType: "Ad-hoc",
      tyres: 50,
    },
  ];

  const handleNext = () => {
    navigate("/pickups/assign");
  };

  return (
    <>
      {/* {!isNextClicked ? ( */}
      <>
        <div className="flex flex-wrap gap-4 w-full">
          <div className="w-full sm:w-[334px]">
            <DatePickerComp isActive label="Pick-up Date" />
          </div>
          <div className="w-full sm:w-[334px]">
            <SelectMenuComp
              label="Postcodes"
              value={filterPostcodes}
              onChange={(e) => setFilterPostcodes(e.target.value)}
              options={[
                { value: "all", label: "All" },
                { value: "10011", label: "10011" },
                { value: "10012", label: "10012" },
              ]}
            />
          </div>
          <div className="w-full sm:w-[334px]">
            <SelectMenuComp
              label="Request Type"
              value={filterRequestType}
              onChange={(e) => setFilterRequestType(e.target.value)}
              options={[
                { value: "all", label: "All" },
                { value: "standard", label: "Standard" },
                { value: "express", label: "Express" },
              ]}
            />
          </div>
          <div className="w-full sm:w-[334px]">
            <SelectMenuComp
              label="Store"
              value={filterStore}
              onChange={(e) => setFilterStore(e.target.value)}
              options={[
                { value: "all", label: "All" },
                { value: "store1", label: "Store 1" },
                { value: "store2", label: "Store 2" },
              ]}
            />
          </div>
        </div>

        <div className="mt-5">
          <DriverTableDataComp requests={driverRequests} />
        </div>

        <div className="mt-5 text-center">
          <ButtonComp
            sx={{ width: "114px", borderRadius: "6px" }}
            // onClick={() => setIsNextClicked(true)}
            onClick={handleNext}
          >
            Next
          </ButtonComp>
        </div>
      </>
      {/* ) : (
        <ManageScheduleAssign onBack={() => setIsNextClicked(false)} /> */}
      {/* )} */}
    </>
  );
};

export default ManageSchedulePickups;
