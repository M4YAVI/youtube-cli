export interface Transcript {
  videoId: string;
  title: string;
  duration: number;
  text: string;
  source: "YouTube" | "Gemini 2.5 Flash";
  url?: string;
}

export interface TranscriptOptions {
  generateIfMissing?: boolean;
  geminiApiKey?: string;
  format?: "txt" | "json" | "md";
  output?: string;
}

export interface VideoMetadata {
  title: string;
  duration: number;
  thumbnail?: string;
  channel?: string;
}

export interface AppConfig {
  geminiApiKey?: string;
  defaultFormat?: "txt" | "json" | "md";
  outputDir?: string;
}
