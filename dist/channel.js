"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Channel = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
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
    async sendFile(fileName, stream, type, options = {}) {
        return await this.platform.sendFile(options.name || fileName, fileName, stream, type, this);
    }
    async sendLocalFile(path, type, options) {
        const stream = fs_1.createReadStream(path);
        return this.sendFile(path_1.basename(path), stream, type, options);
    }
    async typing(duration = 2000) {
        await this.platform.typing(this, duration);
    }
}
exports.Channel = Channel;
