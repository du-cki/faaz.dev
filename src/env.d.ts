interface ImportMetaEnv {
  WAKATIME_API_KEY: string;
  LASTFM_API_KEY: string;
  TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

type Option<T> = T | null;
