"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.search = exports.audioStream = exports.getVideoId = void 0;
const ytdl_core_1 = __importDefault(require("ytdl-core"));
const youtube_search_1 = __importDefault(require("youtube-search"));
const URL_REGEX = /https?:\/\/(?:(?:(?:www\.|m\.)?youtube\.com\/watch\?.*v=)|(?:www\.)?youtube(?:-nocookie)?\.com\/embed\/|youtu\.be\/)(.+)/;
function getVideoId(url) {
    const matches = url.match(URL_REGEX);
    return matches === null ? null : matches[1];
}
exports.getVideoId = getVideoId;
async function audioStream(id, options) {
    const stream = await ytdl_core_1.default(`https://www.youtube.com/watch?v=${id}`, {
        ...options,
        filter: "audio",
    });
    return new Promise((resolve, reject) => stream.once("info", (info) => resolve({
        info: {
            title: info.videoDetails.title,
            id: info.videoDetails.videoId,
            channelName: info.videoDetails.author.name,
            channelId: info.videoDetails.author.id,
        },
        stream,
    })));
}
exports.audioStream = audioStream;
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
