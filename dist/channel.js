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
    async sendText(text) {
        return await this.platform.sendText(text, this);
    }
    async sendFile(name, stream, type) {
        return await this.platform.sendFile(name, stream, type, this);
    }
    async typing(duration = 2000) {
        await this.platform.typing(this, duration);
    }
}
exports.Channel = Channel;
