import React from "react";

type Props = {
  percentage: number;
};

export default function ProgressBar({ percentage }: Props) {
  return (
    <div className="rounded-full h-1 bg-gray-300 dark:bg-gray-700">
      <div
        className="bg-gray-700 dark:bg-white h-1 rounded-full"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
