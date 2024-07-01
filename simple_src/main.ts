const mineflayer = require("mineflayer");
const mineflayerViewer = require("prismarine-viewer").mineflayer;
import { initAFKHandler, tryToTeleportToIsland } from "./AFKHandler";
import { sleep } from "./utils";
import { initLogger, printMcChatToConsole, log } from "./logger";
import { ChatMessage } from "prismarine-chat";

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

bot.on("message", (message: ChatMessage, type) => {
  let text = message.getText(null);
  if (type == "chat") {
    printMcChatToConsole(message.toAnsi());
  }
});

bot.on("kicked", console.warn);
bot.on("error", console.error);
