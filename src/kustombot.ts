import * as tmi from "tmi.js";
import * as kbot from "./types/kustombot";

export default function KustomBot(options: tmi.Options): kbot.KustomBot {
  const client = tmi.client(options);
  const messageHandlers = [] as kbot.MessageHandler[];
  const connectionHandlers = [] as kbot.ConnectionHandler[];
  const commandHandlers = {} as kbot.map<kbot.CommandHandler>;

  client.on("message", callMessageHandlers);
  client.on("message", callCommandHandlers);
  client.on("connected", callConnectionHandlers);

  function callMessageHandlers(
    channel: string,
    data: tmi.ChatUserstate,
    msg: string,
    self: boolean,
  ) {
    messageHandlers.forEach((handler) => {
      handler(channel, data, msg, self);
    });
  }

  function callConnectionHandlers(addr: string, port: number) {
    connectionHandlers.forEach((handler) => {
      handler(addr, port);
    });
  }

  function callCommandHandlers(
    channel: string,
    data: tmi.ChatUserstate,
    msg: string,
    self: boolean,
  ) {
    if (self) {
      return;
    }

    const words = msg.trim().split(/\s+/);

    const command = words[0];
    const args = words.slice(1);

    if (commandHandlers[command]) {
      commandHandlers[command](channel, data, args, self);
    }
  }

  function addMessageHandler(handler: kbot.MessageHandler) {
    messageHandlers.push(handler);
  }

  function addConnectionHandler(handler: kbot.ConnectionHandler) {
    connectionHandlers.push(handler);
  }

  function setCommandHandler(command: string, handler: kbot.CommandHandler) {
    commandHandlers[command] = handler;
  }

  function removeMessageHandler(handler: kbot.MessageHandler) {
    const index = messageHandlers.indexOf(handler);
    if (index >= 0) {
      messageHandlers.splice(index, 1);
      return true;
    }
    return false;
  }

  function removeConnectionHandler(handler: kbot.ConnectionHandler) {
    const index = connectionHandlers.indexOf(handler);
    if (index >= 0) {
      connectionHandlers.splice(index, 1);
      return true;
    }
    return false;
  }

  function removeCommandHandler(command: string) {
    if (commandHandlers[command]) {
      delete commandHandlers[command];
      return true;
    }
    return false;
  }

  return Object.assign(client, {
    addMessageHandler,
    addConnectionHandler,
    setCommandHandler,
    removeMessageHandler,
    removeConnectionHandler,
    removeCommandHandler,
  });
}
