class Platform {
  constructor(name, handle) {
    this.name = name;
    this.handle = handle;

    this._reactionMessages = {};
  }

  log(msg) {
    console.log("[" + this.name + "] " + msg);
  }

  async start() {}

  async stop() {}

  async sendMessage(text, channel) {}

  async deleteMessage(message) {}

  async editMessage(message, text) {}

  async addReaction(emoji, message) {}

  async removerUserReaction(reaction, user) {}

  async setPresence(presence, status) {}

  async typing(channel, timeout) {}

  hasDeleteTraces() {}

  async _reactionRecieved(messageId, emoji, user) {
    const msg = this._reactionMessages[messageId];
    if (msg) {
      const reaction = msg._reactionListeners[emoji];
      if (reaction) {
        if (msg.reactionButtons) {
          await reaction.removeUser(user);
        }
        reaction.listener(user);
      }
    }
  }
}

module.exports = Platform;
