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

  async sendFile(name: string, fileName: string, type: FileType) {
    return await this.platform.sendFile(name, fileName, type, this);
  }

  async typing(timeout = 2000) {
    await this.platform.typing(this, timeout);
  }
}
