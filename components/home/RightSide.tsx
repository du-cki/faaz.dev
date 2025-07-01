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
    daily_average: 25200,
    languages: [
      { name: "TypeScript", percent: 45.2, total_seconds: 57726 },
      { name: "Python", percent: 28.1, total_seconds: 35912 },
      { name: "Rust", percent: 15.3, total_seconds: 19553 },
      { name: "HTML", percent: 2.7, total_seconds: 3451 },
    ],
    projects: [
      { name: "du-cki/Estella", percent: 34.2, total_seconds: 43708 },
      { name: "du-cki/faaz.dev", percent: 28.9, total_seconds: 36934 },
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
              Daily avg: {formatTime(wakaTimeData.daily_average)}
            </div>
          </div>

          <div>
            <div className="text-md font-semibold text-gray-700 mb-2">
              Languages
            </div>

            <div className="space-y-2">
              {wakaTimeData.languages.slice(0, 3).map((lang, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-gray-600">{lang.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-pink-500 h-1.5 rounded-full"
                        style={{ width: `${lang.percent}%` }}
                      ></div>
                    </div>
                    <span className="text-gray-500 text-xs w-8">
                      {lang.percent.toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-md font-semibold text-gray-700 mb-2">
              Projects
            </div>

            <div className="space-y-2">
              {wakaTimeData.projects.slice(0, 2).map((project, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-gray-600 truncate">{project.name}</span>
                  <span className="text-gray-500 text-xs">
                    {formatTime(project.total_seconds)}
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
