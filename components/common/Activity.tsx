"use client";

import React, { use, useEffect, useState } from "react";

import { getActivityCover } from "@/utils";

import type { DiscordActivity } from "@/lib/lanyard/types";

import UnknownActivity from "@/icons/unknown_activity.svg";
import Progress from "./Progress";

const extractActualUrl = (url: string): Option<string> => {
  if (url.startsWith("https")) return url;

  const parts = url.split("/");
  const protocolIndex = parts.findIndex(
    (part) => part === "https" || part === "http"
  );

  if (protocolIndex === -1 || protocolIndex + 1 >= parts.length) {
    return null;
  }

  return `${parts[protocolIndex]}://${parts
    .slice(protocolIndex + 1)
    .join("/")}`;
};

type Props = {
  id: string;
  name: React.ReactNode | string;
  details: React.ReactNode | string;
  state: React.ReactNode | string;
  assets: DiscordActivity["assets"];
  timestamps?: DiscordActivity["timestamps"];
};

export default function Activity({
  id,
  name,
  details,
  state,
  assets,
  timestamps,
}: Props) {
  const [cover, setCover] = useState(null as Option<string>);

  useEffect(() => {
    (async () => {
      if (assets?.large_image) {
        const url = extractActualUrl(assets.large_image);

        return setCover(url);
      }

      const url = await getActivityCover(id);
      setCover(url);
    })();
  }, [id, assets]);

  return (
    <div className="flex p-3 space-x-3 w-[380px] h-[120px]">
      <div className="relative w-36">
        {cover ? (
          <img
            src={cover}
            alt={`${name}'s Cover Art`}
            className="rounded-lg w-full"
          />
        ) : (
          <UnknownActivity />
        )}

        {assets?.small_image && (
          <img
            src={extractActualUrl(assets.small_image) || undefined}
            alt=""
            className="absolute w-8 h-8 rounded-full right-0 bottom-0 translate-x-1 translate-y-1 shadow-[0_0_0_4px_rgba(32,32,32,0.8)]"
          />
        )}
      </div>

      <div className="text-left w-full *:line-clamp-1">
        <p className="font-extrabold !text-white">{name}</p>
        <p className="!text-sm font-bold">{details}</p>
        <p className="!text-sm font-bold">{state}</p>

        <div className="mt-1">
          <Progress timestamps={timestamps} />
        </div>
      </div>
    </div>
  );
}
