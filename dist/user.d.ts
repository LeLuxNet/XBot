import { Internal } from "./internal";
import { Platform } from "./platform";
export declare class User extends Internal {
    name: string;
    bot: boolean;
    constructor(platform: Platform, internal: any, name: string, bot: boolean);
}
