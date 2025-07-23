"use client";

import React, { useEffect, useState } from "react";

import { Tooltip } from "react-tooltip";
import { Clock, Clock2, MapPin, Music } from "lucide-react";

import Link from "../common/Link";

import CodingStats from "./CodingStats";

import { getRelativeTime, getTimeForTimezone } from "@/utils";

import {
  DISCORD_USER_ID,
  FRIENDS,
  lanyard,
  STATUS_COLORS,
} from "@/utils/constants";

import type { DiscordStatus, MeKV, StatusData } from "@/lib/lanyard/types";
import Image from "next/image";

export default function RightSide() {
  const [KV, setKV] = useState<Option<MeKV>>(null);
  const [status, setStatus] = useState<Option<DiscordStatus>>(null);

  const [currentTime, setCurrentTime] = useState<Option<string>>(null);

  const updateTime = () =>
    KV && setCurrentTime(getTimeForTimezone(KV.timezone));

  const updateKV = async () => {
    setStatus(null);
    setKV(null);

    setCurrentTime(null);

    const { data } = await lanyard.get_status(DISCORD_USER_ID);

    if (data.kv.me) setKV(JSON.parse(data.kv.me));
    if (data.discord_status) setStatus(data.discord_status);

    updateTime();
  };

  useEffect(() => {
    lanyard.add_callback((data: StatusData) => {
      if (data.kv && data.kv.me) {
        setKV(JSON.parse(data.kv.me));
      }

      if (data.discord_status) {
        setStatus(data.discord_status);
      }
    });
  }, []);

  useEffect(() => {
    if (!KV?.timezone) return;

    updateTime(); // update inital time

    const interval = setInterval(() => {
      updateTime();
    }, 1000 * 10);

    return () => clearInterval(interval);
  });

  return (
    <>
      <section>
        <Tooltip id="about-tooltip" style={{ padding: 5 }} />

        <h1>
          About{" "}
          {KV?.updated_at && (
            <Clock2
              className="w-4 h-4 ml-1 inline-block text-gray-600 hover:text-black transition-all"
              data-tooltip-id="about-tooltip"
              data-tooltip-content={`last updated ${getRelativeTime(
                KV.updated_at
              )}`}
              data-tooltip-place="top"
              onClick={() => updateKV()}
            />
          )}
        </h1>

        <div className="space-y-3 text-sm">
          <span className="font-semibold block">
            I&apos;m currently{" "}
            {status ? (
              <span style={{ color: STATUS_COLORS[status] }}>{status}</span>
            ) : (
              <div className="h-3.5 bg-gray-200 animate-pulse rounded-md w-14 inline-block translate-y-0.5" />
            )}
            .
          </span>

          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4" />

            {KV?.region ? (
              <span>{KV.region}</span>
            ) : (
              <div className="h-4 my-[2px] bg-gray-200 animate-pulse rounded-md w-28" />
            )}
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-4 h-4" />

            {currentTime ? (
              <span>{currentTime}</span>
            ) : (
              <div className="h-4 my-[2px] bg-gray-200 animate-pulse rounded-md w-20" />
            )}
          </div>
        </div>
      </section>

      <CodingStats />

      <section>
        <h2 className="text-2xl font-medium mb-4">Friends</h2>

        <div className="space-y-2">
          {FRIENDS.map(({ name, githubId, href }) => (
            <Link
              key={name}
              icon={
                <Image
                  src={`https://avatars.githubusercontent.com/u/${githubId}`}
                  alt=""
                  className="w-10 h-10 rounded-lg shadow-lg"
                  height={40}
                  width={40}
                />
              }
              text={name}
              href={href}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-medium mb-4">Explore</h2>

        <div className="space-y-2">
          <Link
            icon={
              <Music className="w-5 h-5 text-gray-600 group-hover:text-gray-800" />
            }
            text="Music"
            href="/music"
            description="My top songs and artists"
          />
        </div>
      </section>
    </>
  );
}
