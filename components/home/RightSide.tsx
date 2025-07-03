"use client";

import React, { useEffect, useState } from "react";

import { Tooltip } from "react-tooltip";
import { Clock, Clock2, MapPin } from "lucide-react";

import { getRelativeTime, getTimeForTimezone } from "@/utils";

import { DISCORD_USER_ID, lanyard, STATUS_COLORS } from "@/utils/constants";
import type { DiscordStatus, MeKV, StatusData } from "@/lib/lanyard/types";

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
  const [KV, setKV] = useState<Option<MeKV>>(null);
  const [status, setStatus] = useState<Option<DiscordStatus>>(null);

  const [currentTime, setCurrentTime] = useState<Option<string>>(null);

  const updateTime = () =>
    KV && setCurrentTime(getTimeForTimezone(KV.timezone));

  const updateKV = async () => {
    setStatus(null);
    setKV(null);

    setCurrentTime(null);

    const { data } = await lanyard.get_status(DISCORD_USER_ID);

    if (data.kv.me) setKV(JSON.parse(data.kv.me));
    if (data.discord_status) setStatus(data.discord_status);

    updateTime();
  };

  useEffect(() => {
    lanyard.add_callback((data: StatusData) => {
      if (data.kv && data.kv.me) {
        setKV(JSON.parse(data.kv.me));
      }

      if (data.discord_status) {
        setStatus(data.discord_status);
      }
    });
  }, []);

  useEffect(() => {
    if (!KV?.timezone) return;

    updateTime(); // update inital time

    const interval = setInterval(() => {
      updateTime();
    }, 1000 * 10);

    return () => clearInterval(interval);
  });

  const wakaTimeData = getMockWakaTimeData();

  return (
    <>
      <section>
        <Tooltip id="about-tooltip" style={{ padding: 5 }} />

        <h1>
          About{" "}
          {KV?.updated_at && (
            <Clock2
              className="w-4 h-4 ml-1 inline-block text-gray-600 hover:text-black transition-all"
              data-tooltip-id="about-tooltip"
              data-tooltip-content={`last updated ${getRelativeTime(
                KV.updated_at
              )}`}
              data-tooltip-place="top"
              onClick={() => updateKV()}
            />
          )}
        </h1>

        <div className="space-y-3 text-sm">
          <span className="font-semibold block">
            I&apos;m currently{" "}
            {status ? (
              <span style={{ color: STATUS_COLORS[status] }}>{status}</span>
            ) : (
              <div className="h-3.5 bg-gray-200 rounded-full w-10 inline-block" />
            )}
            .
          </span>

          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4" />

            {KV?.region ? (
              <span>{KV.region}</span>
            ) : (
              <div className="h-4 my-[2px] bg-gray-200 rounded-full w-28" />
            )}
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-4 h-4" />

            {currentTime ? (
              <span>{currentTime}</span>
            ) : (
              <div className="h-4 my-[2px] bg-gray-200 rounded-full w-20" />
            )}
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
