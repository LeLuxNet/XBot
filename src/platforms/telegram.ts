// https://github.com/yagop/node-telegram-bot-api/issues/319
process.env["NTBA_FIX_319"] = "1";

import TelegramBot from "node-telegram-bot-api";
import { Channel } from "../channel";
import { FileType, Message } from "../message";
import { Platform } from "../platform";
import { Presence } from "../presence";
import { Reaction } from "../reaction";
import { User } from "../user";

export class Telegram extends Platform {
  deleteTraces = false;
  _bot: TelegramBot;

  constructor(token: string) {
    super("Telegram");

    this._bot = new TelegramBot(token);

    this._bot.on("message", (msg) => {
      if (msg.text === undefined) {
        return;
      }
      console.log(msg);

      const dm = msg.chat.type === "private";
      const chat = new Channel(
        this,
        msg.chat.id,
        (dm ? msg.chat.username : msg.chat.title) || "",
        dm
      );

      const user = new User(
        this,
        msg.from,
        getName(msg.from!),
        msg.from!.is_bot
      );

      this.emit(
        "message",
        new Message(
          this,
          msg.message_id,
          uniqueIdByIds(msg.message_id, msg.chat.id),
          msg.text,
          chat,
          user
        )
      );
    });

    this._bot.on("callback_query", (query) => {
      const id = uniqueIdByIds(
        query.message!.message_id,
        query.message!.chat.id
      );

      getName(query.from);

      this._reactionRecieved(
        id,
        query.data!,
        new User(this, query.from.id, getName(query.from), query.from.is_bot)
      );
    });
  }

  async start() {
    await this._bot.startPolling();
    this.log("Started");
  }

  async stop() {
    await this._bot.stopPolling();
    this.log("Stopped");
  }

  get me(): Promise<User> {
    return this._bot
      .getMe()
      .then((e) => new User(this, e, getName(e), e.is_bot));
  }

  async sendText(text: string, chat: Channel): Promise<Message> {
    const msg = await this._bot.sendMessage(chat._internal, text);
    return new Message(
      this,
      msg.message_id,
      uniqueIdByIds(msg.message_id, chat._internal),
      msg.text!,
      chat,
      await this.me
    );
  }

  async sendFile(
    name: string,
    fileName: string,
    type: FileType,
    chat: Channel
  ): Promise<Message> {
    var msg: TelegramBot.Message;
    switch (type) {
      case FileType.IMAGE:
        msg = await this._bot.sendPhoto(chat._internal, fileName);
      case FileType.AUDIO:
        msg = await this._bot.sendAudio(chat._internal, fileName, {
          title: name,
        });
      case FileType.VIDEO:
        msg = await this._bot.sendVideo(chat._internal, fileName);
      case FileType.FILE:
        msg = await this._bot.sendDocument(chat._internal, fileName);
    }

    return new Message(
      this,
      msg.message_id,
      uniqueIdByIds(msg.message_id, chat._internal),
      msg.text!,
      chat,
      await this.me
    );
  }

  async deleteMessage(message: Message) {
    await this._bot.deleteMessage(message.channel._internal, message._internal);
  }

  async editMessage(message: Message, text: string) {
    await this._bot.editMessageText(text, {
      chat_id: message.channel._internal,
      message_id: message._internal,
      reply_markup: getReactionData(message),
    });
  }

  async addReaction(emoji: string, message: Message): Promise<Reaction> {
    const data = getReactionData(message);
    data.inline_keyboard[0].push({
      text: emoji,
      callback_data: emoji,
    });

    const msg = <TelegramBot.Message>await this._bot.editMessageReplyMarkup(
      data,
      {
        chat_id: message.channel._internal,
        message_id: message._internal,
      }
    );
    return new Reaction(this, msg.message_id, emoji, message);
  }

  async removerUserReaction(reaction: Reaction, user: User): Promise<void> {
    throw "Not implemented";
  }

  async setPresence(presence: Presence, status: string) {
    throw "Not implemented";
  }

  async typing(channel: Channel, timeout: number) {
    this._bot.sendChatAction(channel._internal, "typing");
  }

  hasDeleteTraces() {
    return false;
  }
}

function uniqueIdByIds(msg_id: number, chat_id: number) {
  return chat_id.toString() + "_" + msg_id.toString();
}

function getReactionData(message: Message) {
  const line = message.reactions.map((r) => {
    return {
      text: r.emoji,
      callback_data: r.emoji,
    };
  });
  return {
    inline_keyboard: [line],
  };
}

function getName(user: TelegramBot.User) {
  if (user.last_name !== undefined) {
    return `${user.first_name} ${user.last_name}`;
  }
  return user.first_name;
}
