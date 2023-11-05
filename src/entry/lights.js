const ws281x = require("rpi-ws281x-native");

const interval = 300;
let counter = 0;

const channel = ws281x(60, { stripType: "ws2812", brightness: 0 });
const colorArray = channel.array;

function getColor(num) {
  switch (num) {
    case 0:
      return 0xFF0000;

    case 0:
      return 0xFF0000;

    case 1:
      return 0xFF0000;
  
    default:
      return 0x000000;
  }
}

function updateColor(color) {
  for (let i = 0; i < channel.count; i++) {
    colorArray[i] = color;
  }  
}

setInterval(() => {
  const color = getColor(counter);
  updateColor(color);
  ws281x.render();
}, interval);
