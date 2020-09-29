const Internal = require("./internal");

class Channel extends Internal {
  constructor(platform, internal, name, dm) {
    super(platform, internal);

    this.name = name;
    this.dm = dm;
  }

  async sendMessage(text) {
    return await this.platform.sendMessage(text, this);
  }

  async typing(timeout = 2000) {
    await this.platform.typing(this, timeout);
  }
}

module.exports = Channel;