export declare enum ErrorType {
    UPLOAD_LIMIT = "The file is too big to upload"
}
export declare class MsgError {
    msg: string;
    constructor(msg: string);
}
