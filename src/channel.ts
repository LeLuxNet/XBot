import { Readable } from "stream";
import { Internal } from "./internal";
import { FileType } from "./message";
import { Platform } from "./platform";

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

  async sendFile(name: string, stream: Readable, type: FileType) {
    return await this.platform.sendFile(name, stream, type, this);
  }

  async typing(duration = 2000) {
    await this.platform.typing(this, duration);
  }
}
