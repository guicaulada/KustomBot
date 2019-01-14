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

let mainChannel = `#${bot.account}`
let raffleInterval = 1000 * 60 * 15 // 1000ms * 60s * 15m = 15 minutes
let raffleAnnounce = true
let hostCooldown = ''
let hostTickets = {}
let maxTicket = 100
let streamMe = true

let hostAnnounce = async () => {
  if (raffleAnnounce) {
    setTimeout(() => {
      bot.say(mainChannel, `The next host raffle happens in 5 minutes, type !hostme to join!`)
    }, raffleInterval - 1000 * 60 * 5)
    setTimeout(() => {
      bot.say(mainChannel, `The next host raffle happens in 10 minutes, type !hostme to join!`)
    }, raffleInterval - 1000 * 60 * 10)
  }
}

let hostWinner = async () => {
  let num = Math.floor(Math.random() * Math.floor(maxTicket))
  let winner = { dist: maxTicket }
  for (let host in hostTickets) {
    if (num - hostTickets[host] < winner.dist) {
      winner.username = host
      winner.dist = Math.abs(num - hostTickets[host])
      winner.num = hostTickets[host]
      if (winner.dist == 0) break
    }
  }
  if (winner.username) {
    hostTickets = {}
    bot.say(mainChannel, `The number is ${num}! ${winner.username} is the winner of the raffle!`)
    if (winner.username == bot.account) {
      bot.say(mainChannel, `/unhost`)
    } else {
      bot.say(mainChannel, `/host ${winner.username}`)
    }
    hostCooldown = winner.username
  }
}

let hostRaffle = async () => {
  if (streamMe && hostCooldown) {
    hostCooldown = false
    bot.say(mainChannel, `${bot.account} is going back on stream!`)
    bot.say(mainChannel, `/unhost`)
    hostAnnounce()
  } else if (streamMe) {
    hostWinner()
  } else {
    hostWinner()
    hostAnnounce()
  }
  setTimeout(hostRaffle, raffleInterval)
}
hostRaffle()

bot.addCommandHandler('hostme', (channel, data, args) => {
  if (channel == mainChannel) {
    if (data.username != hostCooldown) {
      let num = Number(args[0])
      if (Number.isNaN(num)) num = Math.floor(Math.random() * Math.floor(maxTicket))
      if (hostTickets[data.username] == null) {
        if (num <= maxTicket && num >= 0) {
          hostTickets[data.username] = num
          bot.say(channel, `${data.username} joined the raffle with number ${num}!`)
        } else {
          bot.say(channel, `${data.username} your ticket number must be between 0 and ${maxTicket}!`)
        }
      } else {
        bot.say(channel, `${data.username} you already have a ticket for this raffle!`)
      }
    } else {
      bot.say(channel, `${data.username} you're already being hosted!`)
    }
  }
})
