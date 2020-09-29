const Discord = require("../src/platforms/discord");
const Matrix = require("../src/platforms/matrix");
const Presence = require("../src/objects/presence");
const Telegram = require("../src/platforms/telegram");

const REPLACE = {
  " I've": " We've",
  " I was": " We were",
  " I am": " We are",
  " I'm": " We're",
  " I": " We",
  " Me": " Us",
  " My": " Our",

  " will Ich": " wollen Wir",
  " wollte Ich": " wollten Wir",
  " Ich hab": " Wir haben",
  " Ich habe": " Wir haben",
  " Hab ich ": " Haben wir ",
  " Habe ich ": " Haben wir ",
  " Ich war": " Wir waren",
  " Ich bin": " Wir sind",
  " Ich": " Wir",
  " Mir": " Uns",
  " Mein": " Unser",
  " Mich": " Uns",
};

function replace(text, old, now) {
  return text
    .replace(old + " ", now + " ")
    .replace(old + "!", now + "!")
    .replace(old + "?", now + "?");
}

var handle = {
  handleMessage: async function (msg) {
    console.log(msg.channel.name + ": " + msg.content);

    var res = " " + msg.content.trim() + " ";
    for (const old in REPLACE) {
      res = replace(res, old, REPLACE[old]);
      res = replace(res, old.toLowerCase(), REPLACE[old].toLowerCase());
    }
    res = res.trim();
    if (res !== msg.content) {
      const message = await msg.channel.sendMessage(res);

      // if (message.platform.hasDeleteTraces()) {
      await message.deleteReaction();
      /* } else {
        message.deleteIn(10);
      } */

      /* const r2 = await message.react("✅");
      await r2.listen((user) => r2.message.edit(message.channel.name)); */
    }
  },
};

const discord = new Discord(
  "NzQ4OTgxNTg3NjY3ODQ1MTYy.X0lVdQ.GQj0KHSlSdCowG_dolFmVlhUAHs",
  handle
);

const matrix = new Matrix(
  "@ginnyTheCar:lelux.net",
  "MDAxN2xvY2F0aW9uIGxlbHV4Lm5ldAowMDEzaWRlbnRpZmllciBrZXkKMDAxMGNpZCBnZW4gPSAxCjAwMjljaWQgdXNlcl9pZCA9IEBnaW5ueXRoZWNhcjpsZWx1eC5uZXQKMDAxNmNpZCB0eXBlID0gYWNjZXNzCjAwMjFjaWQgbm9uY2UgPSBMdzU5R2xRR3EyS1kjXnFxCjAwMmZzaWduYXR1cmUgKHXlOg7f142lScD8I4fomQqkr95I-Y5EtcLEB0DAxCEK",
  "https://matrix.lelux.net",
  handle
);

const telegram = new Telegram(
  "1399152326:AAG6k6LJmOrhLcUZPzZtHGgBt31C0wvMUlk",
  handle
);

discord.start().then(() => {
  discord.setPresence(Presence.ONLINE, "Streaming The Communist Manifesto");
});
matrix.start();
telegram.start();

process.on("SIGINT", async () => {
  await Promise.all([discord.stop(), matrix.stop(), telegram.stop()]);
  process.exit();
});
