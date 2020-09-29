import { Internal } from "./internal";
import { Platform } from "./platform";

export class Channel extends Internal {
  name: string;
  dm: boolean;

  constructor(platform: Platform, internal: any, name: string, dm: boolean) {
    super(platform, internal);

    this.name = name;
    this.dm = dm;
  }

  async sendMessage(text: string) {
    return await this.platform.sendMessage(text, this);
  }

  async typing(timeout = 2000) {
    await this.platform.typing(this, timeout);
  }
}
