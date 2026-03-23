import React, { useState, useEffect } from "react";

import clsx from "clsx";

import { Heart } from "lucide-react";
import { randomInt } from "../../../utils";

type SkeletonItem = {
  type: "skeleton";
  withPlaycount?: boolean;
  withArtist?: boolean;
  withCover?: boolean;
};

type MusicItem = {
  type: "music";
  href: string;
  name: string;
  artist?: string;
  playcount?: number;
  cover?: string;
  loved?: boolean;
};

type Props = SkeletonItem | MusicItem;

function SkeletonMusicItem({
  withArtist,
  withCover,
  withPlaycount,
}: SkeletonItem) {
  const [randomWidths, setRandomWidths] = useState<{
    title: number;
    artist: number;
  } | null>(null);

  useEffect(() => {
    setRandomWidths({
      title: randomInt(200, 300),
      artist: randomInt(50, 100),
    });
  }, []);

  return (
    <div className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group shadow-md">
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1 flex">
          {withCover && <div className="mr-3 w-12 h-12 rounded bg-gray-200" />}

          <div className="min-w-0 flex-1">
            <div
              className="bg-gray-200 animate-pulse h-6 rounded-md"
              style={{
                width: randomWidths?.title,
              }}
            />

            {withArtist && (
              <span className="text-sm! text-gray-400 flex items-center mt-[2.75px]">
                by
                <span
                  className="bg-gray-200 animate-pulse inline-block h-4.5 rounded-md ml-1"
                  style={{
                    width: randomWidths?.artist,
                  }}
                />
              </span>
            )}
          </div>
        </div>

        {withPlaycount && (
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-16 h-6 rounded-md bg-gray-200 animate-pulse" />
          </div>
        )}
      </div>
    </div>
  );
}

export default function MusicItem(item: Props) {
  if (item.type == "skeleton") {
    return <SkeletonMusicItem {...item} />;
  }

  return (
    <a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      className={clsx(
        "block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group shadow-md",
        item.loved && "border-red-600 border-2",
      )}
    >
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1 flex">
          {item.cover && (
            <img
              src={item.cover}
              alt={item.name}
              className="mr-3 w-12 h-12 rounded"
            />
          )}

          <div>
            <h3 className="font-semibold! text-gray-900 line-clamp-1 group-hover:text-pink-500 transition-colors font-sans!">
              {item.name}
            </h3>

            {item.artist && (
              <p className="text-sm! text-gray-400 line-clamp-1">
                by <span className="font-semibold">{item.artist}</span>
              </p>
            )}
          </div>
        </div>

        {item.playcount && (
          <div className="flex items-center gap-2 shrink-0">
            <span className="px-2 py-1 bg-pink-100 text-pink-700 text-xs rounded-md font-medium font-mono! ml-2">
              {item.playcount} plays
            </span>
          </div>
        )}

        {item.loved && <Heart className="text-red-600 fill-red-600" />}
      </div>
    </a>
  );
}
