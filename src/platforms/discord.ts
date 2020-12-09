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

        this.emit(
          "message",
          new Message(
            this,
            msg,
            msg.id,
            msg.content,
            new Channel(
              this,
              msg.channel,
              msg.channel instanceof DiscordJs.DMChannel
                ? msg.channel.recipient.username
                : msg.channel.name,
              msg.channel instanceof DiscordJs.DMChannel
            )
          )
        );
      });

      this._client.on("messageReactionAdd", (r, u) => {
        const user = new User(this, u, u.username || "");
        this._reactionRecieved(r.message.id, r.emoji.name, user);
      });

      this._client.on("ready", () => {
        this.log(`Started as "${this._client!.user!.tag}"`);
        resolve();
      });

      this._client.login(this._token);
    });
  }

  async stop() {
    await this._client!.destroy();
    this.log("Stopped");
  }

  async sendText(text: string, channel: Channel): Promise<Message> {
    var msg = await channel._internal.send(text);
    return new Message(this, msg, msg.id, msg.content, channel);
  }

  async sendFile(
    name: string,
    fileName: string,
    type: FileType,
    channel: Channel
  ): Promise<Message> {
    var msg = await channel._internal.send({
      file: [{ attachment: fileName, name }],
    });
    return new Message(this, msg, msg.id, msg.content, channel);
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
