import { PassThrough, Readable } from "stream";

export interface StreamOptions {
  highWaterMark?: number;
  liveBuffer?: number;
  video?: boolean;
  sizeLimit?: number;
}

const defaultWatermark = 1024 * 512; // 512 kB

export function bufferStream(
  stream: Readable,
  highWaterMark: number = defaultWatermark
) {
  const resStream = new PassThrough({
    highWaterMark,
  });
  stream.pipe(resStream);

  return stream;
}
