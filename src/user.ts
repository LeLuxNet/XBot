import { Internal } from "./internal";
import { Platform } from "./platform";

export class User extends Internal {
  name: string;

  constructor(platform: Platform, internal: any, name: string) {
    super(platform, internal);

    this.name = name;
  }
}
