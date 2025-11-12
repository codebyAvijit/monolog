import { useState } from "react";

const TABS = [
  { label: "Flag", value: "flag" },
  { label: "Safety Stops", value: "stops" },
];

export default function IssueCard({ dataFlag, dataStops }) {
  const [tab, setTab] = useState("flag");
  const data = tab === "flag" ? dataFlag : dataStops;
  const badgeCount = dataFlag.length;

  return (
    <div
      className="
        bg-[#FAF3EB] rounded-xl border border-[#F1E7F2]
        h-[230px] w-full p-4 flex flex-col justify-between box-border
      "
    >
      {/* Tabs */}
      <div className="flex mb-2">
        {TABS.map(({ label, value }, i) => (
          <button
            key={value}
            className={`flex items-center font-semibold text-base px-4 py-1 rounded-t-lg transition-colors ${
              tab === value
                ? "bg-white shadow text-black font-bold border-b-2 border-b-white"
                : "bg-transparent text-[#A99885]"
            } ${i === 0 ? "mr-3" : ""}`}
            onClick={() => setTab(value)}
          >
            {label}
            {label === "Flag" && (
              <span className="ml-2 inline-flex items-center justify-center h-5 px-2 text-xs font-bold text-white bg-[#C12B21] rounded-full shadow">
                {badgeCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="grid grid-cols-2 text-[15px] font-semibold text-[#94847A] border-b border-[#E3DED7] px-1 py-1">
          <span>Driver</span>
          <span>Issue</span>
        </div>
        {data.map((row, idx) => (
          <div
            key={idx}
            className={`grid grid-cols-2 text-[16px] text-[#012622] px-1 py-1 items-center ${
              idx !== data.length - 1 ? "border-b border-[#E3DED7]" : ""
            }`}
          >
            <span className="font-bold">{row.driver}</span>
            <a
              href={row.issueLink}
              className="font-bold underline text-[#012622]"
            >
              {row.issue}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
