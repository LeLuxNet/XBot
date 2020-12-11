import { Channel } from "./channel";
import { Internal } from "./internal";
import { Platform } from "./platform";
import { Reaction } from "./reaction";
import { User } from "./user";
export declare class Message extends Internal {
    id: string;
    content: string;
    channel: Channel;
    author: User;
    reactions: Array<Reaction>;
    reactionButtons: boolean;
    _reactionListeners: Map<string, Reaction>;
    constructor(platform: Platform, internal: any, id: string, content: string, channel: Channel, author: User);
    react(emoji: string): Promise<Reaction>;
    deleteReaction(): Promise<Reaction>;
    delete(): Promise<void>;
    edit(text: string): Promise<void>;
    deleteIn(seconds: number): void;
}
export declare enum FileType {
    IMAGE = 0,
    AUDIO = 1,
    VIDEO = 2,
    FILE = 3
}
