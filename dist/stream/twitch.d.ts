/// <reference types="node" />
import { StreamOptions } from "./index";
export declare function audioStream(channel: string, options?: StreamOptions): Promise<import("stream").Readable | undefined>;
