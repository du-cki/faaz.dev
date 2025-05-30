import React from "react";

import Activity from "./Activity";

import type { DiscordActivity } from "@/lib/lanyard/types";

type Props = {
  name: string;
  artists: string[];
  album: string;
  album_art: string;
  timestamps: DiscordActivity["timestamps"];
};

export default function Spotify({
  name,
  artists,
  album,
  album_art,
  timestamps,
}: Props) {
  return (
    <Activity
      id="spotify"
      name={name}
      details={
        <>
          by{" "}
          <span className="inline font-bold !text-white">
            {artists.join(", ")}
          </span>
        </>
      }
      state={
        <>
          on <span className="inline font-bold !text-white">{album}</span>
        </>
      }
      assets={{
        large_image: album_art,
      }}
      timestamps={timestamps}
    />
  );
}
