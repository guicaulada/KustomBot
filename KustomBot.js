/**
  KustomBot - A customizable bot for Twitch.
  Copyright (C) 2019  Sighmir

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
console.log('\n\
KustomBot - A customizable bot for Twitch.  Copyright (C) 2019  Sighmir\n\
This is free software, and you are welcome to redistribute it under certain conditions;\n\
This program comes with ABSOLUTELY NO WARRANTY;\n')

const tmi = require('tmi.js');

class KustomBot {
  constructor(conf) {
    this.account = process.env.KUSTOM_ACCOUNT || conf.account
    this.token = process.env.KUSTOM_TOKEN || conf.token
    this.channels = conf.channels
    this.prefix = conf.prefix

    this.client = new tmi.client({
      identity: {
        username: this.account,
        password: this.token
      },
      channels: conf.channels
    })

    this.messageHandlers = []
    this.connectionHandlers = []
    this.commandHandlers = {}

    this.client.bot = this
    this.client.on('message', this.callMessageHandlers)
    this.client.on('message', this.callCommandHandlers)
    this.client.on('connected', this.callConnectionHandlers)
  }

  callMessageHandlers(channel, data, msg, self) {
    this.bot.messageHandlers.forEach(async (handler) => {
      handler(channel, data, msg, self)
    })
  }

  callConnectionHandlers(addr, port) {
    this.bot.connectionHandlers.forEach(async (handler) => {
      handler(addr, port)
    })
  }

  callCommandHandlers(channel, data, msg, self) {
    if (self) { return }

    let words = msg.trim().split(/\s+/)

    const prefix = words[0][0]
    const command = words[0].slice(1)
    const args = words.slice(1)

    if (prefix == this.bot.prefix) {
      if (this.bot.commandHandlers[command]) {
        this.bot.commandHandlers[command](channel, data, args)
      }
    }
  }

  addMessageHandler(handler) {
    this.messageHandlers.push(handler)
  }

  addConnectionHandler(handler) {
    this.connectionHandlers.push(handler)
  }

  addCommandHandler(command, handler) {
    this.commandHandlers[command] = handler
  }

  removeMessageHandler(handler) {
    let index = this.messageHandlers.indexOf(handler)
    if (index >= 0) this.messageHandlers.splice(index, 1)
  }

  removeConnectionHandler(handler) {
    let index = this.connectionHandlers.indexOf(handler)
    if (index >= 0) this.connectionHandlers.splice(index, 1)
  }

  removeCommandHandler(command) {
    if (this.commandHandlers[command]) delete this.commandHandlers[command]
  }

  config() {
    return {
      identity: this.identity,
      channels: this.channels,
      prefix: this.prefix
    }
  }

  connect() {
    this.client.connect()
  }

  say(channel, message) {
    try {
      this.client.say(channel, message)
    } catch {
      console.log('Failed to send message, not connected to server.')
    }
  }
}

module.exports = KustomBot