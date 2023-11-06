const os = require("os");

const hookUrl =
  "https://discordapp.com/api/webhooks/1170788550820769875/aV6H5kiwfZTUWS0ZDFrRlZATzuiAdkoVchcu0R9egiUBzeNwx1XRYfcEzcQLf0MZ2_af";
const hookInterval = 2 * 60 * 60 * 1000;
const checkResolution = 1000;
let lastRun = Date.now();

function sendMessage() {
  const body = {
    username: "Lumi Endurance Run",
    avatar_url: "",
    content: `${Math.round(os.uptime() / 60)}m uptime | ${Math.round(
      os.freemem() / 1000 / 1000
    )} freemem | ${os.loadavg()[2]} loadavg `,
  };

  fetch(hookUrl, {
    method: "post",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

sendMessage();

setInterval(() => {
  const now = Date.now();
  const since = now - lastRun;
  const shouldRun = since > hookInterval;

  if (shouldRun) {
    lastRun = now;
    sendMessage();
  }
}, checkResolution);
