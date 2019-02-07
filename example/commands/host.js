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

// Config for host raffle

let raffleInterval = 1000 * 60 * 15 // Raffle interval 1000ms * 60s * 15m = 15 minutes
let raffleAnnounce = true           // If announcements on chat should be on
let maxTicket = 100                 // Max number a ticket can have
let streamMe = true                 // If you want to stream yourself in between raffles

// Max tickets config
let defaultMaxTickets = 1           // Max tickets a normal user can buy
let bitsMaxTickets = 2              // Max tickets an user from the bits leaderboard can buy
let followMaxTickets = 3            // Max tickets a follower can buy
let subsMaxTickets = 5              // Max tickets a subscriber can buy

//Bits leaderboard
let maxBitsRank = 10                // Max rank accepted on the leaderboard - Maximum: 100

// End of config

let mainChannel = `#${bot.account}`
let lastRaffle = Date.now()
let hostCooldown = false
let hostTickets = []
let mainUser = {}
let debug = false

helix.getUsers({login: bot.account}).then((users) => mainUser = users.data[0]).catch(err => console.log(err))

let ordinalSuffix = (i) => {
  let j = i % 10,
    k = i % 100;
  if (j == 1 && k != 11) {
    return i + "st";
  }
  if (j == 2 && k != 12) {
    return i + "nd";
  }
  if (j == 3 && k != 13) {
    return i + "rd";
  }
  return i + "th";
}

let hostAnnounce = async () => {
  if (raffleAnnounce) {
    if (raffleInterval > 1000 * 60 * 5) {
      setTimeout(() => {
        bot.say(mainChannel, `The next host raffle happens in 5 minutes, type !hostme to join!`)
      }, raffleInterval - 1000 * 60 * 5)
    }
    if (raffleInterval > 1000 * 60 * 10) {
      setTimeout(() => {
        bot.say(mainChannel, `The next host raffle happens in 10 minutes, type !hostme to join!`)
      }, raffleInterval - 1000 * 60 * 10)
    }
  }
}

let hostWinner = async () => {
  let num = Math.floor(Math.random() * Math.floor(maxTicket))
  let winner = { dist: maxTicket }
  for (let ticket of hostTickets) {
    if (Math.abs(num - ticket.num) < winner.dist) {
      winner.username = ticket.host
      winner.dist = Math.abs(num - ticket.num)
      winner.num = ticket.num
      if (winner.dist == 0) break
    }
  }
  if (winner.username) {
    let stream = await helix.getStreams({ user_login: winner.username })
    if (stream.data.length) {
      hostTickets = []
      bot.say(mainChannel, `The number is ${num}! ${winner.username} is the winner of the raffle!`)
      if (winner.username == bot.account) {
        bot.say(mainChannel, `/unhost`)
      } else {
        bot.say(mainChannel, `/host ${winner.username}`)
        bot.say(mainChannel, `/w ${winner.username} Congratulations you won the raffle! Don't forget to type !hostme to join the next one in 15 minutes!`)
      }
      hostCooldown = winner.username
      setTimeout(() => bot.say(mainChannel, `The next raffle will happen in ${timeForRaffle()} minute(s), type !hostme to join!`), 1000)
    } else {
      hostTickets = hostTickets.filter((ticket) => ticket.host != winner.username)
      bot.say(mainChannel, `The number is ${num}! ${winner.username} is the winner of the raffle, but his stream is offline!`)
      bot.say(mainChannel, `We will pick another winner!`)
      hostWinner()
    }
  }
}

let hostRaffle = async () => {
  let stream = await helix.getStreams({ user_login: bot.account })
  if (streamMe && stream.data.length > 0) {
    if (hostCooldown) {
      hostCooldown = false
      bot.say(mainChannel, `${bot.account} is going back on stream!`)
      bot.say(mainChannel, `/unhost`)
      hostAnnounce()
    } else {
      hostWinner()
    }
  } else {
    hostWinner()
    hostAnnounce()
  }
  lastRaffle = Date.now()
  setTimeout(hostRaffle, raffleInterval)
}
hostRaffle()

let timeForRaffle = () => {
  return Math.ceil(((raffleInterval - (Date.now() - lastRaffle))/1000)/60)
}

let getAllFollows = async () => {
  let allFollows = []
  let followers = await helix.getUsersFollows({first:100, to_id: mainUser.id})
  allFollows.push(...followers.data)
  while (followers.pagination.cursor) {
    followers = await helix.getUsersFollows({first: 100, to_id: mainUser.id, after: followers.pagination.cursor})
    allFollows.push(...followers.data)
  }
  return allFollows
}

let ticketsAmount = async (host) => {
  let followsAmount = async () => {
    if ((await getAllFollows()).map((follow) => follow.from_name.toLowerCase()).includes(host))
      return followMaxTickets - hostTickets.filter((ticket) => ticket.host == host).length
    else
      return 0
  }
  let bitsAmount = async () => {
    if ((await helix.getBitsLeaderboard({ count: maxBitsRank })).data.map((host) => host.user_name).includes(host))
      return bitsMaxTickets - hostTickets.filter((ticket) => ticket.host == host).length
    else
      return 0
  }
  let broadcasterAmount = async () => {
    if ((await helix.getBroadcasterSubscriptions({broadcaster_id: mainUser.id})).data.map((sub) => sub.user_name).includes(host)) 
      return subsMaxTickets - hostTickets.filter((ticket) => ticket.host == host).length
    else
      return 0
  }
  let defaultAmount = () => {return defaultMaxTickets - hostTickets.filter((ticket) => ticket.host == host).length}
  return Math.max(defaultAmount(), await broadcasterAmount(), await bitsAmount(), await followsAmount())
}

bot.addCommandHandler('hostme', async (channel, data, args) => {
  if (mainUser && channel == mainChannel) {
    if (debug) data.username = args[0]
    if (data.username != hostCooldown) {
      let stream = await helix.getStreams({user_login: data.username})
      if (stream.data.length > 0) {
        let rt = await ticketsAmount(data.username)
        if (rt) {
          let tickets = []
          for (let i = 0; i < rt; i++) {
            let num = Math.floor(Math.random() * Math.floor(maxTicket))
            if (!tickets.map((ticket) => ticket.num).includes(num)) {
              tickets.push({ host: data.username, num: num })
            } else {
              i--
            }
          }
          hostTickets.push(...tickets)
          bot.say(channel, `${data.username} you are the ${ordinalSuffix((new Set(hostTickets.map(ticket => ticket.host))).size)} one to join the raffle with ${rt} ticket(s)! (${tickets.map(ticket => ticket.num).join(', ')})`)
          bot.say(channel, `The next raffle will happen in ${timeForRaffle()} minute(s), type !hostme to join!`)
        } else {
          bot.say(channel, `${data.username} you already bought the maximum amount of tickets for this raffle!`)
        }
      } else {
        bot.say(channel, `${data.username} your stream must be live to join the raffle!`)
      }
    } else {
      bot.say(channel, `${data.username} you're already being hosted!`)
    }
  }
})
