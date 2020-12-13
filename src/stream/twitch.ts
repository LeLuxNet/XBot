import m3u8stream from "m3u8stream";
import { bufferStream, StreamOptions } from "./index";
import { get } from "twitch-get-stream";
import { ErrorType, MsgError } from "../error";

export async function audioStream(channel: string, options?: StreamOptions) {
  const streams = await get(channel);

  const info = streams.find((e) => e.quality === "Audio Only");
  if (info === undefined) throw new MsgError(ErrorType.ERROR_GETTING_STREAM);

  const stream = m3u8stream(info.url, options);
  return bufferStream(stream, options && options.highWaterMark);
}
