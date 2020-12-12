declare module "twitch-get-stream" {
  interface StreamLink {
    quality: string | "Source" | "Audio Only";
    resolution: string | null;
    url: string;
  }

  export function get(channel: string): Promise<StreamLink[]>;
}
