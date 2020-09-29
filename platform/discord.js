const DiscordJs = require("discord.js");

const Platform = require("./base");
const Channel = require("../objects/channel");
const Message = require("../objects/message");
const Reaction = require("../objects/reaction");
const User = require("../objects/user");

const PLAYING = "Playing ";
const LISTENING_TO = "Listening to ";
const STREAMING = "Streaming ";
const WATCHING = "Watching ";

class Discord extends Platform {
  constructor(token, handle) {
    super("Discord", handle);
    this._token = token;
  }

  async start() {
    return await new Promise((resolve, reject) => {
      this._client = new DiscordJs.Client();

      this._client.on("message", (msg) => {
        if (msg.author == this._client.user) {
          return;
        }

        const dm = msg.channel instanceof DiscordJs.DMChannel;
        this.handle.handleMessage(
          new Message(
            this,
            msg,
            msg.id,
            msg.content,
            new Channel(
              this,
              msg.channel,
              dm ? msg.channel.recipient.username : msg.channel.name,
              dm
            )
          )
        );
      });

      this._client.on("messageReactionAdd", (r, u) => {
        const user = new User(this, u, u.username);
        this._reactionRecieved(r.message.id, r.emoji.name, user);
      });

      this._client.on("ready", () => {
        this.log(`Started as "${this._client.user.tag}"`);
        resolve();
      });

      this._client.login(this._token);
    });
  }

  async stop() {
    await this._client.destroy();
    this.log("Stopped");
  }

  async sendMessage(text, channel) {
    var msg = await channel._internal.send(text);
    return new Message(this, msg, msg.id, msg.content, channel);
  }

  async deleteMessage(message) {
    await message._internal.delete();
  }

  async editMessage(message, text) {
    await message._internal.edit(text);
  }

  async addReaction(emoji, message) {
    var reaction = await message._internal.react(emoji);
    return new Reaction(this, reaction, emoji, message);
  }

  async removerUserReaction(reaction, user) {
    console.log(reaction);
    console.log(user);
    await reaction._internal.users.remove(user._internal);
  }

  async setPresence(presence, status) {
    var type;
    var newStatus;
    if (status.startsWith(PLAYING)) {
      newStatus = status.substring(PLAYING.length);
      type = "PLAYING";
    } else if (status.startsWith(LISTENING_TO)) {
      newStatus = status.substring(LISTENING_TO.length);
      type = "LISTENING_TO";
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

    await this._client.user.setPresence({
      activity: {
        name: newStatus,
        type,
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      },
      status: ["online", "idle", "dnd", "invisible"][presence],
    });
    this.log("Set presence");
  }

  async typing(channel, timeout) {
    channel._internal.startTyping();
    setTimeout(() => channel._internal.stopTyping(), timeout);
  }

  hasDeleteTraces() {
    return false;
  }
}

module.exports = Discord;
