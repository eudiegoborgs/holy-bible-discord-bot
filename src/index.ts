import { Client } from "@typeit/discord";
import { HolyBibleController } from "./controllers";
import http from 'http';


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

  await client.login(process.env.BOT_TOKEN);

  http
    .createServer((req, res) => {
      res.writeHead(200, {
        "Content-type": "text/plain",
      });
      res.write("Hey");
      res.end();
    })
    .listen(process.env.PORT || 5000);
}

start();