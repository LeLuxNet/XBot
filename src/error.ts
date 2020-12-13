export enum ErrorType {
  UPLOAD_LIMIT = "The file is too big to upload",
  NOT_FOUND = "I could not find what you were looking for",
  ERROR_GETTING_STREAM = "I had problems getting the video/stream you were looking for",
}

export class MsgError {
  msg: string;

  constructor(msg: string) {
    this.msg = msg;
  }
}
