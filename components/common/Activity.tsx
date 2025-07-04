import React, { useEffect, useState } from "react";

import clsx from "clsx";

import { Music } from "lucide-react";

import { calculatePercentage, st } from "@/utils";
import type { DiscordActivity } from "@/lib/lanyard/types";

type SpotifyActivity = {
  type: "spotify";

  text: string; // artist name
  artist: string;
  href: string;
  timestamps: DiscordActivity["timestamps"];
  delay?: number;
};

type BaseActivity = {
  type: "playing";

  status: string;
  text: string;
  icon: React.ReactNode;
  delay?: number;
};

type Props = SpotifyActivity | BaseActivity;

const commonClasses =
  "select-none gap-3 bg-gray-50 rounded-lg transform transition-all duration-500 ease-out overflow-clip";

function SpotifyActivity({
  text,
  artist,
  href,
  timestamps,
  delay,
}: SpotifyActivity) {
  const [perc, setPerc] = useState(calculatePercentage(timestamps));

  useEffect(() => {
    const interval = setInterval(() => {
      setPerc(calculatePercentage(timestamps));
    }, 500);

    return () => clearInterval(interval);
  });

  return (
    <div
      className={clsx(commonClasses, "group")}
      style={{
        animation: `slideDown 0.6s ease-out ${(delay || 0) * 0.1}s both`,
      }}
    >
      <div className="flex items-start gap-3 p-4">
        <Music className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />

        <div>
          <div className="text-sm text-gray-500 mb-1 font-semibold">
            Now Playing
          </div>

          <a
            href={st(href)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-900 font-semibold"
          >
            {text}
          </a>

          <div className="text-sm text-gray-500 mt-1">
            by <span className="font-semibold">{artist}</span>
          </div>
        </div>
      </div>

      <div
        className="h-1 bg-gray-200 group-hover:bg-green-500 transition-all rounded-r-full"
        style={{ width: `${perc}%` }}
      />
    </div>
  );
}

export default function Activity(activity: Props) {
  if (activity.type === "spotify") {
    return <SpotifyActivity {...activity} />;
  }

  return (
    <div
      className={clsx(commonClasses, "flex items-start p-4")}
      style={{
        animation: `slideDown 0.6s ease-out ${
          (activity.delay || 0) * 0.1
        }s both`,
      }}
    >
      {activity.icon}

      <div>
        <div className="text-sm text-gray-500 mb-1 font-semibold">
          {activity.status}
        </div>

        <div className="text-gray-900 font-semibold">{activity.text}</div>
      </div>
    </div>
  );
}
