# KustomBot

[npm-url]: https://npmjs.org/package/kustombot
[npm-image]: https://img.shields.io/npm/v/kustombot.svg
[pipeline-image]: https://github.com/Sighmir/KustomBot/workflows/CI/CD/badge.svg
[pipeline-url]: https://github.com/Sighmir/KustomBot/actions?query=workflow%3ACI%2FCD
[coverage-image]: https://codecov.io/gh/Sighmir/KustomBot/graph/badge.svg
[coverage-url]: https://codecov.io/gh/Sighmir/KustomBot
[quality-image]: https://sonarcloud.io/api/project_badges/measure?project=KustomBot&metric=alert_status
[quality-url]: https://sonarcloud.io/dashboard?id=KustomBot
[depstat-url]: https://david-dm.org/Sighmir/KustomBot
[depstat-image]: https://david-dm.org/Sighmir/KustomBot/status.svg
[devdepstat-url]: https://david-dm.org/Sighmir/KustomBot?type=dev
[devdepstat-image]: https://david-dm.org/Sighmir/KustomBot/dev-status.svg

[![NPM version][npm-image]][npm-url]
[![Pipeline Status][pipeline-image]][pipeline-url]
[![Coverage Status][coverage-image]][coverage-url]
[![Sonarcloud Status][quality-image]][quality-url]
[![Dependency Status][depstat-image]][depstat-url]
[![Dev Dependency Status][devdepstat-image]][devdepstat-url]

**KustomBot** is a simple wrapper around [tmi.js](https://github.com/tmijs/tmi.js) for Twitch.

This is just a simple project I made for a friend.

This bot is very simple but you can program it to do anything you want!  
The example folder provides a simple example for you to get started but you can do much more!

I am releasing this project to the public hoping it will be helpful for beginners trying to learn TypeScript.

Check my friend's Twitch channel: [twitch.tv/gwardo420](https://www.twitch.tv/gwardo420)

## Requirements

- A Twitch token, get yours here: https://twitchtokengenerator.com

## Documentation

### Getting Started

If you are using Node.js, install KustomBot using npm:

```bash
$ npm install kustombot
```

For TypeScript you must install the types for tmi.js as a development dependency:

```bash
$ npm install -D @types/tmi.js
```

And have `esModuleInterop` or `allowSyntheticDefaultImports` set to true on your `tsconfig.json`:

```json
"esModuleInterop": true,
"allowSyntheticDefaultImports": true
```

You only need one of these 2, `allowSyntheticDefaultImports` should have less side effects but `esModuleInterop` is recommended and is set to true by default on `tsc --init`.

You can now require and use kustombot like so:

```ts
import KustomBot from "kustombot";

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
```

Check out [tmi.js](https://github.com/tmijs/tmi.js) and the [KustomBot Example](https://github.com/Sighmir/KustomBot/tree/master/example) for more information.

### Browser

You can also load this script on your browser like so:

```html
<script src="https://cdn.jsdelivr.net/npm/kustombot/dist/bundle.js"></script>
```

You can now use KustomBot normally on the page, like you would on Node.js.

## License

```
KustomBot - A customizable bot for Twitch.
Copyright (C) 2019  Guilherme Caulada (Sighmir)

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
```
