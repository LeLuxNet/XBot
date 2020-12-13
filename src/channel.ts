import { createReadStream } from "fs";
import { basename } from "path";
import { Readable } from "stream";
import { Internal } from "./internal";
import { FileType } from "./message";
import { Platform } from "./platform";

interface FileOptions {
  name?: string;
}

export class Channel extends Internal {
  name: string;
  dm: boolean;

  constructor(platform: Platform, internal: any, name: string, dm: boolean) {
    super(platform, internal);

    this.name = name;
    this.dm = dm;
  }

  async sendText(text: string) {
    return await this.platform.sendText(text, this);
  }

  async sendFile(
    fileName: string,
    stream: Readable,
    type: FileType,
    options: FileOptions = {}
  ) {
    return await this.platform.sendFile(
      options.name || fileName,
      fileName,
      stream,
      type,
      this
    );
  }

  async sendLocalFile(path: string, type: FileType, options?: FileOptions) {
    const stream = createReadStream(path);
    return this.sendFile(basename(path), stream, type, options);
  }

  async typing(duration = 2000) {
    await this.platform.typing(this, duration);
  }
}
