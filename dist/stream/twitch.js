"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.audioStream = void 0;
const m3u8stream_1 = __importDefault(require("m3u8stream"));
const stream_1 = require("stream");
const twitch_get_stream_1 = require("twitch-get-stream");
async function audioStream(channel, options) {
    const streams = await twitch_get_stream_1.get(channel);
    const info = streams.find((e) => e.quality === "Audio Only");
    if (info === undefined)
        return;
    const req = m3u8stream_1.default(info.url, options);
    const stream = new stream_1.PassThrough({
        highWaterMark: (options && options.highWaterMark) || 1024 * 512,
    });
    req.pipe(stream);
    return stream;
}
exports.audioStream = audioStream;
