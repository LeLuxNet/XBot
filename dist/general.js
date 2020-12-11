"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stopOnSignal = exports.envPlatforms = void 0;
const discord_1 = require("./platforms/discord");
const matrix_1 = require("./platforms/matrix");
const telegram_1 = require("./platforms/telegram");
function envPlatforms() {
    const { DISCORD_TOKEN, MATRIX_USER, MATRIX_TOKEN, MATRIX_SERVER, TELEGRAM_TOKEN, } = process.env;
    const clients = [];
    if (DISCORD_TOKEN != undefined) {
        clients.push(new discord_1.Discord(DISCORD_TOKEN));
    }
    if (MATRIX_USER !== undefined &&
        MATRIX_TOKEN !== undefined &&
        MATRIX_SERVER !== undefined) {
        clients.push(new matrix_1.Matrix(MATRIX_USER, MATRIX_TOKEN, MATRIX_SERVER));
    }
    if (TELEGRAM_TOKEN !== undefined) {
        clients.push(new telegram_1.Telegram(TELEGRAM_TOKEN));
    }
    return clients;
}
exports.envPlatforms = envPlatforms;
function stopOnSignal(clients) {
    process.on("SIGINT", async () => {
        await Promise.all(clients.map((c) => c.stop()));
        process.exit();
    });
}
exports.stopOnSignal = stopOnSignal;
