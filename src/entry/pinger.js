const os = require("os");

const hookUrl =
  "https://discordapp.com/api/webhooks/1170788550820769875/aV6H5kiwfZTUWS0ZDFrRlZATzuiAdkoVchcu0R9egiUBzeNwx1XRYfcEzcQLf0MZ2_af";
const hookInterval = 15 * 60 * 1000;
const checkResolution = 1000;
let lastRun = Date.now();

function sendMessage() {
  const body = {
    username: "Lumi Endurance Run",
    avatar_url: "",
    content: `${os.uptime()}s uptime | ${os.freemem()} freemem | ${os.loadavg()} loadavg `,
  };

  fetch(hookUrl, {
    method: "post",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

setInterval(() => {
  const now = Date.now();
  const since =  now - lastRun;
  const shouldRun = since > hookInterval;

  if (shouldRun) {
    lastRun = now;
    sendMessage();
  }
}, checkResolution);
