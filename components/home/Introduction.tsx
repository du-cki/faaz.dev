"use client";

import React, { useEffect, useState } from "react";

import moment from "moment";

import { Tooltip } from "react-tooltip";

import Discord from "@/icons/discord.svg";
import GitHub from "@/icons/github.svg";
import Mail from "@/icons/mail.svg";
import SpotifyLogo from "@/icons/spotify.svg";

import Segment from "./Segment";
import Section from "@/components/common/Section";

import Spotify from "@/components/common/Spotify";
import Activity from "@/components/common/Activity";

import LanyardClient from "@/lib/lanyard";
import { getArticle, sa, si, st } from "@/utils";

import type { StatusData, DiscordActivity } from "@/lib/lanyard/types";

const CONNECTIONS = [
  {
    icon: <Discord />,
    tooltip: "@du_cki",
    to: "https://discord.com/users/651454696208465941",
  },
  {
    icon: <GitHub className="*:!stroke-none *:fill-black *:dark:fill-white" />,
    tooltip: "@du-cki",
    to: "https://github.com/du-cki",
  },
  {
    icon: <SpotifyLogo className="*:!stroke-none" />,
    tooltip: "faaz",
    to: "https://open.spotify.com/user/mjbcspgcrzp4188egf1zo6c9s",
  },
  {
    icon: <Mail className="*:!stroke-none *:fill-black *:dark:fill-white" />,
    tooltip: "me@faaz.dev",
    to: "mailto:me@faaz.dev",
  },
] as const;

function LoadingText() {
  return (
    <span className="h-6 w-16 translate-y-1 bg-gray-400/40 rounded animate-pulse" />
  );
}

export default function Introduction() {
  const [status, setStatus] = useState<Option<boolean>>(null);
  const [activities, setActivities] = useState<DiscordActivity[]>([]);

  const spotify = activities.find(
    (activity) => activity.type == 2 && activity.name == "Spotify"
  );

  const otherActivities = activities.filter(
    (activity) => activity.type == 0 && activity.name != "Spotify"
  );

  const year_of_birth = moment().diff(
    process.env.NEXT_PUBLIC_DATE_OF_BIRTH,
    "years"
  );

  const lanyard = new LanyardClient();
  const userId = process.env.NEXT_PUBLIC_DISCORD_USER_ID!;

  useEffect(() => {
    const socket = lanyard.subscribe([userId]);

    socket.addEventListener("message", ({ data: event }) => {
      const message: { op: number; d: StatusData } = JSON.parse(event);

      if (message.op !== 0) return;

      let data = message.d;
      // @ts-expect-error
      if (data[userId]) {
        // @ts-expect-error
        data = data[userId];
      }

      setStatus(
        data.active_on_discord_desktop ||
          data.active_on_discord_mobile ||
          data.active_on_discord_web
      );

      setActivities(data.activities);

      return () => {
        setStatus(null);
        setActivities([]);
        socket.close();
      };
    });
  }, []);

  return (
    <Section>
      <Segment
        title={
          <>
            Hello, I'm <span className="text-highlight">Faaz</span>!
          </>
        }
        description={`I am ${getArticle(
          year_of_birth
        )} ${year_of_birth} year old full-stack developer from the 
                      United Arab Emirates who loves programming both professionally and as a hobby.`}
      >
        <div className="mt-2 space-x-4 **:inline">
          <Tooltip id="connection-tooltip" style={{ padding: 5 }} />

          {CONNECTIONS.map(({ icon, tooltip, to }) => (
            <React.Fragment key={to}>
              <a
                href={to}
                target="_blank"
                rel="noopener noreferrer"
                className="*:hover:scale-110 *:hover:rotate-12 *:transition-all *:duration-300"
                data-tooltip-content={tooltip}
                data-tooltip-place="top"
                data-tooltip-id="connection-tooltip"
              >
                {icon}
              </a>
            </React.Fragment>
          ))}
        </div>
      </Segment>

      <Segment title="About" align="right">
        <div className="min-h-28 md:w-2/4 ml-auto">
          <p className="*:inline-block items-center">
            I'm currently{" "}
            {status === null ? (
              <LoadingText />
            ) : (
              <span className="font-bold text">
                {status ? "online" : "offline"}
              </span>
            )}
            .
          </p>

          {spotify && (
            <React.Fragment>
              <Tooltip
                id="spotify-track-tooltip"
                place="top-end"
                style={{ padding: 0 }}
              >
                <Spotify
                  name={spotify.details}
                  artists={spotify.state.split("; ")}
                  album={spotify.assets?.large_text!}
                  album_art={si(spotify.assets?.large_image!)}
                  timestamps={spotify.timestamps}
                />
              </Tooltip>

              <p>
                Listening to{" "}
                <a
                  data-tooltip-id="spotify-track-tooltip"
                  className="font-extrabold text"
                  href={st(spotify.sync_id!)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {spotify.details}
                </a>{" "}
                by{" "}
                <a
                  className="font-extrabold text"
                  href={sa(spotify.state)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {spotify.state.split("; ")[0]}
                </a>
                .
              </p>
            </React.Fragment>
          )}

          {otherActivities.length > 0 && (
            <>
              <p className="inline">Playing</p>{" "}
              {otherActivities.map((activity, idx) => (
                <React.Fragment key={activity.id}>
                  <Tooltip
                    id={`${activity.id}-tooltip`}
                    place="top-end"
                    style={{ padding: 0 }}
                  >
                    <Activity
                      id={activity.application_id}
                      name={activity.name}
                      details={activity.details}
                      state={activity.state}
                      assets={activity.assets}
                      timestamps={activity.timestamps}
                    />
                  </Tooltip>

                  <a
                    className="font-extrabold text"
                    data-tooltip-id={`${activity.id}-tooltip`}
                  >
                    {activity.name}
                  </a>

                  {idx < otherActivities.length - 2 ? (
                    ", "
                  ) : idx === otherActivities.length - 2 ? (
                    <p className="inline"> and </p>
                  ) : (
                    <p className="inline">.</p>
                  )}
                </React.Fragment>
              ))}
            </>
          )}
        </div>
      </Segment>
    </Section>
  );
}
