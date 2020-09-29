import { Internal } from "./internal";
import { Message } from "./message";
import { Platform } from "./platform";
import { User } from "./user";

export class Reaction extends Internal {
  emoji: string;
  message: Message;
  listener?: (user: User) => void;

  constructor(
    platform: Platform,
    internal: any,
    emoji: string,
    message: Message
  ) {
    super(platform, internal);

    this.emoji = emoji;
    this.message = message;
  }

  listen(callback: (user: User) => void) {
    this.listener = callback;
    this.message._reactionListeners.set(this.emoji, this);
    this.platform._reactionMessages.set(this.message.id, this.message);
  }

  async removeUser(user: User) {
    await this.platform.removerUserReaction(this, user);
  }
}
