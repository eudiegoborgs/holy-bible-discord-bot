import { Client } from "@typeit/discord";
import config from './config/config.json';
import { HolyBibleController } from "./controllers";

async function start() {
  const botPrefix = "/biblia";

  const client = new Client({
    classes: [
      `${__dirname}/*Discord.ts`, // glob string to load the classes
      `${__dirname}/*Discord.js`, // If you compile using "tsc" the file extension change to .js
    ],
    silent: false,
    variablesChar: ":",
  });

  client.on("message", async function (message) {
    if (message.author.bot) return;
    if (!message.content.startsWith(botPrefix)) return;
    const commandBody = message.content.slice(botPrefix.length).trim();
    const args = commandBody.split(" ");
    const command = args.shift().toLowerCase();
    const responses: string[] = await HolyBibleController.handlerCommand(command, args);
    for (const response of responses) {
      message.channel.send(`> ${response}`);
    }
    return;
  });

  await client.login(config.BOT_TOKEN);
}

start();