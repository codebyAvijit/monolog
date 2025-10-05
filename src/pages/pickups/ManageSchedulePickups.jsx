import React, { useState } from "react";
import DatePickerComp from "../../components/reusableComps/DatePickerComp";
import SelectMenuComp from "../../components/reusableComps/SelectMenuComp";
import ButtonComp from "../../components/reusableComps/ButtonComp";
import DriverTableDataComp from "../../components/reusableComps/DriverTableDataComp";

const ManageSchedulePickups = () => {
  const [filterPostcodes, setFilterPostcodes] = useState("");

  const [filterRequestType, setFilterRequestType] = useState("");
  const [filterStore, setFilterStore] = useState("");

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

  return (
    <>
      <div className="flex flex-wrap flex-col xl:flex-row gap-5">
        <DatePickerComp isActive label="Pick-up Date" />
        <SelectMenuComp
          label="Postcodes"
          value={filterPostcodes}
          onChange={(e) => {
            setFilterPostcodes(e.target.value);
          }}
          options={[
            { value: "all", label: "All" },
            { value: "10011", label: "10011" },
            { value: "10012", label: "10012" },
          ]}
        />
        <SelectMenuComp
          label="Request Type"
          value={filterRequestType}
          onChange={(e) => {
            setFilterRequestType(e.target.value);
          }}
          options={[
            { value: "all", label: "All" },
            { value: "standard", label: "Standard" },
            { value: "express", label: "Express" },
          ]}
        />
        <SelectMenuComp
          label="Store"
          value={filterStore}
          onChange={(e) => {
            setFilterStore(e.target.value);
          }}
          options={[
            { value: "all", label: "All" },
            { value: "store1", label: "Store 1" },
            { value: "store2", label: "Store 2" },
          ]}
        />
      </div>
      <div className="mt-5">
        <DriverTableDataComp requests={driverRequests} />
      </div>
      <div className="mt-5 text-center">
        <ButtonComp
          sx={{
            width: "114px",
            borderRadius: "6px",
          }}
        >
          Next
        </ButtonComp>
      </div>
    </>
  );
};

export default ManageSchedulePickups;
