/// <reference types="node" />
import { Readable } from "stream";
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
export declare function getVideoId(url: string): string | null;
export declare function audioStream(id: string, options: StreamOptions): Promise<YTStream>;
export declare function search(text: string, apiKey: string): Promise<YTVideo | undefined>;
export {};
