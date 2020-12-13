"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.search = exports.stream = exports.getVideoId = void 0;
const ytdl_core_1 = __importDefault(require("ytdl-core"));
const youtube_search_1 = __importDefault(require("youtube-search"));
const axios_1 = __importDefault(require("axios"));
const error_1 = require("../error");
const URL_REGEX = /https?:\/\/(?:(?:(?:www\.|m\.)?youtube\.com\/watch\?.*v=)|(?:www\.)?youtube(?:-nocookie)?\.com\/embed\/|youtu\.be\/)([a-zA-Z0-9_-]+).*/;
function getVideoId(url) {
    const matches = url.match(URL_REGEX);
    return matches === null ? null : matches[1];
}
exports.getVideoId = getVideoId;
async function asyncFilter(arr, fun) {
    const promises = arr.map(fun);
    const results = await Promise.all(promises);
    return arr.filter((_, i) => results[i]);
}
async function stream(id, options) {
    const info = await ytdl_core_1.default.getInfo(`https://www.youtube.com/watch?v=${id}`);
    const video = options && options.video;
    var formats = info.formats.filter((f) => f.hasAudio && (!video || f.hasVideo));
    if (options && options.sizeLimit) {
        const size = options.sizeLimit;
        formats = await asyncFilter(formats, async (f) => {
            const res = await axios_1.default.head(f.url);
            return res.headers["content-length"] <= size;
        });
    }
    if (formats.length === 0)
        throw new error_1.MsgError(error_1.ErrorType.UPLOAD_LIMIT);
    const stream = ytdl_core_1.default.downloadFromInfo(info, {
        ...options,
        format: formats[0],
    });
    return {
        info: {
            title: info.videoDetails.title,
            id: info.videoDetails.videoId,
            channelName: info.videoDetails.author.name,
            channelId: info.videoDetails.author.id,
        },
        stream,
    };
}
exports.stream = stream;
async function search(text, apiKey) {
    const { results } = await youtube_search_1.default(text, { key: apiKey });
    if (results.length === 0)
        return;
    const res = results[0];
    return {
        title: res.title,
        id: res.id,
        channelName: res.channelTitle,
        channelId: res.channelId,
    };
}
exports.search = search;
