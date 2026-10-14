/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_NEXON_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
