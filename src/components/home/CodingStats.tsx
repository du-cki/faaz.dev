import React, { useState, useEffect } from "react";

import clsx from "clsx";

import type { StatsResponse } from "../../pages/api/stats";

const MINIMUM_SECONDS = 30 * 60;

type LangEntry = [string, { percentage: number; colour: string }];

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
  if (type === "skeleton" || !total_seconds) {
    return (
      <div className="bg-gray-50 rounded-lg shadow-md p-4">
        <div className="text-sm text-gray-500 mb-1">Total Coding Time</div>

        <div className="bg-gray-200 animate-pulse h-6.25 w-36 rounded-md" />

        <div className="bg-gray-200 animate-pulse h-4 w-24 rounded-md mt-0.75" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-lg shadow-md p-4">
      <div className="text-sm text-gray-500 mb-1">Total Coding Time</div>

      <div className="text-lg font-semibold text-gray-900">
        {formatTime(total_seconds)}
      </div>

      {total_seconds > MINIMUM_SECONDS && (
        <div className="text-xs text-gray-500">
          Daily average: {formatTime(total_seconds / 7)}
        </div>
      )}
    </div>
  );
}

export default function CodingStats() {
  const [wakaTimeData, setWakaTimeData] = useState<Option<StatsResponse>>(null);
  const [langEntries, setLangEntries] = useState<LangEntry[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const req = await fetch("/api/stats");
        const data = await req.json();

        setWakaTimeData(data);

        if (data.total_seconds > MINIMUM_SECONDS) {
          const entries = Object.entries(data.languages ?? {}).sort(
            ([a], [b]) => (a === "Other" ? 1 : 0) - (b === "Other" ? 1 : 0),
          ) as LangEntry[];

          setLangEntries(entries);
        }
      } catch (error) {
        console.error("Failed to fetch WakaTime stats:", error);
      }
    })();
  }, []);

  return (
    <div className="py-2">
      <h2 className="text-2xl font-medium mb-4">This Week</h2>

      <div className="space-y-4">
        {wakaTimeData ? (
          <CodingTimeCard
            total_seconds={wakaTimeData.total_seconds}
            type="card"
          />
        ) : (
          <CodingTimeCard type="skeleton" />
        )}

        <div
          className={clsx(
            "grid transition-[grid-template-rows] duration-500 ease-out grid-rows-[0fr]",
            langEntries.length > 0 && "grid-rows-[1fr]",
          )}
        >
          <div className="overflow-hidden">
            <div className="pt-2">
              <span className="text-md font-semibold text-gray-700">
                Languages
              </span>

              <div className="flex items-center rounded-lg overflow-clip mt-2">
                {langEntries.map(([name, { percentage, colour }]) => (
                  <div
                    key={name}
                    style={{ width: `${percentage}%`, backgroundColor: colour }}
                    className="h-2.5 hover:scale-110 transition-all"
                  />
                ))}
              </div>

              <div className="flex flex-wrap space-x-3 space-y-1 mt-2 select-none">
                {langEntries.map(([name, { percentage, colour }]) => (
                  <div key={name} className="flex items-center">
                    <div
                      className="rounded-full w-2 h-2 mr-2"
                      style={{ backgroundColor: colour }}
                    />

                    <span className="text-xs font-medium hover:text-gray-600 transition-all">
                      {name}

                      <span className="text-gray-500 ml-3">
                        {percentage.toFixed(0)}%
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
