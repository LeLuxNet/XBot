"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Matrix = void 0;
const platform_1 = require("../platform");
const matrix_js_sdk_1 = __importDefault(require("matrix-js-sdk"));
const message_1 = require("../message");
const channel_1 = require("../channel");
const reaction_1 = require("../reaction");
const user_1 = require("../user");
class Matrix extends platform_1.Platform {
    constructor(userId, accessToken, server) {
        super("Matrix");
        this.deleteTraces = true;
        // 10 MB (default; varies from homeserver to homeserver)
        // The actual value is set after the start
        this.uploadLimit = 1024 * 1024 * 10;
        this.userId = userId.toLowerCase();
        this._client = matrix_js_sdk_1.default.createClient({
            baseUrl: server,
            accessToken: accessToken,
            userId: this.userId,
        });
        // Auto join
        this._client.on("RoomMember.membership", (event, member) => {
            if (member.membership === "invite" && member.userId === this.userId) {
                this._client.joinRoom(member.roomId);
            }
        });
        this._client.on("Room.timeline", (event, room, toStartOfTimeline) => {
            if (toStartOfTimeline) {
                return;
            }
            if (event.sender.userId === this.userId) {
                return;
            }
            console.log(event);
            if (event.getType() === "m.room.message") {
                // Ignore edits
                // @ts-ignore
                if (event.getContent()["m.new_content"]) {
                    return;
                }
                const channel = new channel_1.Channel(this, room.roomId, room.name, room.currentState.getJoinedMemberCount() === 2);
                const user = new user_1.User(this, event.sender.userId, event.sender.name, false);
                this.emit("message", new message_1.Message(this, 
                // @ts-ignore
                event.event_id, 
                // @ts-ignore
                event.event_id, event.getContent().body, channel, user));
                // @ts-ignore
            }
            else if (event.getType() === "m.reaction") {
                // @ts-ignore
                const data = event.getContent()["m.relates_to"];
                this._reactionRecieved(data.event_id, data.key, new user_1.User(this, event.sender.userId, event.sender.name, false));
            }
        });
    }
    async start() {
        await this._client.startClient({ initialSyncLimit: 0 });
        this._client.getMediaConfig().then((val) => {
            const uploadLimit = val["m.upload.size"];
            if (uploadLimit !== undefined) {
                this.uploadLimit = uploadLimit;
            }
        });
        this.log("Started");
    }
    async stop() {
        await this._client.stopClient();
        this.log("Stopped");
    }
    get me() {
        const self = this._client.getUserId();
        const user = new user_1.User(this, self, this._client.getUser(self).displayName, false);
        return Promise.resolve(user);
    }
    async sendText(text, room) {
        // @ts-ignore
        const event = await this._client.sendTextMessage(room._internal, text);
        return new message_1.Message(this, 
        // @ts-ignore
        event.event_id, 
        // @ts-ignore
        event.event_id, text, room, await this.me);
    }
    async sendFile(name, fileName, stream, type, room) {
        // @ts-ignore
        const upload = JSON.parse(await this._client.uploadContent(stream, {}));
        const content = {
            msgtype: ["m.image", "m.audio", "m.video", "m.file"][type],
            body: name,
            url: upload.content_uri,
        };
        // @ts-ignore
        const event = await this._client.sendMessage(room._internal, content);
        return new message_1.Message(this, 
        // @ts-ignore
        event.event_id, 
        // @ts-ignore
        event.event_id, "", room, await this.me);
    }
    async deleteMessage(message) {
        // @ts-ignore
        await this._client.redactEvent(message.channel._internal, message._internal);
    }
    async editMessage(message, text) {
        // @ts-ignore
        await this._client.sendEvent(message.channel._internal, "m.room.message", {
            body: "*" + text,
            msgtype: "m.text",
            "m.new_content": {
                body: text,
                msgtype: "m.text",
            },
            "m.relates_to": {
                event_id: message._internal,
                rel_type: "m.replace",
            },
        });
    }
    async addReaction(emoji, message) {
        // @ts-ignore
        var reaction = await this._client.sendEvent(message.channel._internal, "m.reaction", {
            "m.relates_to": {
                event_id: message._internal,
                key: emoji,
                rel_type: "m.annotation",
            },
        });
        // @ts-ignore
        return new reaction_1.Reaction(this, reaction.event_id, emoji, message);
    }
    async removerUserReaction(reaction, user) {
        // @ts-ignore
        await this._client.redactEvent(reaction.message.channel._internal, reaction._internal);
    }
    async setPresence(presence, status) {
        await this._client.setPresence({
            presence: ["online", "unavailable", "unavailable", "offline"][presence],
            status_msg: status,
        });
        this.log("Set presence");
    }
    async typing(room, duration) {
        await this._client.sendTyping(room._internal, true, duration);
    }
}
exports.Matrix = Matrix;
