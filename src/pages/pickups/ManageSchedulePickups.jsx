import React, { useEffect, useState } from "react";
import DatePickerComp from "../../components/reusableComps/DatePickerComp";
import SelectMenuComp from "../../components/reusableComps/SelectMenuComp";
import ButtonComp from "../../components/reusableComps/ButtonComp";
import DriverTableDataComp from "../../components/reusableComps/DriverTableDataComp";
import { useDispatch, useSelector } from "react-redux";
import { fetchDriverListings } from "../../redux/driverListingSlice";
import { fetchRequestedPickups } from "../../redux/requestedPickupsSlice";
import { useNavigate } from "react-router-dom";

const ManageSchedulePickups = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [filterPostcodes, setFilterPostcodes] = useState("");
  const [filterRequestType, setFilterRequestType] = useState("");
  const [filterStore, setFilterStore] = useState("");
  const [selectedDriverId, setSelectedDriverId] = useState(null);
  const [driverAssignments, setDriverAssignments] = useState({});

  const { drivers, loading: driverLoading } = useSelector(
    (state) => state.driverListing
  );
  const { pickups, loading: pickupLoading } = useSelector(
    (state) => state.requestedPickups
  );

  useEffect(() => {
    dispatch(fetchDriverListings());
    dispatch(fetchRequestedPickups());
  }, [dispatch]);

  const isNextEnabled =
    selectedDriverId && driverAssignments[selectedDriverId]?.length > 0;

  const handleNext = () => {
    if (isNextEnabled) navigate("/pickups/assign");
  };

  return (
    <div className="w-full mx-auto max-w-[1800px] px-4 md:px-8">
      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-6 mb-4">
        <DatePickerComp label="Pick-up Date" isActive width="100%" />
        <SelectMenuComp
          label="Postcodes"
          value={filterPostcodes}
          onChange={(e) => setFilterPostcodes(e.target.value)}
          options={[{ value: "all", label: "All" }]}
        />
        <SelectMenuComp
          label="Request Type"
          value={filterRequestType}
          onChange={(e) => setFilterRequestType(e.target.value)}
          options={[
            { value: "all", label: "All" },
            { value: "standard", label: "Standard" },
            { value: "adhoc", label: "Ad-hoc" },
            { value: "express", label: "Express" },
          ]}
        />
        <SelectMenuComp
          label="Store"
          value={filterStore}
          onChange={(e) => setFilterStore(e.target.value)}
          options={[{ value: "all", label: "All" }]}
        />
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto rounded-lg bg-white border border-[#E5E7EB]">
        {driverLoading || pickupLoading ? (
          <div className="p-6 text-gray-600">Loading data...</div>
        ) : (
          <DriverTableDataComp
            drivers={drivers}         // driver metadata rows
            pickups={pickups}         // all pickup requests
            selectedDriverId={selectedDriverId}
            setSelectedDriverId={setSelectedDriverId}
            driverAssignments={driverAssignments}
            setDriverAssignments={setDriverAssignments}
          />
        )}
      </div>

      {/* Next Button */}
      <div className="mt-10 flex justify-center">
        <ButtonComp
          sx={{
            width: { xs: "100%", sm: "140px" },
            height: { xs: "48px", sm: "50px" },
            borderRadius: "6px",
            fontSize: { xs: "16px", sm: "16px" },
          }}
          onClick={handleNext}
          disabled={!isNextEnabled}
          className={!isNextEnabled ? "opacity-50 cursor-not-allowed" : ""}
        >
          Next
        </ButtonComp>
      </div>
    </div>
  );
};

export default ManageSchedulePickups;
