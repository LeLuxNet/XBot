"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MsgError = exports.ErrorType = void 0;
var ErrorType;
(function (ErrorType) {
    ErrorType["UPLOAD_LIMIT"] = "The file is too big to upload";
})(ErrorType = exports.ErrorType || (exports.ErrorType = {}));
class MsgError {
    constructor(msg) {
        this.msg = msg;
    }
}
exports.MsgError = MsgError;
