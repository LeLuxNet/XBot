import sdcl from "soundcloud-downloader";

interface SongURL {
  artist: string;
  name: string;
}

const URL_REGEX = /https?:\/\/soundcloud.com\/(.*)\/(.*)/;
export function getSongData(url: string): SongURL | null {
  const matches = url.match(URL_REGEX);
  return matches === null ? null : { artist: matches[1], name: matches[2] };
}

export function stream(song: SongURL) {
  return sdcl.download(`https://soundcloud.com/${song.artist}/${song.name}`);
}
