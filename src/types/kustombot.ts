import tmi from "tmi.js";

export interface map<T> {
  [key: string]: T;
}

export type MessageHandler = (
  channel: string,
  data: tmi.ChatUserstate,
  msg: string,
  self: boolean,
) => void;

export type CommandHandler = (
  channel: string,
  data: tmi.ChatUserstate,
  args: string[],
  self: boolean,
) => void;

export type ConnectionHandler = (addr: string, port: number) => void;

export interface KustomBot extends tmi.Client {
  addMessageHandler: (handler: MessageHandler) => void;
  addConnectionHandler: (handler: ConnectionHandler) => void;
  setCommandHandler: (command: string, handler: CommandHandler) => void;
  removeMessageHandler: (handler: MessageHandler) => boolean;
  removeConnectionHandler: (handler: ConnectionHandler) => boolean;
  removeCommandHandler: (command: string) => boolean;
}
