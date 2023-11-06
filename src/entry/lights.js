const ws281x = require("rpi-ws281x-native");

const interval = 300;
let counter = 0;

const channel = ws281x(60, { stripType: "ws2812", brightness: 10 });
const colorArray = channel.array;

function getColor(num) {
  switch (num) {
    case 0:
      return 0xff0000;

    case 1:
      return 0x00ff00;

    case 2:
      return 0x0000ff;

    default:
      return 0xffcc22;
  }
}

function updateColor(color) {
  for (let i = 0; i < channel.count; i++) {
    colorArray[i] = color;
  }
}

setInterval(() => {
  if (counter >= 3) counter = 0;

  const color = getColor(counter);
  updateColor(color);

  ws281x.render();

  counter++;
}, interval);
