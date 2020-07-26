import KustomBot from "../src"; // "kustombot"

const TWITCH_CLIENT = process.env.TWITCH_CLIENT;
const TWITCH_TOKEN = process.env.TWITCH_TOKEN;

const kbot = KustomBot({
  options: {
    debug: true,
    clientId: TWITCH_CLIENT,
  },
  connection: {
    reconnect: true,
    secure: true,
  },
  identity: {
    username: "kustombot",
    password: `oauth:${TWITCH_TOKEN}`,
  },
  channels: ["#kustombot"],
});

kbot.addMessageHandler((channel, data, msg, self) => {
  console.log(channel, data, msg, self);
});

kbot.addConnectionHandler((addr, port) => {
  console.log(`Connected to ${addr}:${port}`);
});

kbot.connect();
