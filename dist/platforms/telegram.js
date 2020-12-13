"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Telegram = void 0;
// https://github.com/yagop/node-telegram-bot-api/issues/319
process.env["NTBA_FIX_319"] = "1";
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const channel_1 = require("../channel");
const message_1 = require("../message");
const platform_1 = require("../platform");
const reaction_1 = require("../reaction");
const user_1 = require("../user");
class Telegram extends platform_1.Platform {
    constructor(token) {
        super("Telegram");
        this.deleteTraces = false;
        this.uploadLimit = 1024 * 1024 * 50; // 50 MB
        this._bot = new node_telegram_bot_api_1.default(token);
        this._bot.on("message", (msg) => {
            if (msg.text === undefined) {
                return;
            }
            console.log(msg);
            const dm = msg.chat.type === "private";
            const chat = new channel_1.Channel(this, msg.chat.id, (dm ? msg.chat.username : msg.chat.title) || "", dm);
            const user = new user_1.User(this, msg.from, getName(msg.from), msg.from.is_bot);
            this.emit("message", new message_1.Message(this, msg.message_id, uniqueIdByIds(msg.message_id, msg.chat.id), msg.text, chat, user));
        });
        this._bot.on("callback_query", (query) => {
            const id = uniqueIdByIds(query.message.message_id, query.message.chat.id);
            getName(query.from);
            this._reactionRecieved(id, query.data, new user_1.User(this, query.from.id, getName(query.from), query.from.is_bot));
        });
    }
    async start() {
        await this._bot.startPolling();
        this.log("Started");
    }
    async stop() {
        await this._bot.stopPolling();
        this.log("Stopped");
    }
    get me() {
        return this._bot
            .getMe()
            .then((e) => new user_1.User(this, e, getName(e), e.is_bot));
    }
    async sendText(text, chat) {
        const msg = await this._bot.sendMessage(chat._internal, text);
        return new message_1.Message(this, msg.message_id, uniqueIdByIds(msg.message_id, chat._internal), msg.text, chat, await this.me);
    }
    async sendFile(name, fileName, stream, type, chat) {
        var msg;
        switch (type) {
            case message_1.FileType.IMAGE:
                msg = await this._bot.sendPhoto(chat._internal, stream);
            case message_1.FileType.AUDIO:
                msg = await this._bot.sendAudio(chat._internal, stream, {
                    title: name,
                });
            case message_1.FileType.VIDEO:
                msg = await this._bot.sendVideo(chat._internal, stream);
            case message_1.FileType.FILE:
                msg = await this._bot.sendDocument(chat._internal, stream);
        }
        return new message_1.Message(this, msg.message_id, uniqueIdByIds(msg.message_id, chat._internal), "", chat, await this.me);
    }
    async deleteMessage(message) {
        await this._bot.deleteMessage(message.channel._internal, message._internal);
    }
    async editMessage(message, text) {
        await this._bot.editMessageText(text, {
            chat_id: message.channel._internal,
            message_id: message._internal,
            reply_markup: getReactionData(message),
        });
    }
    async addReaction(emoji, message) {
        const data = getReactionData(message);
        data.inline_keyboard[0].push({
            text: emoji,
            callback_data: emoji,
        });
        const msg = await this._bot.editMessageReplyMarkup(data, {
            chat_id: message.channel._internal,
            message_id: message._internal,
        });
        return new reaction_1.Reaction(this, msg.message_id, emoji, message);
    }
    async removerUserReaction(reaction, user) {
        throw "Not implemented";
    }
    async setPresence(presence, status) {
        throw "Not implemented";
    }
    async typing(channel, duration) {
        this._bot.sendChatAction(channel._internal, "typing");
    }
    hasDeleteTraces() {
        return false;
    }
}
exports.Telegram = Telegram;
function uniqueIdByIds(msg_id, chat_id) {
    return chat_id.toString() + "_" + msg_id.toString();
}
function getReactionData(message) {
    const line = message.reactions.map((r) => {
        return {
            text: r.emoji,
            callback_data: r.emoji,
        };
    });
    return {
        inline_keyboard: [line],
    };
}
function getName(user) {
    if (user.last_name !== undefined) {
        return `${user.first_name} ${user.last_name}`;
    }
    return user.first_name;
}
