"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const internal_1 = require("./internal");
class Message extends internal_1.Internal {
    constructor(platform, internal, id, content, channel) {
        super(platform, internal);
        this.reactions = [];
        this.reactionButtons = true;
        this._reactionListeners = new Map();
        this.id = id;
        this.content = content;
        this.channel = channel;
    }
    async react(emoji) {
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
    async edit(text) {
        await this.platform.editMessage(this, text);
    }
    deleteIn(seconds) {
        setTimeout(() => this.delete(), seconds * 1000);
    }
}
exports.Message = Message;
