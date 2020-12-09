import { Internal } from "./internal";
import { Platform } from "./platform";

export class User extends Internal {
  name: string;
  bot: boolean;

  constructor(platform: Platform, internal: any, name: string, bot: boolean) {
    super(platform, internal);
    this.name = name;
    this.bot = bot;
  }
}
