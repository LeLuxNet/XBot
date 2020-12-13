export enum ErrorType {
  UPLOAD_LIMIT = "The file is too big to upload",
}

export class MsgError {
  msg: string;

  constructor(msg: string) {
    this.msg = msg;
  }
}
