import { useState, useEffect } from "react";

import Activity from "../common/Activity";
import { Gamepad2, Moon } from "lucide-react";

import { api } from "../../../utils/constants";
import type {
  BaseActivity,
  DiscordActivity,
  SpotifyActivity,
} from "../../../lib/api/types";
import { getRelativeTime } from "../../../utils";

export default function Activities() {
  const [activities, setActivities] = useState<Option<DiscordActivity[]>>(null);
  const [recentActivities, setRecentActivities] = useState<DiscordActivity[]>(
    [],
  );

  useEffect(() => {
    const setBackendActivities = (data: any) => {
      setActivities(data.activities);
    };

    api.add_callback(setBackendActivities);
    api.connect();

    api.get_recent_activities().then(setRecentActivities);

    return () => {
      api.remove_callback(setBackendActivities);
      api.disconnect();
    };
  }, []);

  const spotify = (activities?.find(
    (activity) => activity.type === 2 && activity.name === "Spotify",
  ) || null) as Option<SpotifyActivity>;

  const otherActivities = (activities?.filter(
    (activity) => activity.type !== 2 || activity.name !== "Spotify",
  ) || null) as Option<BaseActivity[]>;

  const filteredRecentActivities = recentActivities.filter(
    (activity) => !otherActivities?.some((act) => act.name === activity.name),
  ) as BaseActivity[];

  const totalActivities =
    (spotify ? 1 : 0) +
    (otherActivities?.length ?? 0) +
    filteredRecentActivities.length;

  return (
    <div className="space-y-3">
      {activities === null ? (
        <>
          <Activity type="skeleton" />
          <Activity type="skeleton" />
        </>
      ) : totalActivities === 0 ? (
        <div className="flex justify-center items-center flex-col gap-2 bg-white rounded-lg p-4 border-dashed border-2 border-gray-200 h-43">
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
              id={activity.application_id}
              assets={activity.assets}
              status={activity.name}
              text={activity.details}
              start={activity.timestamps?.start}
              type="playing"
            />
          ))}

          {filteredRecentActivities?.map((activity) => (
            <Activity
              key={activity.id}
              id={activity.application_id}
              assets={activity.assets}
              status={activity.name}
              text={getRelativeTime(
                (activity.timestamps?.end ||
                  activity.timestamps?.start ||
                  activity.created_at) / 1000,
              )}
              icon={<Gamepad2 className="w-3 h-3" />}
              type="playing"
            />
          ))}
        </>
      )}
    </div>
  );
}
