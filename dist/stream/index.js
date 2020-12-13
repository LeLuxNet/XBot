"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bufferStream = void 0;
const stream_1 = require("stream");
const defaultWatermark = 1024 * 512; // 512 kB
function bufferStream(stream, highWaterMark = defaultWatermark) {
    const resStream = new stream_1.PassThrough({
        highWaterMark,
    });
    stream.pipe(resStream);
    return stream;
}
exports.bufferStream = bufferStream;
