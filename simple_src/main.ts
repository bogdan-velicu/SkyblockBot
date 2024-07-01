const mineflayer = require("mineflayer");
const mineflayerViewer = require("prismarine-viewer").mineflayer;
import winston from "winston";
import { initAFKHandler, tryToTeleportToIsland } from "./AFKHandler";
import { sleep } from "./utils";
import { initLogger, printMcChatToConsole, log } from "./logger";
initLogger();

async function onScoreboardChanged() {
  if (
    bot.scoreboard.sidebar.items
      .map((item) => item.displayName.getText(null).replace(item.name, ""))
      .find((e) => e.includes("Purse:") || e.includes("Piggy:"))
  ) {
    bot.removeListener("scoreboardTitleChanged", onScoreboardChanged);
    log("Joined SkyBlock");
    initAFKHandler(bot);

    await sleep(2500);

    bot.removeAllListeners("scoreboardTitleChanged");
    tryToTeleportToIsland(bot, 0);

    await sleep(20000);
  }
}

const bot = mineflayer.createBot({
  username: "z0trix",
  auth: "microsoft",
  logErrors: true,
  version: "1.8.9",
  host: "mc.hypixel.net",
});

bot.once("spawn", async () => {
  await bot.waitForChunksToLoad();
  mineflayerViewer(bot, { port: 3007, firstPerson: true });
  await sleep(2000);
  bot.chat("/play sb");
  bot.on("scoreboardTitleChanged", onScoreboardChanged);
});

bot.on("message", (message) => {
  printMcChatToConsole(message.toString());
});

bot.on("kicked", console.log);
bot.on("error", console.log);
