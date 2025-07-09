"use client";

import React, { useState, useEffect } from "react";

import Link from "next/link";

import { ArrowLeft } from "lucide-react";

import MusicItem from "../common/MusicItem";
import Page from "../common/Page";

import { BASE_URL } from "@/utils/constants";
import type { MusicResponse } from "@/app/api/music/route";

export default function MusicPage() {
  const [lastFmData, setLastFmData] = useState<Option<MusicResponse>>(null);

  useEffect(() => {
    (async () => {
      const response = await fetch(`${BASE_URL}/api/music?minified=false`);
      const data = await response.json();
      setLastFmData(data);
    })();
  }, []);

  return (
    <Page>
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />

        <span>Back</span>
      </Link>

      <section>
        <h1 className="text-5xl!">
          My <span className="text-pink-500 font-medium">Music</span> Taste
        </h1>

        <p className="mb-6">My latest music activity on Last FM.</p>
      </section>

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
        <h1 className="text-gray-700">Recent Tracks (Last 7 days)</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lastFmData ? (
            lastFmData.recentTracks.map((track, index) => (
              <MusicItem
                type="music"
                key={index}
                name={track.name}
                artist={track.artist!}
                href={track.url}
                cover={track.image[1]["#text"]}
                playcount={track.playcount!}
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
    </Page>
  );
}
