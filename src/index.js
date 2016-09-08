/**
 * Middleware that log Koa errors to Slack.
 */
import Slack from 'node-slack';

export default function koaErrorLogToSlack(webhook) {
  console.log("koa-error-slack: Setting up...");
  return async (ctx, next) => {

    const start = new Date; // Time the request started

    if(webhook) {
      try {
        await next();
      } catch (error) {

        //Error detected. Send error to Slack
        await logToSlack(webhook, ctx, start, error);

        // Throw error so upstream components will also catch it. This plugin is meant be nonintrusive, this means that this plugin
        // will not disrupt error throw flow. If there are other plugins listening for errors, they will also be able to catch it.
        throw error;
      }
    } else {
      throw "Koa Error Slack needs a webhook"
    }
  }
}

export async function logGraphQLErrorToSlack(webhook, error) {
  const message = {
    message: error.message,
    locations: error.locations,
    stack: error.stack,
  };

  try {
    const slack = new Slack(webhook);
    await slack.send({ text: JSON.stringify(message) });
  } catch (err) {
    console.log("koa-error-slack: Unable to send error message to Slack",err);
  }
}

/**
 * Log Koa errors to Slack helper.
 */
async function logToSlack(webhook, ctx, start, error) {
  try {
    console.log("koa-error-slack: Error detected...");
    const end = new Date;

    const request = {
      headers: ctx.headers || 'NA',
      method: ctx.method || 'NA',
      url: ctx.url || 'NA',
      originalUrl: ctx.originalUrl || 'NA',
      origin: ctx.origin || 'NA',
      href: ctx.href || 'NA',
      path: ctx.path || 'NA',
      query: ctx.query || 'NA',
      querystring: ctx.querystring || 'NA',
      host: ctx.host || 'NA',
      hostname: ctx.hostname || 'NA',
      protocol: ctx.protocol || 'NA',
      ip: ctx.ip || 'NA',
      ips: ctx.ips || 'NA',
      subdomains: ctx.subdomains || 'NA',
      secure: ctx.secure || 'NA',
    };
    const response = {
      // body: ctx.body || 'NA',
      status: ctx.status || 'NA',
      message: ctx.message || 'NA',
      length: ctx.length || 'NA',
      type: ctx.type || 'NA',
    };

    const message = {
      request,
      response,
      error: {
        error: error || 'NA',
        stack: JSON.stringify(error.stack) || 'NA',
      },
      date: {
        start,
        end,
        delta: time(start,end),
      },
    };

    //Create new Slack instance and publish
    const slack = new Slack(webhook);
    await slack.send({ text: JSON.stringify(message) });

  } catch (err) {
    console.log("koa-error-slack: Unable to send error message to Slack",err);
  }
}

/**
 * Helper funtion
 * Returns the response time in milliseconds if less than 10 seconds,
 * in seconds otherwise.
 */

function time(start,end) {
  let delta = end - start;
  delta = delta < 10000
    ? delta + 'ms'
    : Math.round(delta / 1000) + 's';
  return delta;
}
