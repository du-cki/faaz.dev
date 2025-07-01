"use client";

import React, { useEffect, useState } from "react";

import LanyardClient from "@/lib/lanyard";
import type { DiscordActivity, StatusData } from "@/lib/lanyard/types";

import { Gamepad } from "lucide-react";

import Activity from "../common/Activity";
import Project from "../common/Project";
import Experience from "../common/Experience";

export default function LeftSide() {
  const [activities, setActivities] = useState<DiscordActivity[]>([]);

  const userId = process.env.NEXT_PUBLIC_DISCORD_USER_ID!;

  useEffect(() => {
    const lanyard = new LanyardClient();
    const socket = lanyard.subscribe([userId]);

    socket.addEventListener("message", ({ data: event }) => {
      const message: { op: number; d: StatusData } = JSON.parse(event);

      if (message.op !== 0) return;

      let data = message.d;
      // @ts-expect-error should be fine
      if (data[userId]) {
        // @ts-expect-error should be fine
        data = data[userId];
      }

      setActivities(data.activities);

      return () => {
        setActivities([]);
        socket.close();
      };
    });
  }, [userId]);

  const spotify = activities.find(
    (activity) => activity.type == 2 && activity.name == "Spotify"
  );

  const otherActivities = activities.filter(
    (activity) => activity.type != 2 || activity.name != "Spotify"
  );

  return (
    <>
      <section>
        <h1>What I&apos;m upto</h1>

        <div className="space-y-3">
          {spotify && (
            <Activity
              text={spotify.details}
              artist={spotify.state.split("; ").join(", ")}
              timestamps={spotify.timestamps}
              href={spotify.sync_id!}
              type="spotify"
            />
          )}

          {otherActivities.map((activity) => (
            <Activity
              key={activity.id}
              icon={
                <Gamepad className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
              }
              status="Playing"
              text={activity.name}
              type="playing"
            />
          ))}

          {/* Placeholder until i figure out what to put here by default */}
          {otherActivities.length === 0 && !spotify && (
            <Activity
              icon={
                <Gamepad className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
              }
              status="Playing"
              text="Marvel Rivals"
              type="playing"
            />
          )}
        </div>
      </section>

      <section>
        <h1>Projects</h1>

        <div className="space-y-3">
          <Project
            name="Uma"
            description="The Uma Programming Language"
            href="https://github.com/du-cki/Uma"
            tags={["programming-language", "rust"]}
            year={2023}
          />

          <Project
            name="css-tweaks"
            description="A minimal web UI for generating sharable Discord CSS tweak URLs."
            href="https://github.com/du-cki/css-tweaks"
            tags={["discord", "css"]}
            year={2025}
          />

          <Project
            name="Kana"
            description="A personal utility bot for servers I like on discord."
            href="https://github.com/du-cki/Kana"
            tags={["python", "discordpy"]}
            year={2022}
          />
        </div>
      </section>

      <section>
        <h1>Experience</h1>

        <div className="space-y-3">
          <Experience
            name="Lamna"
            role="Software Developer"
            period={{ start: "2023", end: "Present" }}
            description="A privacy-first, self-hostable chat app built as a hobby project, focused on encryption, user control, and data ownership."
          />
        </div>
      </section>
    </>
  );
}
