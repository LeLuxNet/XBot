"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Discord = void 0;
const discord_js_1 = __importDefault(require("discord.js"));
const channel_1 = require("../channel");
const message_1 = require("../message");
const platform_1 = require("../platform");
const reaction_1 = require("../reaction");
const user_1 = require("../user");
const PLAYING = "Playing ";
const LISTENING_TO = "Listening to ";
const STREAMING = "Streaming ";
const WATCHING = "Watching ";
class Discord extends platform_1.Platform {
    constructor(token) {
        super("Discord");
        this.deleteTraces = false;
        this._token = token;
    }
    async start() {
        await new Promise((resolve, reject) => {
            this._client = new discord_js_1.default.Client();
            this._client.on("message", (msg) => {
                if (msg.author == this._client.user) {
                    return;
                }
                const channel = new channel_1.Channel(this, msg.channel, msg.channel instanceof discord_js_1.default.DMChannel
                    ? msg.channel.recipient.username
                    : msg.channel.name, msg.channel instanceof discord_js_1.default.DMChannel);
                const author = new user_1.User(this, msg.author, msg.author.username, msg.author.bot);
                this.emit("message", new message_1.Message(this, msg, msg.id, msg.content, channel, author));
            });
            this._client.on("messageReactionAdd", (r, u) => {
                const user = new user_1.User(this, u, u.username || "", u.bot);
                this._reactionRecieved(r.message.id, r.emoji.name, user);
            });
            this._client.on("ready", () => {
                this.log(`Started as "${this._client.user.tag}"`);
                resolve(null);
            });
            this._client.login(this._token);
        });
    }
    async stop() {
        await this._client.destroy();
        this.log("Stopped");
    }
    get me() {
        const self = this._client.user;
        return Promise.resolve(new user_1.User(this, self, self.username, self.bot));
    }
    async sendText(text, channel) {
        var msg = await channel._internal.send(text);
        return new message_1.Message(this, msg, msg.id, msg.content, channel, await this.me);
    }
    async sendFile(name, stream, type, channel) {
        var msg = await channel._internal.send({
            files: [stream],
        });
        return new message_1.Message(this, msg, msg.id, msg.content, channel, await this.me);
    }
    async deleteMessage(message) {
        await message._internal.delete();
    }
    async editMessage(message, text) {
        await message._internal.edit(text);
    }
    async addReaction(emoji, message) {
        var reaction = await message._internal.react(emoji);
        return new reaction_1.Reaction(this, reaction, emoji, message);
    }
    async removerUserReaction(reaction, user) {
        await reaction._internal.users.remove(user._internal);
    }
    async setPresence(presence, status) {
        var type;
        var newStatus;
        if (status.startsWith(PLAYING)) {
            newStatus = status.substring(PLAYING.length);
            type = "PLAYING";
        }
        else if (status.startsWith(LISTENING_TO)) {
            newStatus = status.substring(LISTENING_TO.length);
            type = "LISTENING";
        }
        else if (status.startsWith(WATCHING)) {
            newStatus = status.substring(WATCHING.length);
            type = "WATCHING";
        }
        else if (status.startsWith(STREAMING)) {
            newStatus = status.substring(STREAMING.length);
            type = "STREAMING";
        }
        else {
            throw new Error("Discord status messages have to start with Playing, Listening to, Watching or Streaming");
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
    async typing(channel, duration) {
        channel._internal.startTyping();
        setTimeout(() => channel._internal.stopTyping(), duration);
    }
}
exports.Discord = Discord;
