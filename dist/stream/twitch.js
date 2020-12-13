"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.audioStream = void 0;
const m3u8stream_1 = __importDefault(require("m3u8stream"));
const index_1 = require("./index");
const twitch_get_stream_1 = require("twitch-get-stream");
async function audioStream(channel, options) {
    const streams = await twitch_get_stream_1.get(channel);
    const info = streams.find((e) => e.quality === "Audio Only");
    if (info === undefined)
        return;
    const stream = m3u8stream_1.default(info.url, options);
    return index_1.bufferStream(stream, options && options.highWaterMark);
}
exports.audioStream = audioStream;
