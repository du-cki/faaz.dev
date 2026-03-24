import { useState, useEffect } from "react";

import Activity from "../common/Activity";
import { Moon } from "lucide-react";

import { DISCORD_USER_ID, lanyard } from "../../../utils/constants";

export default function Activities() {
  const [activities, setActivities] = useState<any[] | null>(null);

  useEffect(() => {
    const setLanyardActivities = (data: any) => {
      setActivities(data.activities);
    };

    lanyard.add_callback(setLanyardActivities);
    lanyard.connect();

    return () => {
      lanyard.remove_callback(setLanyardActivities);
      lanyard.disconnect();
    };
  }, []);

  const spotify = activities?.find(
    (activity) => activity.type === 2 && activity.name === "Spotify",
  );

  const otherActivities = activities?.filter(
    (activity) => activity.type !== 2 || activity.name !== "Spotify",
  );

  return (
    <>
      <h1>What I'm upto</h1>

      <div className="space-y-3">
        {activities === null ? (
          <>
            <Activity type="skeleton" />
            <Activity type="skeleton" />
          </>
        ) : activities.length === 0 ? (
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
                status="Playing"
                text={activity.name}
                type="playing"
              />
            ))}
          </>
        )}
      </div>
    </>
  );
}
