import { Internal } from "./internal";
import { Platform } from "./platform";
export declare class Channel extends Internal {
    name: string;
    dm: boolean;
    constructor(platform: Platform, internal: any, name: string, dm: boolean);
    sendMessage(text: string): Promise<import("./message").Message>;
    typing(timeout?: number): Promise<void>;
}
