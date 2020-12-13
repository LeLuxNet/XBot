/// <reference types="node" />
import TelegramBot from "node-telegram-bot-api";
import { Readable } from "stream";
import { Channel } from "../channel";
import { FileType, Message } from "../message";
import { Platform } from "../platform";
import { Presence } from "../presence";
import { Reaction } from "../reaction";
import { User } from "../user";
export declare class Telegram extends Platform {
    _bot: TelegramBot;
    deleteTraces: boolean;
    uploadLimit: number;
    constructor(token: string);
    start(): Promise<void>;
    stop(): Promise<void>;
    get me(): Promise<User>;
    sendText(text: string, chat: Channel): Promise<Message>;
    sendFile(name: string, fileName: string, stream: Readable, type: FileType, chat: Channel): Promise<Message>;
    deleteMessage(message: Message): Promise<void>;
    editMessage(message: Message, text: string): Promise<void>;
    addReaction(emoji: string, message: Message): Promise<Reaction>;
    removerUserReaction(reaction: Reaction, user: User): Promise<void>;
    setPresence(presence: Presence, status: string): Promise<void>;
    typing(channel: Channel, duration: number): Promise<void>;
    hasDeleteTraces(): boolean;
}
