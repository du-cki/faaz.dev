import React, { useEffect, useState } from "react";

import clsx from "clsx";

import { Music } from "lucide-react";

import { calculatePercentage, si, st } from "@/utils";
import type { DiscordActivity } from "@/lib/lanyard/types";
import Image from "next/image";

type SpotifyActivity = {
  type: "spotify";

  text: string; // artist name
  artist: string;
  href: string;
  timestamps: DiscordActivity["timestamps"];
  album_art: string;
};

type BaseActivity = {
  type: "playing";

  status: string;
  text: string;
  icon: React.ReactNode;
};

type SkeletonActivity = {
  type: "skeleton";
};

type Props = SpotifyActivity | BaseActivity | SkeletonActivity;

const commonClasses =
  "select-none gap-3 bg-gray-50 rounded-lg transform transition-all duration-500 ease-out overflow-clip shadow-md";

function SpotifyActivity({
  text,
  artist,
  href,
  timestamps,
  album_art,
}: SpotifyActivity) {
  const [perc, setPerc] = useState(calculatePercentage(timestamps));

  useEffect(() => {
    const interval = setInterval(() => {
      setPerc(calculatePercentage(timestamps));
    }, 500);

    return () => clearInterval(interval);
  });

  return (
    <div className={clsx(commonClasses, "group")}>
      <div className="flex items-start gap-3 p-4">
        <div className="relative shadow-lg">
          <Image
            src={si(album_art)}
            alt={`${text}'s album art`}
            width={40}
            height={40}
            className={clsx("w-10 h-10 rounded object-cover flex-shrink-0")}
          />

          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1">
            <Music className="w-3 h-3 text-gray-600" />
          </div>
        </div>

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

  if (activity.type === "skeleton") {
    return (
      <div className={clsx(commonClasses, "flex items-start p-4")}>
        <div className="bg-gray-200 animate-pulse w-10 h-10 rounded" />

        <div>
          <div className="bg-gray-200 animate-pulse mb-1 h-[20px] w-20 rounded-md" />
          <div className="bg-gray-200 animate-pulse h-[24px] w-36 rounded-md" />
        </div>
      </div>
    );
  }

  return (
    <div className={clsx(commonClasses, "flex items-start p-4")}>
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
