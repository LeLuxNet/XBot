import { Platform } from "./platform";

export class Internal {
  platform: Platform;
  _internal: any;

  constructor(platform: Platform, internal: any) {
    this.platform = platform;
    this._internal = internal;
  }
}
