const Effect = require("../effects/KnightRiderEffect");
const ws281x = require("rpi-ws281x-native");

const interval = 100;

const channel = ws281x(60, { stripType: "ws2812", brightness: 10 });
const colorArray = channel.array;

const effect = new Effect(colorArray);

setInterval(() => {
  effect.compute();
  ws281x.render();
}, interval);
