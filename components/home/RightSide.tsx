"use client";

import React, { useEffect, useState } from "react";

import moment from "moment-timezone";

import { Clock, MapPin } from "lucide-react";

const parseUtcOffset = (offset: number): string => {
  return `${offset > 0 ? "GMT+" : "GMT-"}${Math.abs(offset / 60)}`;
};

const getTimeForTimezone = (tz: string): string => {
  const time = moment().tz(tz);
  const offset = parseUtcOffset(time.utcOffset());

  return `${time.format("hh:mm A")} (${offset})`;
};

const getMockWakaTimeData = () => {
  return {
    total_seconds: 127800,
    languages: [
      {
        name: "TypeScript",
        percent: 45,
        total_seconds: 57726,
        colour: "#3178C6",
      },
      { name: "Python", percent: 24, total_seconds: 35912, colour: "#FFD43B" },
      { name: "Rust", percent: 15, total_seconds: 19553, colour: "#DEA584" },
      { name: "HTML", percent: 12, total_seconds: 3451, colour: "#E34C26" },
      {
        name: "Emacs Lisp",
        percent: 4,
        total_seconds: 35912,
        colour: "#C065DB",
      },
    ],
  };
};

const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

export default function RightSide() {
  const tz = "Asia/Dubai";
  const [currentTime, setCurrentTime] = useState(getTimeForTimezone(tz));

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getTimeForTimezone(tz));
    }, 1000 * 60);

    return () => clearInterval(interval);
  });

  const wakaTimeData = getMockWakaTimeData();

  return (
    <>
      <section>
        <h1>About</h1>

        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-1 font-semibold">
            <span className="text-gray-600">I&apos;m currently</span>
            <span className="text-green-600">online</span>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>United Arab Emirates</span>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-4 h-4" />

            <span>{currentTime}</span>
          </div>
        </div>
      </section>

      <section>
        <h2
          className="text-2xl font-medium mb-4"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          This Week
        </h2>

        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-500 mb-1">Total Coding Time</div>

            <div className="text-lg font-semibold text-gray-900">
              {formatTime(wakaTimeData.total_seconds)}
            </div>

            <div className="text-xs text-gray-500">
              Daily average: {formatTime(wakaTimeData.total_seconds / 7)}
            </div>
          </div>

          <div>
            <span className="text-md font-semibold text-gray-700">
              Languages
            </span>

            <div className="flex items-center rounded-lg overflow-clip mt-2">
              {wakaTimeData.languages.map(({ name, percent, colour }) => (
                <div
                  key={name}
                  style={{ width: `${percent}%`, backgroundColor: colour }}
                  className="h-2.5 hover:scale-110 transition-all"
                />
              ))}
            </div>

            <div className="flex flex-wrap space-x-3 space-y-1 mt-2 select-none">
              {wakaTimeData.languages.map(({ name, colour, percent }) => (
                <div key={name} className="flex items-center">
                  <div
                    className="rounded-full w-2 h-2 mr-2"
                    style={{ backgroundColor: colour }}
                  />

                  <span className="text-xs font-medium! hover:text-gray-600 transition-all">
                    {name}

                    <span className="text-gray-500 ml-3">
                      {percent.toFixed(0)}%
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
