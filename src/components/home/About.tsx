import React, { useEffect, useState } from "react";

import { Clock, Clock2, MapPin } from "lucide-react";

import { api, StatusColor } from "../../../utils/constants";

import type { DiscordStatus, Presence, Location } from "../../../lib/api/types";

import { getRelativeTime, getTimeForTimezone } from "../../../utils";
import { Tooltip } from "react-tooltip";

export default function About() {
  const [location, setLocation] = useState<Option<Location>>(null);
  const [status, setStatus] = useState<Option<DiscordStatus>>(null);

  const [currentTime, setCurrentTime] = useState<Option<string>>(null);

  const updateTime = () =>
    location && setCurrentTime(getTimeForTimezone(location.timezone));

  const updateLocation = async () => {
    setLocation(null);
    setCurrentTime(null);

    const data = await api.get_location();

    setLocation(data);
    updateTime();
  };

  useEffect(() => {
    api.add_callback((data: Presence) => {
      if (data.status) {
        setStatus(data.status);
      }
    });

    updateLocation();
  }, []);

  useEffect(() => {
    if (!location?.timezone) return;

    updateTime(); // update inital time

    const interval = setInterval(() => {
      updateTime();
    }, 1000 * 10);

    return () => clearInterval(interval);
  });

  return (
    <>
      <Tooltip id="about-tooltip" style={{ padding: 5 }} />

      <h1>
        About{" "}
        {location?.recorded_at && (
          <Clock2
            className="w-4 h-4 ml-1 inline-block text-gray-600 hover:text-black transition-all"
            data-tooltip-id="about-tooltip"
            data-tooltip-content={`last updated ${getRelativeTime(
              location.recorded_at / 1000,
            )}`}
            data-tooltip-place="top"
            onClick={() => updateLocation()}
          />
        )}
      </h1>

      <div className="space-y-3 text-sm">
        <span className="font-semibold block">
          I&apos;m currently{" "}
          {status ? (
            <span style={{ color: StatusColor[status] }}>{status}</span>
          ) : (
            <div className="h-3.5 bg-gray-200 animate-pulse rounded-md w-14 inline-block translate-y-0.5" />
          )}
          .
        </span>

        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="w-4 h-4" />

          {location?.country ? (
            <span>{location.country}</span>
          ) : (
            <div className="h-4 my-0.5 bg-gray-200 animate-pulse rounded-md w-28" />
          )}
        </div>

        <div className="flex items-center gap-2 text-gray-600">
          <Clock className="w-4 h-4" />

          {currentTime ? (
            <span>{currentTime}</span>
          ) : (
            <div className="h-4 my-0.5 bg-gray-200 animate-pulse rounded-md w-20" />
          )}
        </div>
      </div>
    </>
  );
}
