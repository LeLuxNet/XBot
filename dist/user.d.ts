import { Internal } from "./internal";
import { Platform } from "./platform";
export declare class User extends Internal {
    name: string;
    constructor(platform: Platform, internal: any, name: string);
}
