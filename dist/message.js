"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileType = exports.Message = void 0;
const internal_1 = require("./internal");
class Message extends internal_1.Internal {
    constructor(platform, internal, id, content, channel, author) {
        super(platform, internal);
        this.reactions = [];
        this.reactionButtons = true;
        this._reactionListeners = new Map();
        this.id = id;
        this.content = content;
        this.channel = channel;
        this.author = author;
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
var FileType;
(function (FileType) {
    FileType[FileType["IMAGE"] = 0] = "IMAGE";
    FileType[FileType["AUDIO"] = 1] = "AUDIO";
    FileType[FileType["VIDEO"] = 2] = "VIDEO";
    FileType[FileType["FILE"] = 3] = "FILE";
})(FileType = exports.FileType || (exports.FileType = {}));
