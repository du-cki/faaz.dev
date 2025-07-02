import React, { useEffect, useState } from "react";

import { Music } from "lucide-react";

import type { DiscordActivity } from "@/lib/lanyard/types";
import { calculatePercentage, st } from "@/utils";

type SpotifyActivity = {
  type: "spotify";

  text: string; // artist name
  artist: string;
  href: string;
  timestamps: DiscordActivity["timestamps"];
};

type BaseActivity = {
  type: "playing";

  status: string;
  text: string;
  icon: React.ReactNode;
};

type Props = SpotifyActivity | BaseActivity;

function SpotifyActivity({ text, artist, href, timestamps }: SpotifyActivity) {
  const [perc, setPerc] = useState(calculatePercentage(timestamps));

  useEffect(() => {
    const interval = setInterval(() => {
      setPerc(calculatePercentage(timestamps));
    }, 500);

    return () => clearInterval(interval);
  });

  return (
    <div className="select-none bg-gray-50 rounded-lg overflow-clip group">
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
        className="h-0.5 bg-gray-200 group-hover:h-1 group-hover:bg-green-500 transition-all"
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
    <div className="select-none flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
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
