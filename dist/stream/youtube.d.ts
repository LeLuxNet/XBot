/// <reference types="node" />
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
export declare function getVideoId(url: string): string | null;
export declare function audioStream(id: string): Promise<YTStream>;
export declare function search(text: string, apiKey: string): Promise<YTVideo | undefined>;
