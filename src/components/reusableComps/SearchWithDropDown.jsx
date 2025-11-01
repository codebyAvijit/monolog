import React, { useState, useEffect, useRef } from "react";
import SearchIcon from "@mui/icons-material/Search";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useDispatch } from "react-redux";
import { GetData } from "../../api/apiHelpers";
import { searchPostCodes } from "../../redux/postCodeSlice";

const SearchWithDropDown = ({
  value,
  onChange,
  error,
  helperText,
  existingPostCodes = [],
  defaultPostCodes = [], // pass from parent instead of reading Redux here
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState(value || "");
  const [options, setOptions] = useState([]);
  const containerRef = useRef(null);
  const debounceTimeout = useRef(null);
  const searchController = useRef(null);
  const snackbarTimeout = useRef(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  // Initialize options only once on mount or when existingPostCodes changes
  // useEffect to initialize options
  useEffect(() => {
    const filtered = defaultPostCodes

      .filter((p) => !existingPostCodes.includes(p.postCodeLocation))
      .slice(0, 4);
    // console.log("Filtered defaultPostCodes:", filtered);
    setOptions(filtered);
  }, [defaultPostCodes, existingPostCodes]); // no Redux inside

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showSnackbar = (message) => {
    setSnackbar({ open: true, message });
    if (snackbarTimeout.current) clearTimeout(snackbarTimeout.current);
    snackbarTimeout.current = setTimeout(() => {
      setSnackbar({ open: false, message: "" });
    }, 3000);
  };

  const handleSearch = async (query) => {
    if (!query.trim()) {
      showSnackbar("Please enter a postcode or location to search");
      return;
    }

    setLoading(true);
    try {
      const result = await GetData(`/postcodes/search/?q=${query}`);
      // console.log("Raw API result:", result);

      const existingCodes = existingPostCodes.map(
        (p) => p.postCodeLocation || p.postal_code
      );

      // Correctly access response data
      const items = Array.isArray(result?.data) ? result.data : [];

      const filtered = items
        .filter(
          (p) =>
            !existingCodes.includes(p.postal_code || p.postCodeLocation || "")
        )
        .map((item, index) => ({
          id: `${item.postal_code || item.postCodeLocation}-${index}`,
          postCodeLocation: item.postal_code || item.postCodeLocation || "",
          locationName: item.place_name || item.locationName || "",
        }));

      setOptions(filtered);

      if (filtered.length === 0) showSnackbar("No post code found");
      // console.log("Filtered results:", filtered);
    } catch (error) {
      console.error("Error during postcode search:", error);
      showSnackbar("Failed to fetch postcodes. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (item) => {
    setQuery(item.postCodeLocation);
    setIsOpen(false);
    if (onChange) {
      onChange({
        target: { name: "postCodeLocation", value: item.postCodeLocation },
      });
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-[334px] z-[1300]">
      <div
        className={`flex items-center border rounded-md bg-white px-3 py-2 h-[60px] transition-all ${
          error
            ? "border-[#d32f2f]"
            : "border-gray-300 focus-within:border-gray-500"
        }`}
      >
        <SearchIcon sx={{ fontSize: 20, color: "#6b7280", mr: 1 }} />
        <input
          type="text"
          placeholder="Search or select postcode..."
          value={query}
          onChange={(e) => {
            const value = e.target.value;
            setQuery(value);
            handleSearch(value);
          }}
          onFocus={() => setIsOpen(true)}
          className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-500 bg-transparent"
        />

        <ArrowDropDownIcon
          sx={{
            fontSize: 22,
            color: "#6b7280",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
            cursor: "pointer",
          }}
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>

      {error && (
        <p className="text-[#d32f2f] text-xs mt-1 ml-1">{helperText}</p>
      )}

      {isOpen && (
        <ul className="absolute top-[68px] left-0 w-full bg-white border border-gray-200 shadow-lg rounded-md max-h-35 overflow-auto z-[1500]">
          {options.length > 0 ? (
            options.map((item, index) => {
              const label = `${item.postCodeLocation}${
                item.locationName ? " - " + item.locationName : ""
              }`;

              return (
                <li
                  key={item.id || index}
                  onClick={() =>
                    handleSelect({
                      postCodeLocation:
                        typeof item === "string" ? item : item.postCodeLocation,
                    })
                  }
                  className="py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  {label}
                </li>
              );
            })
          ) : (
            <li className="py-2 px-4 text-sm text-gray-500">
              No results found
            </li>
          )}
        </ul>
      )}

      {snackbar.open && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-[2000]">
          <div className="bg-red-500 text-white px-4 py-2 rounded-md">
            {snackbar.message}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchWithDropDown;
