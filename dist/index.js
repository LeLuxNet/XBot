"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.twitch = exports.youtube = exports.stopOnSignal = exports.envPlatforms = exports.MsgError = exports.ErrorType = exports.User = exports.Reaction = exports.Presence = exports.Platform = exports.FileType = exports.Message = exports.Channel = exports.Telegram = exports.Discord = exports.Matrix = void 0;
var matrix_1 = require("./platforms/matrix");
Object.defineProperty(exports, "Matrix", { enumerable: true, get: function () { return matrix_1.Matrix; } });
var discord_1 = require("./platforms/discord");
Object.defineProperty(exports, "Discord", { enumerable: true, get: function () { return discord_1.Discord; } });
var telegram_1 = require("./platforms/telegram");
Object.defineProperty(exports, "Telegram", { enumerable: true, get: function () { return telegram_1.Telegram; } });
var channel_1 = require("./channel");
Object.defineProperty(exports, "Channel", { enumerable: true, get: function () { return channel_1.Channel; } });
var message_1 = require("./message");
Object.defineProperty(exports, "Message", { enumerable: true, get: function () { return message_1.Message; } });
Object.defineProperty(exports, "FileType", { enumerable: true, get: function () { return message_1.FileType; } });
var platform_1 = require("./platform");
Object.defineProperty(exports, "Platform", { enumerable: true, get: function () { return platform_1.Platform; } });
var presence_1 = require("./presence");
Object.defineProperty(exports, "Presence", { enumerable: true, get: function () { return presence_1.Presence; } });
var reaction_1 = require("./reaction");
Object.defineProperty(exports, "Reaction", { enumerable: true, get: function () { return reaction_1.Reaction; } });
var user_1 = require("./user");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return user_1.User; } });
var error_1 = require("./error");
Object.defineProperty(exports, "ErrorType", { enumerable: true, get: function () { return error_1.ErrorType; } });
Object.defineProperty(exports, "MsgError", { enumerable: true, get: function () { return error_1.MsgError; } });
var general_1 = require("./general");
Object.defineProperty(exports, "envPlatforms", { enumerable: true, get: function () { return general_1.envPlatforms; } });
Object.defineProperty(exports, "stopOnSignal", { enumerable: true, get: function () { return general_1.stopOnSignal; } });
exports.youtube = __importStar(require("./stream/youtube"));
exports.twitch = __importStar(require("./stream/twitch"));
