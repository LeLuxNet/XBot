import { PassThrough, Readable } from "stream";

export interface StreamOptions {
  highWaterMark?: number;
  liveBuffer?: number;
  video?: boolean;
  sizeLimit?: number;
}

const highWaterMarkDefault = 1024 * 512; // 512 kB

export function bufferStream(
  stream: Readable,
  highWaterMark: number = highWaterMarkDefault
) {
  const resStream = new PassThrough({
    highWaterMark,
  });
  stream.pipe(resStream);

  return stream;
}
