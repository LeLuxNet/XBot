const Internal = require("./internal");

class Message extends Internal {
  constructor(platform, internal, id, content, channel) {
    super(platform, internal);
    this.id = id;

    this.content = content;
    this.channel = channel;

    this.reactions = [];
    this.reactionButtons = true;

    this._reactionListeners = {};
  }

  async react(emoji) {
    var reaction = await this.platform.addReaction(emoji, this);

    this.reactions.push(reaction);
    return reaction;
  }

  async deleteReaction() {
    var r = await this.react("❌");
    r.listen(() => r.message.delete());
    return r;
  }

  async delete() {
    await this.platform.deleteMessage(this);
  }

  async edit(text) {
    await this.platform.editMessage(this, text);
  }

  deleteIn(sec) {
    setTimeout(() => this.delete(), sec * 1000);
  }
}

module.exports = Message;
