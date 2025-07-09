import React, { useState, useEffect } from "react";

import { motion } from "framer-motion";

import type { StatsResponse } from "@/app/api/stats/route";

const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

function CodingTimeCard({
  total_seconds,
  type,
}: {
  total_seconds?: number;
  type: "card" | "skeleton";
}) {
  if (type === "skeleton") {
    return (
      <div className="bg-gray-50 rounded-lg shadow-md p-4">
        <div className="text-sm text-gray-500 mb-1">Total Coding Time</div>

        <div className="bg-gray-200 animate-pulse h-[25px] w-36 rounded-md" />

        <div className="bg-gray-200 animate-pulse h-[16px] w-24 rounded-md mt-[3px]" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-lg shadow-md p-4">
      <div className="text-sm text-gray-500 mb-1">Total Coding Time</div>

      <div className="text-lg font-semibold text-gray-900">
        {formatTime(total_seconds!)}
      </div>

      <div className="text-xs text-gray-500">
        Daily average: {formatTime(total_seconds! / 7)}
      </div>
    </div>
  );
}

export default function CodingStats() {
  const [wakaTimeData, setWakaTimeData] = useState<Option<StatsResponse>>();

  useEffect(() => {
    (async () => {
      const req = await fetch("/api/stats");
      const data = await req.json();

      setWakaTimeData(data);
    })();
  }, []);

  return (
    <section>
      <h2 className="text-2xl font-medium mb-4">This Week</h2>

      <div className="space-y-4">
        {wakaTimeData ? (
          <CodingTimeCard
            total_seconds={wakaTimeData.total_seconds}
            type={"card"}
          />
        ) : (
          <CodingTimeCard type={"skeleton"} />
        )}

        {wakaTimeData && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ ease: "easeInOut", duration: 0.5 }}
          >
            <span className="text-md font-semibold text-gray-700">
              Languages
            </span>

            <div className="flex items-center rounded-lg overflow-clip mt-2">
              {Object.entries(wakaTimeData?.languages || {}).map(
                ([name, { percentage, colour }]) => (
                  <div
                    key={name}
                    style={{ width: `${percentage}%`, backgroundColor: colour }}
                    className="h-2.5 hover:scale-110 transition-all"
                  />
                )
              )}
            </div>

            <div className="flex flex-wrap space-x-3 space-y-1 mt-2 select-none">
              {Object.entries(wakaTimeData?.languages || {}).map(
                ([name, { percentage, colour }]) => (
                  <div key={name} className="flex items-center">
                    <div
                      className="rounded-full w-2 h-2 mr-2"
                      style={{ backgroundColor: colour }}
                    />

                    <span className="text-xs font-medium! hover:text-gray-600 transition-all">
                      {name}

                      <span className="text-gray-500 ml-3">
                        {percentage.toFixed(0)}%
                      </span>
                    </span>
                  </div>
                )
              )}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
