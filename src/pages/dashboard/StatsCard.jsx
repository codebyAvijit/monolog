import React from "react";

const bgByType = (type) => {
  if (type === "highlight-green") return "bg-[#F0FBF5] border-[#D0F1DE]";
  if (type === "highlight-blue") return "bg-[#E5F8F7] border-[#DAF3F0]";
  return "bg-[#F6F2F5] border-[#F1E7F2]";
};

export default function StatsCard({ stats = [] }) {
  return (
    <div className="w-full flex justify-between">
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className={`flex flex-col justify-between rounded-xl p-5 min-h-[110px] border transition-all duration-200 ${bgByType(
              stat.type
            )}`}
          >
            {/* Top Row (Icon + Title + Optional Arrow) */}
            <div className="flex items-center gap-2">
              {stat.icon && (
                <img
                  src={stat.icon}
                  alt=""
                  className="w-7 h-7 object-contain"
                />
              )}
              <p className="text-[16px] font-normal text-[#173331] leading-tight">
                {stat.title}
              </p>
              {stat.showArrow && (
                <span className="ml-auto text-[#012622] text-2xl">&rarr;</span>
              )}
            </div>

            {/* Value Section */}
            <div className="mt-3">
              <p className="text-[26px] md:text-[24px] font-bold text-[#012622] tracking-tight leading-none">
                {stat.value}
                {stat.suffix && (
                  <span className="ml-1 text-[18px] font-normal">
                    {stat.suffix}
                  </span>
                )}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
