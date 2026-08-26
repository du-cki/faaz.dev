import { Tooltip } from "react-tooltip";
import { Socials } from "@/utils/constants";

export default function SocialLinks() {
  return (
    <div className="flex gap-4 mb-8">
      <Tooltip id="connection-tooltip" style={{ padding: 5 }} />

      {Socials.map(({ name, href, icon: Icon }) => (
        <a
          key={name}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-gray-900 transition-colors"
          data-tooltip-content={name}
          data-tooltip-place="top"
          data-tooltip-id="connection-tooltip"
        >
          <Icon className="w-6 h-6" />
        </a>
      ))}
    </div>
  );
}
