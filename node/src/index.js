require("dotenv").config();
const { sendNodeOnline } = require("./util/sendNodeOnline");
const { readCard } = require("./util/read");

sendNodeOnline();

const tasks = [
  {
    last: Date.now(),
    every: process.env.NODE_PING,
    run: () => {
      sendNodeOnline();
    },
  },
  {
    last: Date.now(),
    every: 500,
    run: () => {
      readCard((readResponse) => {
        console.log(readResponse);
      });
    },
  },
];

setInterval(() => {
  tasks.forEach((task) => {
    const now = Date.now();
    const since = now - task.last;

    if (since > task.every) {
      task.last = now;
      task.run();
    }
  });
}, 100);
