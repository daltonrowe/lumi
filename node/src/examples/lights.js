const ws281x = require("rpi-ws281x-native");

const channel = ws281x(60, { stripType: "ws2812" });

const colorsArray = channel.array;
for (let i = 0; i < channel.count; i++) {
  colorsArray[i] = 0xffcc22;
}

ws281x.render();
