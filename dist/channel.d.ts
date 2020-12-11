import { Internal } from "./internal";
import { FileType } from "./message";
import { Platform } from "./platform";
export declare class Channel extends Internal {
    name: string;
    dm: boolean;
    constructor(platform: Platform, internal: any, name: string, dm: boolean);
    sendText(text: string): Promise<import("./message").Message>;
    sendFile(name: string, fileName: string, type: FileType): Promise<import("./message").Message>;
    typing(timeout?: number): Promise<void>;
}
