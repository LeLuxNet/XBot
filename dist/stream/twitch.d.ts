/// <reference types="node" />
import { PassThrough } from "stream";
export declare function audioStream(channel: string, options?: StreamOptions): Promise<PassThrough | undefined>;
