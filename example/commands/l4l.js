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

const fs = require('fs')
const filename = 'l4l'
const mainChannel = `#${bot.account}`

try {
  fs.writeFileSync(`${filename}.json`, '', {flag: 'wx'})
} catch {}

let content = fs.readFileSync(`${filename}.json`).toString()
try {
  content = new Set(JSON.parse(content))
} catch {
  content = new Set()
}

bot.addCommandHandler('l4l', async (channel, data, args) => {
  if (channel == mainChannel) {
    if (content.has(data.username)) {
      //bot.say(channel, `${data.username} you are already on my lurk list!`)
    } else {
      content.add(data.username)
      fs.writeFileSync(`${filename}.json`, JSON.stringify(Array.from(content), null, 2))
      //bot.say(channel, `${data.username} you were added to my lurk list, I will be checking you out soon.`)
    }
  }
})
