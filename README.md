# koa-error-sns
This Middleware detects errors in Koa Servers and sends messages to an AWS SNS topic. SNS is a fan-out message distribution system from AWS. From SNS you can set up different subscribers; such as email subscribers address, SQS queues or Lambda function. Simple use case is subscribe an email address to the SNS topic that will receive all error messages.

## How it works
The Middleware will listen to errors thrown from downstream components using try & catch. Once an error is detected a message containing error detail as well other relevant information (context, request and whenever possible response information) will be published to your SNS endpoint.

The Middleware code is lightweight and is intended to be used in production environments. AWS is only called when an error is detected.

Please note that this middleware will solely catch errors from downstream components, so in order to catch relevant errors it must be one of the first middleware installed the Koa initialization stack.


## Installation

```js
$ npm install koa-error-aws-sns --save
```

If don't have AWS nodejs SDK installed you'll also need to install it as a peer dependency

```js
$ npm install aws-sdk --save
```

Please install AWS 2.3.X or greater since promise support is required

## Usage
```js
import errorToSNS from 'koa-error-aws-sns';
import AWS from 'aws-sdk';

const sns = new AWS.SNS({ params: { TopicArn: 'arn:aws:sns:us-east-1:12345678910101:endpoint' },
                          region: 'us-east-1',
                        });

const app = new Koa();
app.use(errorToSNS(sns);
```
