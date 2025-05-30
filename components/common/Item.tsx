import React from "react";

import { la } from "@/utils";
import type { Track } from "@/utils/types";

type Props = {
  music: Track;
};

export default function Item({ music }: Props) {
  const url = music?.image?.at(-1)?.["#text"];

  return (
    <div className="w-full md:w-1/2 lg:w-1/3">
      <div className="card flex p-2 m-2 rounded-lg space-x-3">
        <img
          src={url}
          alt={`${music.name}'s Album Art`}
          className="rounded-lg card w-16 h-16"
        />

        <div>
          <a href={music.url} className="text font-extrabold line-clamp-1">
            {music.name}
          </a>

          <p className="!text-sm">
            by{" "}
            <a href={la(music.url)} className="!text-sm text font-semibold">
              {music.artist}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
