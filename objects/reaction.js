const Internal = require("./internal");

class Reaction extends Internal {
  constructor(platform, internal, emoji, message) {
    super(platform, internal);

    this.emoji = emoji;
    this.message = message;
  }

  listen(callback) {
    this.listener = callback;
    this.message._reactionListeners[this.emoji] = this;
    this.platform._reactionMessages[this.message.id] = this.message;
  }

  async removeUser(user) {
    await this.platform.removerUserReaction(this, user);
  }
}

module.exports = Reaction;
