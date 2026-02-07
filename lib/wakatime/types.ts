type WakatimeResponse<T> = { data: T };

type Category = {
  decimals: string;
  digital: string;
  hours: number;
  minutes: number;
  name: string;
  percent: string;
  seconds: number;
  text: string;
  total_seconds: number;
};

export type WakatimeStatsResponse = WakatimeResponse<{
  categories: Category[];
  daily_average: number;
  daily_average_including_other_language: number;
  days_including_holidays: number;
  days_minus_holidays: number;
  editors: Category[];
  holidays: number;
  human_readable_daily_average: string;
  human_readable_daily_average_including_other_language: string;
  human_readable_range: string;
  human_readable_total: string;
  human_readable_total_including_other_language: string;
  id: string;
  is_already_updating: boolean;
  is_cached: boolean;
  is_category_usage_visible: boolean;
  is_coding_activity_visible: boolean;
  is_editor_usage_visible: boolean;
  is_including_today: boolean;
  is_language_usage_visible: boolean;
  is_os_usage_visible: boolean;
  is_stuck: boolean;
  is_up_to_date: boolean;
  is_up_to_date_pending_future: boolean;
  languages: Category[];
  operating_systems: Category[];
  percent_calculated: number;
  range: string;
  status: "ok";
  timeout: number;
  total_seconds: number;
  total_seconds_including_other_language: number;
  user_id: string;
  username: string;
  writes_only: boolean;
}>;

export type ProgramLanguage = {
  id: string;
  name: string;
  color: string;
  is_verified: boolean;
  created_at: string;
  modified_at: string;
};

export type WakatimeProgramLanguagesResponse = {
  data: ProgramLanguage[];
  total: number;
  total_pages: number;
};
