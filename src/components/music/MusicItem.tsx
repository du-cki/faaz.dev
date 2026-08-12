import React from "react";

import clsx from "clsx";

import { Heart } from "lucide-react";

type SkeletonItem = {
  type: "skeleton";
  withPlaycount?: boolean;
  withArtist?: boolean;
  withCover?: boolean;

  index: number;
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

const TITLE_WIDTHS = [220, 280, 210, 260, 240, 290, 230, 270];
const ARTIST_WIDTHS = [70, 90, 60, 85, 100, 65, 80, 95];

function SkeletonMusicItem({
  withArtist,
  withCover,
  withPlaycount,
  index,
}: SkeletonItem) {
  const titleWidth = TITLE_WIDTHS[index % TITLE_WIDTHS.length];
  const artistWidth = ARTIST_WIDTHS[index % ARTIST_WIDTHS.length];

  return (
    <div className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group shadow-md">
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1 flex">
          {withCover && <div className="mr-3 w-12 h-12 rounded bg-gray-200" />}

          <div className="min-w-0 flex-1">
            <div
              className="bg-gray-200 animate-pulse h-6 rounded-md"
              style={{ width: titleWidth }}
            />

            {withArtist && (
              <span className="text-sm! text-gray-400 flex items-center mt-[2.75px]">
                by
                <span
                  className="bg-gray-200 animate-pulse inline-block h-4.5 rounded-md ml-1"
                  style={{ width: artistWidth }}
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
            <span className="font-semibold line-clamp-1 group-hover:text-accent transition-colors">
              {item.name}
            </span>

            {item.artist && (
              <p className="text-sm! text-gray-400 line-clamp-1">
                by <span className="font-semibold">{item.artist}</span>
              </p>
            )}
          </div>
        </div>

        {item.playcount && (
          <div className="flex items-center gap-2 shrink-0">
            <span className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-md font-medium font-mono! ml-2">
              {item.playcount} plays
            </span>
          </div>
        )}

        {item.loved && <Heart className="text-red-600 fill-red-600" />}
      </div>
    </a>
  );
}
