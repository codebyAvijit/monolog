export default function SubscriptionsCard({
  active = 200,
  due = 70,
  low = 30,
}) {
  const total = active + due + low || 1;
  const greenFrac = (active / total) * 100;
  const orangeFrac = (due / total) * 100;
  const redFrac = (low / total) * 100;

  return (
    <div
      className="
        bg-[#F0FBF5] rounded-xl border border-[#E3EFEA]
        h-[230px] w-full px-6 py-5 flex flex-col justify-between
        overflow-hidden box-border
      "
    >
      {/* Title */}
      <div className="font-bold text-lg text-[#012622]">Subscriptions</div>

      {/* Progress Bar */}
      <div className="w-full h-4 rounded-full bg-[#D7F1E6] flex overflow-hidden mt-2 mb-4">
        <div
          style={{ width: `${greenFrac}%` }}
          className="bg-[#2EB100] transition-all duration-300"
        />
        <div
          style={{ width: `${orangeFrac}%` }}
          className="bg-[#F2A03B] transition-all duration-300"
        />
        <div
          style={{ width: `${redFrac}%` }}
          className="bg-[#FE7075] transition-all duration-300"
        />
      </div>

      {/* Stats */}
      <div
        className="
          flex flex-wrap sm:flex-nowrap justify-between items-start text-center gap-y-3 flex-1
        "
      >
        <div className="flex-1">
          <div className="font-extrabold text-[26px] sm:text-[28px] text-[#2EB100]">
            {active}
          </div>
          <div className="text-[15px] sm:text-[16px] text-[#012622] leading-tight">
            Active subscriptions
          </div>
        </div>

        <div className="flex-1">
          <div className="font-extrabold text-[26px] sm:text-[28px] text-[#F2A03B]">
            {due}
          </div>
          <div className="text-[15px] sm:text-[16px] text-[#012622] leading-tight">
            Subscriptions due
            <br />
            for renewal
          </div>
        </div>

        <div className="flex-1">
          <div className="font-extrabold text-[26px] sm:text-[28px] text-[#FE7075]">
            {low}
          </div>
          <div className="text-[15px] sm:text-[16px] text-[#012622] leading-tight">
            Subscriptions with
            <br />
            low balance
          </div>
        </div>
      </div>
    </div>
  );
}
