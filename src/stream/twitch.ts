import m3u8stream from "m3u8stream";
import { PassThrough } from "stream";
import { get } from "twitch-get-stream";

export async function audioStream(channel: string, options?: StreamOptions) {
  const streams = await get(channel);

  const info = streams.find((e) => e.quality === "Audio Only");
  if (info === undefined) return;

  const req = m3u8stream(info.url, options);
  const stream = new PassThrough({
    highWaterMark: (options && options.highWaterMark) || 1024 * 512,
  });

  req.pipe(stream);
  return stream;
}
