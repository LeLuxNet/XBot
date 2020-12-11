import { EventEmitter } from "events";
import { Channel } from "./channel";
import { FileType, Message } from "./message";
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

  abstract start(): Promise<void>;

  abstract stop(): Promise<void>;

  abstract get me(): Promise<User>;

  abstract sendText(text: string, channel: Channel): Promise<Message>;

  abstract sendFile(
    name: string,
    fileName: string,
    type: FileType,
    channel: Channel
  ): Promise<Message>;

  abstract deleteMessage(message: Message): Promise<void>;

  abstract editMessage(message: Message, text: string): Promise<void>;

  abstract addReaction(emoji: string, message: Message): Promise<Reaction>;

  abstract removerUserReaction(reaction: Reaction, user: User): Promise<void>;

  abstract setPresence(presence: Presence, status: string): Promise<void>;

  abstract typing(channel: Channel, timeout: number): Promise<void>;

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
