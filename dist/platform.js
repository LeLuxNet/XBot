"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Platform = void 0;
const events_1 = require("events");
class Platform extends events_1.EventEmitter {
    constructor(name) {
        super();
        this._reactionMessages = new Map();
        this.name = name;
    }
    log(msg) {
        console.log("[" + this.name + "] " + msg);
    }
    async _reactionRecieved(messageId, emoji, user) {
        const msg = this._reactionMessages.get(messageId);
        if (msg) {
            const reaction = msg._reactionListeners.get(emoji);
            if (reaction !== undefined) {
                if (msg.reactionButtons) {
                    await reaction.removeUser(user);
                }
                reaction.listener(user);
            }
        }
    }
}
exports.Platform = Platform;
