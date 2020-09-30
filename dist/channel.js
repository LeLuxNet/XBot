"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Channel = void 0;
const internal_1 = require("./internal");
class Channel extends internal_1.Internal {
    constructor(platform, internal, name, dm) {
        super(platform, internal);
        this.name = name;
        this.dm = dm;
    }
    async sendMessage(text) {
        return await this.platform.sendMessage(text, this);
    }
    async typing(timeout = 2000) {
        await this.platform.typing(this, timeout);
    }
}
exports.Channel = Channel;
