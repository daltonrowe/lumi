const ws281x = require("rpi-ws281x-native");

const interval = 100;

const channel = ws281x(60, { stripType: "ws2812", brightness: 10 });
const colorArray = channel.array;

class RGBStrobeEffect {
  counter = 0;
  numLeds = 0;
  colorArray = undefined;

  constructor(colorArray) {
    this.colorArray = colorArray;
    this.numLeds = colorArray.length;
  }

  getColor() {
    switch (this.counter) {
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

  update() {
    for (let i = 0; i < this.numLeds; i++) {
      this.colorArray[i] = this.getColor();
    }
  }

  count() {
    this.counter >= 2 ? (this.counter = 0) : this.counter++;
  }

  compute() {
    this.update();
    this.count();
    return this.colorArray;
  }
}

const effect = new RGBStrobeEffect(colorArray);

setInterval(() => {
  effect.compute();
  ws281x.render();
}, interval);
