import * as tmi from "tmi.js";
import { Server } from "ws";
import KustomBot from "../index";

const server = new Server({ port: 3000 });

server.on("connection", function (ws) {
  ws.send(`:tmi.twitch.tv 372`);
  ws.send(`:kustombot! JOIN #localhost`);
  ws.send(":kustombot! PRIVMSG #localhost !cmd");
});

describe("index", () => {
  it("Calls KustomBot with tmi.js options", () => {
    KustomBot({
      connection: {
        server: "localhost",
        port: 3000,
      },
      identity: {
        username: "kustombot",
      },
      channels: ["localhost"],
    });
  });

  it("Calls addConnectionHandler", () => {
    const kbot = KustomBot({
      connection: {
        server: "localhost",
        port: 3000,
      },
      identity: {
        username: "kustombot",
      },
      channels: ["localhost"],
    });

    kbot.addConnectionHandler((addr, port) => {
      console.log(addr, port);
    });
  });

  it("Calls addMessageHandler", () => {
    const kbot = KustomBot({
      connection: {
        server: "localhost",
        port: 3000,
      },
      identity: {
        username: "kustombot",
      },
      channels: ["localhost"],
    });

    kbot.addMessageHandler((channel, data, msg, self) => {
      console.log(channel, data, msg, self);
    });
  });

  it("Calls setCommandHandler", () => {
    const kbot = KustomBot({
      connection: {
        server: "localhost",
        port: 3000,
      },
      identity: {
        username: "kustombot",
      },
      channels: ["localhost"],
    });

    kbot.setCommandHandler("!cmd", (channel, data, args, self) => {
      console.log(channel, data, args, self);
    });
  });

  it("Calls removeConnectionHandler to remove non-existing handler", () => {
    const kbot = KustomBot({
      connection: {
        server: "localhost",
        port: 3000,
      },
      identity: {
        username: "kustombot",
      },
      channels: ["localhost"],
    });

    const result = kbot.removeConnectionHandler((addr, port) => {
      console.log(addr, port);
    });
    expect(result).toBeFalsy();
  });

  it("Calls removeConnectionHandler to remove existing handler", () => {
    const kbot = KustomBot({
      connection: {
        server: "localhost",
        port: 3000,
      },
      identity: {
        username: "kustombot",
      },
      channels: ["localhost"],
    });

    const handler = (addr: string, port: number) => {
      console.log(addr, port);
    };

    kbot.addConnectionHandler(handler);
    const result = kbot.removeConnectionHandler(handler);
    expect(result).toBeTruthy();
  });

  it("Calls removeMessageHandler to remove non-existing handler", () => {
    const kbot = KustomBot({
      connection: {
        server: "localhost",
        port: 3000,
      },
      identity: {
        username: "kustombot",
      },
      channels: ["localhost"],
    });

    const result = kbot.removeMessageHandler((addr, port) => {
      console.log(addr, port);
    });
    expect(result).toBeFalsy();
  });

  it("Calls removeMessageHandler to remove existing handler", () => {
    const kbot = KustomBot({
      connection: {
        server: "localhost",
        port: 3000,
      },
      identity: {
        username: "kustombot",
      },
      channels: ["localhost"],
    });

    const handler = (
      channel: string,
      data: tmi.ChatUserstate,
      msg: string,
      self: boolean,
    ) => {
      console.log(channel, data, msg, self);
    };

    kbot.addMessageHandler(handler);
    const result = kbot.removeMessageHandler(handler);
    expect(result).toBeTruthy();
  });

  it("Calls removeCommandHandler to remove non-existing handler", () => {
    const kbot = KustomBot({
      connection: {
        server: "localhost",
        port: 3000,
      },
      identity: {
        username: "kustombot",
      },
      channels: ["localhost"],
    });

    const result = kbot.removeCommandHandler("!cmd");
    expect(result).toBeFalsy();
  });

  it("Calls removeCommandHandler to remove existing handler", () => {
    const kbot = KustomBot({
      connection: {
        server: "localhost",
        port: 3000,
      },
      identity: {
        username: "kustombot",
      },
      channels: ["localhost"],
    });

    const handler = (
      channel: string,
      data: tmi.ChatUserstate,
      args: string[],
      self: boolean,
    ) => {
      console.log(channel, data, args, self);
    };

    kbot.setCommandHandler("!cmd", handler);
    const result = kbot.removeCommandHandler("!cmd");
    expect(result).toBeTruthy();
  });

  it("Tests connectionHandlers", async () => {
    const kbot = KustomBot({
      connection: {
        server: "localhost",
        port: 3000,
      },
      identity: {
        username: "kustombot",
      },
      channels: ["localhost"],
    });

    kbot.addConnectionHandler((addr, port) => {
      console.log(addr, port);
    });

    await kbot.connect();
  });

  it("Tests messageHandler", async () => {
    const kbot = KustomBot({
      connection: {
        server: "localhost",
        port: 3000,
      },
      identity: {
        username: "kustombot",
      },
      channels: ["localhost"],
    });

    kbot.addMessageHandler((channel, data, msg, self) => {
      console.log(channel, data, msg, self);
    });

    await kbot.connect();
  });

  it("Tests commandHandler", async () => {
    const kbot = KustomBot({
      connection: {
        server: "localhost",
        port: 3000,
      },
      identity: {
        username: "kustombot",
      },
      channels: ["localhost"],
    });

    kbot.setCommandHandler("!cmd", (channel, data, args, self) => {
      console.log(channel, data, args, self);
    });

    await kbot.connect();
    await kbot.say("#localhost", "!cmd");
  });

  afterAll(() => {
    server.close();
  });
});
