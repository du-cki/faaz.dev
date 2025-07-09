import React from "react";

type Props = {
  name: string;
  role: string;
  description: string;
  period: {
    start: string;
    end: string;
  };
};

export default function Experience({ name, role, description, period }: Props) {
  return (
    <div className="border-l-2 border-gray-200 pl-6">
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-900 font-sans!">
          {name}
        </h3>

        <span className="text-sm text-gray-500 font-medium">
          {period.start} - {period.end}
        </span>
      </div>

      <p className="text-gray-600 font-medium! mb-6">{role}</p>

      <p className="text-gray-600 font-medium!">{description}</p>
    </div>
  );
}
