/// <reference types="node" />
import { Readable } from "stream";
export interface StreamOptions {
    highWaterMark?: number;
    liveBuffer?: number;
    video?: boolean;
    sizeLimit?: number;
}
export declare function bufferStream(stream: Readable, highWaterMark?: number): Readable;
