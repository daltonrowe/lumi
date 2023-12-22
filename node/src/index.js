require("dotenv").config();
const { sendNodeOnline } = require("./util/sendNodeOnline");

const tasks = [
  {
    last: Date.now(),
    every: process.env.NODE_PING,
    run: () => {
      sendNodeOnline();
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
}, 500);
