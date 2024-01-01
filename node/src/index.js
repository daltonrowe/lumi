require("dotenv").config();
const { sendNodeOnline } = require("./util/sendNodeOnline");
const { readCard } = require("./util/read");

const Effect = require("./effects/RGBStrobeEffect");
const ws281x = require("rpi-ws281x-native");

sendNodeOnline();

const interval = 100;

const channel = ws281x(60, { stripType: "ws2812", brightness: 10 });
const colorArray = channel.array;

const effect = new Effect(colorArray);

setInterval(() => {
  effect.compute();
  ws281x.render();
}, interval);

const tasks = [
  {
    name: "Ping Lumi DB",
    last: Date.now(),
    every: process.env.NODE_PING,
    run: () => {
      sendNodeOnline();
    },
  },
  {
    name: "Scan Card",
    last: Date.now(),
    every: 100,
    run: () => {
      readCard((readResponse) => {
        const { readData } = readResponse;
        console.log(readData);
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
