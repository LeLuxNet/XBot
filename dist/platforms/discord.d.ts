import DiscordJs from "discord.js";
import { Channel } from "../channel";
import { Message } from "../message";
import { Platform } from "../platform";
import { Presence } from "../presence";
import { Reaction } from "../reaction";
import { User } from "../user";
export declare class Discord extends Platform {
    deleteTraces: boolean;
    _token: string;
    _client?: DiscordJs.Client;
    constructor(token: string);
    start(): Promise<void>;
    stop(): Promise<void>;
    sendMessage(text: string, channel: Channel): Promise<Message>;
    deleteMessage(message: Message): Promise<void>;
    editMessage(message: Message, text: string): Promise<void>;
    addReaction(emoji: string, message: Message): Promise<Reaction>;
    removerUserReaction(reaction: Reaction, user: User): Promise<void>;
    setPresence(presence: Presence, status: string): Promise<void>;
    typing(channel: Channel, timeout: number): Promise<void>;
}
