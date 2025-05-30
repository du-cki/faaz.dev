"use client";

import React, { useEffect, useState } from "react";

import moment from "moment";
import ProgressBar from "./ProgressBar";

const timeDiff = ({ start }: { start: number }): Progress => ({
  start: moment.utc(moment().diff(start)).format("HH:mm:ss"),
});

const formatTime = (duration: number) => moment.utc(duration).format("mm:ss");

const calculatePercentage = ({
  start,
  end,
}: {
  start: number;
  end: number;
}): Progress => {
  let startTime = Date.now() - start;
  const endTime = end - start;

  if (startTime >= endTime) {
    startTime = endTime;
  }

  return {
    start: formatTime(startTime),
    end: formatTime(endTime),
    percentage: Math.round((startTime / endTime) * 100),
  };
};

type Progress = {
  start: string;
  end?: string;
  percentage?: number;
};

type Props = {
  timestamps?: {
    start?: number;
    end?: number;
  };
};

export default function Progress({ timestamps }: Props) {
  const hasBothTimestamps = timestamps?.start && timestamps?.end;
  const hasStartOnly = timestamps?.start && !timestamps?.end;

  const barType = hasBothTimestamps
    ? "percentage"
    : hasStartOnly
    ? "relative"
    : null;

  const strategy =
    barType === "percentage"
      ? calculatePercentage
      : barType === "relative"
      ? timeDiff
      : null;

  const [progress, setProgress] = useState<Option<Progress>>(
    // @ts-expect-error
    strategy ? strategy(timestamps) : null
  );

  useEffect(() => {
    let activeInterval: NodeJS.Timeout;

    if (timestamps && barType && strategy) {
      activeInterval = setInterval(() => {
        // @ts-ignore
        setProgress(strategy(timestamps));
      }, 1000);
    }

    return () => {
      activeInterval && clearInterval(activeInterval);
    };
  }, []);

  if (barType === "percentage" && progress?.percentage) {
    return (
      <>
        <ProgressBar percentage={progress.percentage!} />

        <div className="flex justify-between mt-1 *:!text-sm">
          <p>{progress.start}</p>
          <p>{progress.end}</p>
        </div>
      </>
    );
  }

  if (barType === "relative" && progress?.start) {
    return (
      <span className="font-extrabold text-green-400">{progress.start}</span>
    );
  }

  return <></>;
}
