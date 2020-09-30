"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reaction = void 0;
const internal_1 = require("./internal");
class Reaction extends internal_1.Internal {
    constructor(platform, internal, emoji, message) {
        super(platform, internal);
        this.emoji = emoji;
        this.message = message;
    }
    listen(callback) {
        this.listener = callback;
        this.message._reactionListeners.set(this.emoji, this);
        this.platform._reactionMessages.set(this.message.id, this.message);
    }
    async removeUser(user) {
        await this.platform.removerUserReaction(this, user);
    }
}
exports.Reaction = Reaction;
