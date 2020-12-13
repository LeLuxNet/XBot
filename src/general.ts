import { Platform } from "./platform";
import { Discord } from "./platforms/discord";
import { Matrix } from "./platforms/matrix";
import { Telegram } from "./platforms/telegram";

export function envPlatforms() {
  const {
    DISCORD_TOKEN,
    MATRIX_USERNAME,
    MATRIX_ACCESS_TOKEN,
    MATRIX_SERVER,
    TELEGRAM_TOKEN,
  } = process.env;

  const clients: Platform[] = [];

  if (DISCORD_TOKEN != undefined) {
    clients.push(new Discord(DISCORD_TOKEN));
  }

  if (
    MATRIX_USERNAME !== undefined &&
    MATRIX_ACCESS_TOKEN !== undefined &&
    MATRIX_SERVER !== undefined
  ) {
    clients.push(
      new Matrix(MATRIX_USERNAME, MATRIX_ACCESS_TOKEN, MATRIX_SERVER)
    );
  }

  if (TELEGRAM_TOKEN !== undefined) {
    clients.push(new Telegram(TELEGRAM_TOKEN));
  }

  return clients;
}

export function stopOnSignal(clients: Platform[]) {
  process.on("SIGINT", async () => {
    await Promise.all(clients.map((c) => c.stop()));
    process.exit();
  });
}
