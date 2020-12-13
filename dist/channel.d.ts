/// <reference types="node" />
import { Readable } from "stream";
import { Internal } from "./internal";
import { FileType } from "./message";
import { Platform } from "./platform";
interface FileOptions {
    name?: string;
}
export declare class Channel extends Internal {
    name: string;
    dm: boolean;
    constructor(platform: Platform, internal: any, name: string, dm: boolean);
    sendText(text: string): Promise<import("./message").Message>;
    sendFile(fileName: string, stream: Readable, type: FileType, options?: FileOptions): Promise<import("./message").Message>;
    sendLocalFile(path: string, type: FileType, options?: FileOptions): Promise<import("./message").Message>;
    typing(duration?: number): Promise<void>;
}
export {};
