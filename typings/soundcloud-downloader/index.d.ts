import { Readable } from "stream";

class SDCL {
  download(url: string): Promise<Readable>;
}

export default new SDCL();
