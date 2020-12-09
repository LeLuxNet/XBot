import { Channel } from "./channel";
import { Internal } from "./internal";
import { Platform } from "./platform";
import { Reaction } from "./reaction";
import { User } from "./user";

export class Message extends Internal {
  id: string;
  content: string;
  channel: Channel;
  author: User;
  reactions: Array<Reaction> = [];
  reactionButtons = true;
  _reactionListeners = new Map<string, Reaction>();

  constructor(
    platform: Platform,
    internal: any,
    id: string,
    content: string,
    channel: Channel,
    author: User
  ) {
    super(platform, internal);
    this.id = id;

    this.content = content;
    this.channel = channel;
    this.author = author;
  }

  async react(emoji: string) {
    var reaction = await this.platform.addReaction(emoji, this);

    this.reactions.push(reaction);
    return reaction;
  }

  async deleteReaction() {
    var r = await this.react("❌");
    r.listen(() => r.message.delete());
    return r;
  }

  async delete() {
    await this.platform.deleteMessage(this);
  }

  async edit(text: string) {
    await this.platform.editMessage(this, text);
  }

  deleteIn(seconds: number) {
    setTimeout(() => this.delete(), seconds * 1000);
  }
}

export enum FileType {
  IMAGE = 0,
  AUDIO = 1,
  VIDEO = 2,
  FILE = 3,
}
