import { Platform } from "../platform";
import sdk from "matrix-js-sdk";
import { Message } from "../message";
import { Channel } from "../channel";
import { Reaction } from "../reaction";
import { User } from "../user";
import { Presence } from "src/presence";
export declare class Matrix extends Platform {
    deleteTraces: boolean;
    userId: string;
    _client: sdk.MatrixClient;
    constructor(userId: string, accessToken: string, server: string);
    start(): Promise<void>;
    stop(): Promise<void>;
    sendMessage(text: string, room: Channel): Promise<Message>;
    deleteMessage(message: Message): Promise<void>;
    editMessage(message: Message, text: string): Promise<void>;
    addReaction(emoji: string, message: Message): Promise<Reaction>;
    removerUserReaction(reaction: Reaction, user: User): Promise<void>;
    setPresence(presence: Presence, status: string): Promise<void>;
    typing(room: Channel, timeout: number): Promise<void>;
}
