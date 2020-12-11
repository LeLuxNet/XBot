import ytdl from "ytdl-core";
import ytSearch from "youtube-search";
import { Readable } from "stream";

export interface YTVideo {
  title: string;
  id: string;

  channelName: string;
  channelId: string;
}

export interface YTStream {
  info: YTVideo;
  stream: Readable;
}

const URL_REGEX = /https?:\/\/(?:(?:(?:www\.|m\.)?youtube\.com\/watch\?.*v=)|(?:www\.)?youtube(?:-nocookie)?\.com\/embed\/|youtu\.be\/)(.+)/;
export function getVideoId(url: string) {
  const matches = url.match(URL_REGEX);
  return matches === null ? null : matches[1];
}

export async function audioStream(id: string): Promise<YTStream> {
  const stream = await ytdl(`https://www.youtube.com/watch?v=${id}`);

  return new Promise((resolve, reject) =>
    stream.once("info", (info) =>
      resolve({
        info: {
          title: info.videoDetails.title,
          id: info.videoDetails.videoId,
          channelName: info.videoDetails.author.name,
          channelId: info.videoDetails.author.id,
        },
        stream,
      })
    )
  );
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
