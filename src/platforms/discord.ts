import DiscordJs from "discord.js";
import { Channel } from "../channel";
import { FileType, Message } from "../message";
import { Platform } from "../platform";
import { Presence } from "../presence";
import { Reaction } from "../reaction";
import { User } from "../user";

const PLAYING = "Playing ";
const LISTENING_TO = "Listening to ";
const STREAMING = "Streaming ";
const WATCHING = "Watching ";

export class Discord extends Platform {
  deleteTraces = false;
  _token: string;
  _client?: DiscordJs.Client;

  constructor(token: string) {
    super("Discord");
    this._token = token;
  }

  async start() {
    await new Promise((resolve, reject) => {
      this._client = new DiscordJs.Client();

      this._client.on("message", (msg) => {
        if (msg.author == this._client!.user) {
          return;
        }

        const channel = new Channel(
          this,
          msg.channel,
          msg.channel instanceof DiscordJs.DMChannel
            ? msg.channel.recipient.username
            : msg.channel.name,
          msg.channel instanceof DiscordJs.DMChannel
        );

        const author = new User(
          this,
          msg.author,
          msg.author.username,
          msg.author.bot
        );

        this.emit(
          "message",
          new Message(this, msg, msg.id, msg.content, channel, author)
        );
      });

      this._client.on("messageReactionAdd", (r, u) => {
        const user = new User(this, u, u.username || "", u.bot);
        this._reactionRecieved(r.message.id, r.emoji.name, user);
      });

      this._client.on("ready", () => {
        this.log(`Started as "${this._client!.user!.tag}"`);
        resolve(null);
      });

      this._client.login(this._token);
    });
  }

  async stop() {
    await this._client!.destroy();
    this.log("Stopped");
  }

  public get me(): Promise<User> {
    const self = this._client!.user!;
    return Promise.resolve(new User(this, self, self.username, self.bot));
  }

  async sendText(text: string, channel: Channel): Promise<Message> {
    var msg = await channel._internal.send(text);
    return new Message(this, msg, msg.id, msg.content, channel, await this.me);
  }

  async sendFile(
    name: string,
    fileName: string,
    type: FileType,
    channel: Channel
  ): Promise<Message> {
    var msg = await channel._internal.send({
      files: [fileName],
    });
    return new Message(this, msg, msg.id, msg.content, channel, await this.me);
  }

  async deleteMessage(message: Message) {
    await message._internal.delete();
  }

  async editMessage(message: Message, text: string) {
    await message._internal.edit(text);
  }

  async addReaction(emoji: string, message: Message): Promise<Reaction> {
    var reaction = await message._internal.react(emoji);
    return new Reaction(this, reaction, emoji, message);
  }

  async removerUserReaction(reaction: Reaction, user: User) {
    await reaction._internal.users.remove(user._internal);
  }

  async setPresence(presence: Presence, status: string) {
    var type: "PLAYING" | "STREAMING" | "LISTENING" | "WATCHING";
    var newStatus;
    if (status.startsWith(PLAYING)) {
      newStatus = status.substring(PLAYING.length);
      type = "PLAYING";
    } else if (status.startsWith(LISTENING_TO)) {
      newStatus = status.substring(LISTENING_TO.length);
      type = "LISTENING";
    } else if (status.startsWith(WATCHING)) {
      newStatus = status.substring(WATCHING.length);
      type = "WATCHING";
    } else if (status.startsWith(STREAMING)) {
      newStatus = status.substring(STREAMING.length);
      type = "STREAMING";
    } else {
      throw new Error(
        "Discord status messages have to start with Playing, Listening to, Watching or Streaming"
      );
    }

    await this._client!.user!.setPresence({
      activity: {
        name: newStatus,
        type,
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      },
      status: (<const>["online", "idle", "dnd", "invisible"])[presence],
    });
    this.log("Set presence");
  }

  async typing(channel: Channel, timeout: number) {
    channel._internal.startTyping();
    setTimeout(() => channel._internal.stopTyping(), timeout);
  }
}
