"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const internal_1 = require("./internal");
class User extends internal_1.Internal {
    constructor(platform, internal, name) {
        super(platform, internal);
        this.name = name;
    }
}
exports.User = User;
