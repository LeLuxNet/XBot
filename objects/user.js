const Internal = require("./internal");

class User extends Internal {
  constructor(platform, internal, name) {
    super(platform, internal);

    this.name = name;
  }
}

module.exports = User;
