import ytdl from "ytdl-core";
import ytSearch from "youtube-search";
import { StreamOptions } from "./index";
import { Readable } from "stream";
import axios from "axios";
import { ErrorType, MsgError } from "../error";

interface YTVideo {
  title: string;
  id: string;

  channelName: string;
  channelId: string;
}

interface YTStream {
  info: YTVideo;
  stream: Readable;
}

const URL_REGEX = /https?:\/\/(?:(?:(?:www\.|m\.)?youtube\.com\/watch\?.*v=)|(?:www\.)?youtube(?:-nocookie)?\.com\/embed\/|youtu\.be\/)([a-zA-Z0-9_-]+).*/;
export function getVideoId(url: string) {
  const matches = url.match(URL_REGEX);
  return matches === null ? null : matches[1];
}

async function asyncFilter<T>(
  arr: T[],
  fun: (val: T) => Promise<boolean>
): Promise<T[]> {
  const promises = arr.map(fun);
  const results = await Promise.all(promises);
  return arr.filter((_, i) => results[i]);
}

export async function stream(
  id: string,
  options?: StreamOptions
): Promise<YTStream> {
  const info = await ytdl.getInfo(`https://www.youtube.com/watch?v=${id}`);

  const video = options && options.video;
  var formats = info.formats.filter(
    (f) => f.hasAudio && (!video || f.hasVideo)
  );

  if (options && options.sizeLimit) {
    const size = options.sizeLimit;

    formats = await asyncFilter(formats, async (f) => {
      const res = await axios.head(f.url);
      return res.headers["content-length"] <= size;
    });
  }

  if (formats.length === 0) throw new MsgError(ErrorType.UPLOAD_LIMIT);

  const stream = ytdl.downloadFromInfo(info, {
    ...options,
    format: formats[0],
  });

  return {
    info: {
      title: info.videoDetails.title,
      id: info.videoDetails.videoId,
      channelName: info.videoDetails.author.name,
      channelId: info.videoDetails.author.id,
    },
    stream,
  };
}

export async function search(
  text: string,
  apiKey: string
): Promise<YTVideo | undefined> {
  const { results } = await ytSearch(text, { key: apiKey });
  if (results.length === 0) return;

  const res = results[0];
  return {
    title: res.title,
    id: res.id,
    channelName: res.channelTitle,
    channelId: res.channelId,
  };
}
