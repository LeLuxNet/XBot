/// <reference types="node" />
import { Platform } from "../platform";
import sdk from "matrix-js-sdk";
import { FileType, Message } from "../message";
import { Channel } from "../channel";
import { Reaction } from "../reaction";
import { User } from "../user";
import { Presence } from "src/presence";
import { Readable } from "stream";
export declare class Matrix extends Platform {
    userId: string;
    _client: sdk.MatrixClient;
    deleteTraces: boolean;
    uploadLimit: number;
    constructor(userId: string, accessToken: string, server: string);
    start(): Promise<void>;
    stop(): Promise<void>;
    get me(): Promise<User>;
    sendText(text: string, room: Channel): Promise<Message>;
    sendFile(name: string, fileName: string, stream: Readable, type: FileType, room: Channel): Promise<Message>;
    deleteMessage(message: Message): Promise<void>;
    editMessage(message: Message, text: string): Promise<void>;
    addReaction(emoji: string, message: Message): Promise<Reaction>;
    removerUserReaction(reaction: Reaction, user: User): Promise<void>;
    setPresence(presence: Presence, status: string): Promise<void>;
    typing(room: Channel, duration: number): Promise<void>;
}
