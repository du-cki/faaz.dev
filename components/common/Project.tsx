import React from "react";

import type { Project } from "@/utils/types";

import Repository from "@/icons/repository.svg";
import Fork from "@/icons/fork.svg";
import Star from "@/icons/star.svg";

function Stat({
  icon,
  stats,
  className,
}: {
  icon: React.ReactNode;
  stats: string | number;
  className?: string;
}) {
  return (
    <div className={`*:inline-block ${className}`}>
      {icon}

      <span className="ml-1 align-middle">{stats}</span>
    </div>
  );
}

type Props = {
  details: Project;
};

export default function Project({ details }: Props) {
  return (
    <div className="card flex flex-col w-full p-4 text-left rounded-lg">
      <div className="space-x-2 *:inline-block">
        <Repository className="scale-125" />
        <a className="text font-bold">{details.repo_name}</a>
      </div>

      <p className="flex-1 my-2 line-clamp-2">{details.description}</p>

      <div className="space-x-2 *:inline-block">
        <span
          className="align-middle w-4 h-4 rounded-full"
          style={{ backgroundColor: details.color }}
        />

        <span className="align-middle">{details.language}</span>

        <div className="*:inline-block ml-4 space-x-3">
          <Stat
            icon={<Star height="20px" width="20px" />}
            stats={details.stars}
          />

          {details.forks > 0 && (
            <Stat
              icon={<Fork height="20px" width="20px" />}
              stats={details.forks}
              className="*:ml-0"
            />
          )}
        </div>
      </div>
    </div>
  );
}
