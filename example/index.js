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

const fs = require('fs');
const KustomBot = require('kustombot')
const Helix = require('@sighmir/helix.js')

let conf = JSON.parse(fs.readFileSync('config.json', 'utf8'));

global.bot = new KustomBot(conf)
global.helix = new Helix(bot.token)

require('./commands')

// bot.addMessageHandler((channel, data, msg, self) => {
//   console.log(channel, data, msg, self)
// })

bot.addConnectionHandler((addr, port) => {
  console.log(`Connected to ${addr}:${port}`);
})

bot.connect()