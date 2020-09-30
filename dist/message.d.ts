import { Channel } from "./channel";
import { Internal } from "./internal";
import { Platform } from "./platform";
import { Reaction } from "./reaction";
export declare class Message extends Internal {
    id: string;
    content: string;
    channel: Channel;
    reactions: Array<Reaction>;
    reactionButtons: boolean;
    _reactionListeners: Map<string, Reaction>;
    constructor(platform: Platform, internal: any, id: string, content: string, channel: Channel);
    react(emoji: string): Promise<Reaction>;
    deleteReaction(): Promise<Reaction>;
    delete(): Promise<void>;
    edit(text: string): Promise<void>;
    deleteIn(seconds: number): void;
}
