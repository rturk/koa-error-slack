# koa-error-sns
This Middleware detects errors in Koa Servers and sends messages to a Slack (via webhook).

## How it works
The Middleware will listen to errors thrown from downstream components using try & catch. Once an error is detected a message containing error detail as well other relevant information (context, request and whenever possible response information) will be published to your Slack channel.

The Middleware code is lightweight and is intended to be used in production environments. Slack is only instantiated/called when an error is detected.

Please note that this middleware will solely catch errors from downstream components, so in order to catch relevant errors it must be one of the first middleware installed the Koa initialization stack.


## Installation

```js
$ npm install koa-error-slack --save
```

## Usage
```js
import errorToSlack from 'koa-error-slack';

const app = new Koa();
app.use(errorToSlack("https://hooks.slack.com/services/my-webhook-channel");
```
