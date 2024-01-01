require("dotenv").config();
const { getProvider, register } = require("./class/Provider");

const { sendNodeOnline } = require("./util/sendNodeOnline");
const { readCard } = require("./util/read");

const { Lights } = require("./class/Lights");
const { Game } = require("./class/Game");

register("lights", new Lights());
register("game", new Game());

const { game } = getProvider();
const { lights } = getProvider();

lights.setDefaultColor();

sendNodeOnline();

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
        game.handleScan(readData);
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
}, process.env.INTERVAL);
