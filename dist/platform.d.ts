/// <reference types="node" />
import { EventEmitter } from "events";
import { Channel } from "./channel";
import { Message } from "./message";
import { Presence } from "./presence";
import { Reaction } from "./reaction";
import { User } from "./user";
export declare abstract class Platform extends EventEmitter {
    name: string;
    _reactionMessages: Map<string, Message>;
    abstract deleteTraces: boolean;
    constructor(name: string);
    log(msg: string): void;
    abstract start(): Promise<void>;
    abstract stop(): Promise<void>;
    abstract sendMessage(text: string, channel: Channel): Promise<Message>;
    abstract deleteMessage(message: Message): Promise<void>;
    abstract editMessage(message: Message, text: string): Promise<void>;
    abstract addReaction(emoji: string, message: Message): Promise<Reaction>;
    abstract removerUserReaction(reaction: Reaction, user: User): Promise<void>;
    abstract setPresence(presence: Presence, status: string): Promise<void>;
    abstract typing(channel: Channel, timeout: number): Promise<void>;
    _reactionRecieved(messageId: string, emoji: string, user: User): Promise<void>;
}