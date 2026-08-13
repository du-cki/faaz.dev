import { useEffect, useState, type ReactNode } from "react";

import clsx from "clsx";
import { Gamepad, Gamepad2 } from "lucide-react";

import { ai, calculatePercentage, si, st } from "../../../utils";

import type {
  BaseActivity as BaseActivityT,
  SpotifyActivity as SpotifyActivityT,
} from "../../../lib/api/types";

import type { ApplicationInfoResponse } from "../../pages/api/application-info";

import { Modal } from "./Modal";
import { ActivityModal } from "./ActivityModal";
import { SiSpotify } from "@icons-pack/react-simple-icons";
import dayjs from "dayjs";

type SpotifyActivity = {
  type: "spotify";

  text: string; // artist name
  artist: string;
  href: string;
  timestamps: SpotifyActivityT["timestamps"];
  album_art: string;
};

type BaseActivity = {
  type: "playing";

  id?: string;
  assets: BaseActivityT["assets"];
  status: string;
  text?: string;
  icon?: ReactNode;
  start?: number;
};

type SkeletonActivity = {
  type: "skeleton";
};

type Props = SpotifyActivity | BaseActivity | SkeletonActivity;

function ActivityTimer({ start }: { start: number | string | Date }) {
  const [timeStr, setTimeStr] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const diffMs = dayjs().diff(dayjs(start));
      const totalSeconds = Math.max(0, Math.floor(diffMs / 1000));

      const h = Math.floor(totalSeconds / 3600);
      const m = Math.floor((totalSeconds % 3600) / 60);
      const s = totalSeconds % 60;

      const formattedM = m.toString().padStart(2, "0");
      const formattedS = s.toString().padStart(2, "0");

      if (h > 0) {
        setTimeStr(`${h}:${formattedM}:${formattedS}`);
      } else {
        setTimeStr(`${formattedM}:${formattedS}`);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [start]);

  return timeStr;
}

const commonClasses =
  "select-none gap-3 bg-gray-50 rounded-lg transform transition-all duration-500 ease-out overflow-clip shadow-md";

function SpotifyActivity({
  text,
  artist,
  href,
  timestamps,
  album_art,
}: SpotifyActivity) {
  const [perc, setPerc] = useState(calculatePercentage(timestamps));

  useEffect(() => {
    const interval = setInterval(() => {
      setPerc(calculatePercentage(timestamps));
    }, 500);

    return () => clearInterval(interval);
  });

  return (
    <div className={clsx(commonClasses, "group")}>
      <div className="flex items-start gap-3 p-4">
        <div className="relative shadow-lg">
          <img
            src={si(album_art)}
            alt={`${text}'s album art`}
            width={40}
            height={40}
            className="min-w-12 min-h-12 rounded object-cover shrink-0"
          />

          <div className="absolute -bottom-1 -right-1 bg-card-background rounded-full p-0.5">
            <SiSpotify className="w-4 h-4 text-spotify-green" />
          </div>
        </div>

        <div>
          <div className="text-sm text-gray-500 mb-1 font-semibold">
            Listening to
          </div>

          <a
            href={st(href)}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold hover:text-accent transition-colors"
          >
            {text}
          </a>

          <div className="text-sm text-gray-500 mt-1">
            by <span className="font-semibold">{artist}</span>
          </div>
        </div>
      </div>

      <div
        className="h-1 bg-gray-200 group-hover:bg-spotify-green transition-all rounded-r-full"
        style={{ width: `${perc}%` }}
      />
    </div>
  );
}

export default function Activity(activity: Props) {
  const [activityData, setActivityData] =
    useState<Option<ApplicationInfoResponse>>(null);
  const [isLoadingCover, setIsLoadingCover] = useState<boolean>(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const isPlaying = activity.type == "playing";
  const activityId = isPlaying && activity.id;
  const largeImage = isPlaying && activity.assets?.large_image;

  useEffect(() => {
    if (
      activity.type !== "spotify" &&
      activity.type !== "skeleton" &&
      activity.id &&
      !activity.assets?.large_image
    ) {
      let isMounted = true;
      setIsLoadingCover(true);

      const fetchActivityData = async () => {
        try {
          const res = await fetch(`/api/application-info?id=${activity.id}`);

          if (res.ok) {
            const data: Option<ApplicationInfoResponse> = await res.json();

            if (isMounted && data) {
              setActivityData(data);
            }
          }
        } finally {
          if (isMounted) {
            setIsLoadingCover(false);
          }
        }
      };

      fetchActivityData();

      return () => {
        isMounted = false;
      };
    }
  }, [isPlaying, activityId, largeImage]);

  if (activity.type === "spotify") {
    return <SpotifyActivity {...activity} />;
  }

  if (activity.type === "skeleton") {
    return (
      <div className={clsx(commonClasses, "flex items-start p-4")}>
        <div className="bg-gray-200 animate-pulse w-12 h-12 rounded" />

        <div>
          <div className="bg-gray-200 animate-pulse mb-1 h-5 w-20 rounded-md" />
          <div className="bg-gray-200 animate-pulse h-6 w-36 rounded-md" />
        </div>
      </div>
    );
  }

  const isClickable = !!activityData;

  const showTimer = !activity.text && !activity.icon && activity.start;

  const displayIcon = showTimer ? <Gamepad2 /> : activity.icon;
  const displayText = showTimer ? (
    <ActivityTimer start={activity.start!} />
  ) : (
    activity.text
  );

  return (
    <>
      <div
        className={clsx(
          commonClasses,
          "flex items-start p-4",
          isClickable && "cursor-pointer hover:shadow-lg",
        )}
        onClick={() => {
          if (isClickable) setIsModalOpen(true);
        }}
        role={isClickable ? "button" : "presentation"}
      >
        {activity.assets?.large_image ? (
          <div className="relative shadow-lg shrink-0">
            <img
              src={ai(activity.id!, activity.assets.large_image)}
              alt={activity.text}
              width={40}
              height={40}
              className="w-12 h-12 rounded object-cover"
            />

            {activity.assets.small_image && (
              <div className="absolute -bottom-1 -right-1 bg-gray-50 rounded-full">
                <img
                  src={ai(activity.id!, activity.assets.small_image)}
                  alt={activity.text}
                  className="w-5 h-5 text-gray-600 rounded-full border-gray-50 border-2"
                />
              </div>
            )}
          </div>
        ) : isLoadingCover ? (
          <div className="bg-gray-200 animate-pulse w-12 h-12 rounded shadow-lg shrink-0" />
        ) : activityData ? (
          <div className="relative shrink-0 bg-none">
            <img
              src={activityData.icon}
              alt={activity.text}
              width={40}
              height={40}
              className="w-12 h-12 rounded object-cover"
            />
          </div>
        ) : (
          <Gamepad className="w-12 h-12 text-gray-600 mt-0.5 shrink-0" />
        )}

        <div className="font-semibold flex flex-col">
          <span className="mb-1">{activity.status}</span>

          <span className="text-sm leading-none text-gray-500 inline-flex items-center gap-1">
            {displayIcon && (
              <span className="shrink-0 flex items-center justify-center [&_svg]:w-4 [&_svg]:h-4 translate-y-px">
                {displayIcon}
              </span>
            )}

            {displayText && <span>{displayText}</span>}
          </span>
        </div>
      </div>

      {activityData && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <ActivityModal data={activityData} />
        </Modal>
      )}
    </>
  );
}
