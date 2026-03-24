"use client";

import React, { useState, useEffect } from "react";

import MusicItem from "./MusicItem";

import type { MusicResponse } from "../../pages/api/music";

export default function MusicGrid() {
  const [lastFmData, setLastFmData] = useState<Option<MusicResponse>>(null);

  useEffect(() => {
    (async () => {
      const response = await fetch("/api/music?minified=false");
      const data = await response.json();
      setLastFmData(data);
    })();
  }, []);

  return (
    <div className="space-y-12">
      <section>
        <h1 className="text-gray-700">Top Songs (Last 7 days)</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lastFmData ? (
            lastFmData.topTracks
              .slice(0, 6)
              .map((track, index) => (
                <MusicItem
                  type="music"
                  key={index}
                  name={track.name}
                  artist={track.artist!}
                  href={track.url}
                  playcount={track.playcount!}
                />
              ))
          ) : (
            <>
              {Array.from({ length: 6 }).map((_, index) => (
                <MusicItem
                  key={index}
                  type="skeleton"
                  withArtist
                  withPlaycount
                />
              ))}
            </>
          )}
        </div>
      </section>

      <section>
        <h1 className="text-gray-700">Top Artists (Last 7 days)</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lastFmData ? (
            lastFmData.topArtists
              .slice(0, 4)
              .map((artist, index) => (
                <MusicItem
                  type="music"
                  key={index}
                  name={artist.name}
                  href={artist.url}
                  playcount={artist.playcount!}
                />
              ))
          ) : (
            <>
              {Array.from({ length: 4 }).map((_, index) => (
                <MusicItem key={index} type="skeleton" />
              ))}
            </>
          )}
        </div>
      </section>

      <section>
        <h1 className="text-gray-700">Recent Tracks</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lastFmData ? (
            lastFmData.recentTracks.map((track, index) => (
              <MusicItem
                type="music"
                key={index}
                name={track.name}
                artist={track.artist!}
                href={track.url}
                cover={track.image[1]["#text"] || track.image[0]["#text"]}
                playcount={track.playcount!}
                loved={track.loved}
              />
            ))
          ) : (
            <>
              {Array.from({ length: 16 }).map((_, index) => (
                <MusicItem key={index} type="skeleton" withArtist withCover />
              ))}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
