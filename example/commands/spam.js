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

// Config for message spam

// List of channels
let channels = [
  'channel1',
  'channel2',
  'channel3'
]

// Time between messages - 1000ms * 60s * 10m = 10 minutes
let interval = 1000 * 60 * 10

// List of messages
let messages = [
  'Message 1',
  'Message 2',
  'Message 3'
]

// End of config

let spam = () => {
  if (messages.length && channels.length) {
    for (let channel of channels) {
      let random = Math.floor(Math.random()*messages.length)
      bot.say(channel, messages[random])
    }
  }
  setInterval(spam, interval)
}
setInterval(spam, interval)