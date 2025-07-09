"use client";

import React, { useEffect, useState } from "react";

import type { DiscordActivity, StatusData } from "@/lib/lanyard/types";

import { Gamepad, Moon } from "lucide-react";

import Activity from "../common/Activity";
import Project from "../common/Project";
import Experience from "../common/Experience";

import { DISCORD_USER_ID, lanyard } from "@/utils/constants";

import type { Project as ProjectT } from "@/lib/github/types";

type Props = {
  projects: ProjectT[];
};

export default function LeftSide({ projects }: Props) {
  const [activities, setActivities] = useState<Option<DiscordActivity[]>>(null);

  useEffect(() => {
    lanyard.add_callback((data: StatusData) => {
      setActivities(data.activities);
    });

    lanyard.connect(DISCORD_USER_ID);
  }, []);

  const spotify = activities?.find(
    (activity) => activity.type == 2 && activity.name == "Spotify"
  );

  const otherActivities = activities?.filter(
    (activity) => activity.type != 2 || activity.name != "Spotify"
  );

  return (
    <>
      <section>
        <h1>What I&apos;m upto</h1>

        <div className="space-y-3">
          {activities === null ? (
            <>
              <Activity type="skeleton" />
              <Activity type="skeleton" />
            </>
          ) : activities.length === 0 ? (
            <div className="flex justify-center items-center flex-col gap-2 bg-gray-50 rounded-lg p-4 border-dashed border-2 border-gray-200 h-[172px]">
              <Moon className="w-10 h-10 text-gray-600" />
            </div>
          ) : (
            <>
              {spotify && (
                <Activity
                  text={spotify.details}
                  artist={spotify.state.split("; ").join(", ")}
                  timestamps={spotify.timestamps}
                  href={spotify.sync_id!}
                  album_art={spotify.assets.large_image!}
                  type="spotify"
                />
              )}

              {otherActivities?.map((activity) => (
                <Activity
                  key={activity.id}
                  icon={
                    <Gamepad className="w-10 h-10 text-gray-600 mt-0.5 flex-shrink-0" />
                  }
                  status="Playing"
                  text={activity.name}
                  type="playing"
                />
              ))}
            </>
          )}
        </div>
      </section>

      {projects && (
        <section>
          <h1>Projects</h1>

          <div className="space-y-3">
            {projects.map((project) => (
              <Project
                key={project.repo_url}
                name={project.repo_name}
                description={project.description}
                href={project.repo_url}
                tags={project.tags}
                year={project.year}
              />
            ))}
          </div>
        </section>
      )}

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
