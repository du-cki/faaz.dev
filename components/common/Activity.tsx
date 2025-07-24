import React, { useEffect, useState } from "react";

import clsx from "clsx";

import Image from "next/image";
import { Gamepad, Music } from "lucide-react";

import { ai, calculatePercentage, si, st } from "@/utils";

import type { DiscordActivity } from "@/lib/lanyard/types";

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

  id: string;
  status: string;
  text: string;
  assets: DiscordActivity["assets"];
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
            className={clsx("w-12 h-12 rounded object-cover flex-shrink-0")}
          />

          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1">
            <Music className="w-3.5 h-3.5 text-gray-600" />
          </div>
        </div>

        <div>
          <div className="text-sm text-gray-500 mb-1 font-semibold">
            Listening to
          </div>

          <a
            href={st(href)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-900 font-semibold hover:text-pink-500 transition-colors"
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
        <div className="bg-gray-200 animate-pulse w-12 h-12 rounded" />

        <div>
          <div className="bg-gray-200 animate-pulse mb-1 h-[20px] w-20 rounded-md" />
          <div className="bg-gray-200 animate-pulse h-[24px] w-36 rounded-md" />
        </div>
      </div>
    );
  }

  return (
    <div className={clsx(commonClasses, "flex items-start p-4")}>
      {activity.assets?.large_image ? (
        <div className="relative shadow-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={ai(activity.id, activity.assets.large_image)}
            alt={activity.text}
            width={40}
            height={40}
            className={clsx("w-12 h-12 rounded object-cover flex-shrink-0")}
          />

          {activity.assets.small_image && (
            <div className="absolute -bottom-1 -right-1 bg-gray-50 rounded-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ai(activity.id, activity.assets.small_image)}
                alt={activity.text}
                className="w-5 h-5 text-gray-600 rounded-full border-gray-50 border-2"
              />
            </div>
          )}
        </div>
      ) : (
        <Gamepad className="w-12 h-12 text-gray-600 mt-0.5 flex-shrink-0" />
      )}

      <div>
        <div className="text-sm text-gray-500 mb-1 font-semibold">
          {activity.status}
        </div>

        <div className="text-gray-900 font-semibold">{activity.text}</div>
      </div>
    </div>
  );
}
