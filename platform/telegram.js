const Platform = require("./base");
const TelegramBot = require("node-telegram-bot-api");
const Message = require("../objects/message");
const Channel = require("../objects/channel");
const Reaction = require("../objects/reaction");

class Telegram extends Platform {
  constructor(token, handle) {
    super("Telegram", handle);

    this._bot = new TelegramBot(token);

    this._bot.on("message", (msg) => {
      if (msg.text === undefined) {
        return;
      }
      console.log(msg);

      const dm = msg.chat.type === "private";
      this.handle.handleMessage(
        new Message(
          this,
          msg.message_id,
          uniqueIdByIds(msg.message_id, msg.chat.id),
          msg.text,
          new Channel(
            this,
            msg.chat.id,
            dm ? msg.chat.username : msg.chat.title,
            dm
          )
        )
      );
    });

    this._bot.on("callback_query", (query) => {
      const id = uniqueIdByIds(query.message.message_id, query.message.chat.id);
      this._reactionRecieved(id, query.data);
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

  async sendMessage(text, chat) {
    const msg = await this._bot.sendMessage(chat._internal, text);
    return new Message(
      this,
      msg.message_id,
      uniqueIdByIds(msg.message_id, chat._internal),
      msg.text,
      chat
    );
  }

  async deleteMessage(message) {
    await this._bot.deleteMessage(message.channel._internal, message._internal);
  }

  async editMessage(message, text) {
    await this._bot.editMessageText(text, {
      chat_id: message.channel._internal,
      message_id: message._internal,
      reply_markup: getReactionData(message),
    });
  }

  async addReaction(emoji, message) {
    const data = getReactionData(message);
    data.inline_keyboard[0].push({
      text: emoji,
      callback_data: emoji,
    });

    const msg = await this._bot.editMessageReplyMarkup(data, {
      chat_id: message.channel._internal,
      message_id: message._internal,
    });
    return new Reaction(this, msg.message_id, emoji, message);
  }

  async typing(channel, timeout) {
    this._bot.sendChatAction(channel._internal, "typing");
  }

  hasDeleteTraces() {
    return false;
  }
}

function uniqueIdByIds(msg_id, chat_id) {
  return chat_id.toString() + "_" + msg_id.toString();
}

function getReactionData(message) {
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

module.exports = Telegram;
