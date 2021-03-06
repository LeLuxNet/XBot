import { Message } from "./message";

export { Matrix } from "./platforms/matrix";
export { Discord } from "./platforms/discord";
export { Telegram } from "./platforms/telegram";

export { Channel } from "./channel";
export { Message, FileType } from "./message";
export { Platform } from "./platform";
export { Presence } from "./presence";
export { Reaction } from "./reaction";
export { User } from "./user";

export { ErrorType, MsgError } from "./error";

export { envPlatforms, stopOnSignal } from "./general";

export * as youtube from "./stream/youtube";
export * as twitch from "./stream/twitch";
export * as soundcloud from "./stream/soundcloud";
