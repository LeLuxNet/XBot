import { Internal } from "./internal";
import { Message } from "./message";
import { Platform } from "./platform";
import { User } from "./user";
export declare class Reaction extends Internal {
    emoji: string;
    message: Message;
    listener?: (user: User) => void;
    constructor(platform: Platform, internal: any, emoji: string, message: Message);
    listen(callback: (user: User) => void): void;
    removeUser(user: User): Promise<void>;
}
