import { EventEmitter } from "events";
import { Channel } from "./channel";
import { Message } from "./message";
import { Presence } from "./presence";
import { Reaction } from "./reaction";
import { User } from "./user";

export abstract class Platform extends EventEmitter {
  name: string;
  _reactionMessages = new Map<string, Message>();
  abstract deleteTraces: boolean;

  constructor(name: string) {
    super();
    this.name = name;
  }

  log(msg: string) {
    console.log("[" + this.name + "] " + msg);
  }

  abstract async start(): Promise<void>;

  abstract async stop(): Promise<void>;

  abstract async sendMessage(text: string, channel: Channel): Promise<Message>;

  abstract async deleteMessage(message: Message): Promise<void>;

  abstract async editMessage(message: Message, text: string): Promise<void>;

  abstract async addReaction(
    emoji: string,
    message: Message
  ): Promise<Reaction>;

  abstract async removerUserReaction(
    reaction: Reaction,
    user: User
  ): Promise<void>;

  abstract async setPresence(presence: Presence, status: string): Promise<void>;

  abstract async typing(channel: Channel, timeout: number): Promise<void>;

  async _reactionRecieved(messageId: string, emoji: string, user: User) {
    const msg = this._reactionMessages.get(messageId);
    if (msg) {
      const reaction = msg._reactionListeners.get(emoji);
      if (reaction !== undefined) {
        if (msg.reactionButtons) {
          await reaction.removeUser(user);
        }
        reaction.listener!(user);
      }
    }
  }
}
