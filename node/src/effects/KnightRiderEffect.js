class KnightRiderEffect {
  numLeds = 0;
  colorArray = undefined;
  center = 0;
  dir = 1;

  constructor(colorArray) {
    this.colorArray = colorArray;
    this.numLeds = colorArray.length;
  }

  getColor(i) {
    if (i === this.center) return 0xff0000;

    const distance = Math.abs(i - this.center);
    if (distance > 5) return 0x000000;

    return 0xff0000 - (0xff0000 / 5) * distance;
  }

  update() {
    for (let i = 0; i < this.numLeds; i++) {
      this.colorArray[i] = this.getColor(i);
    }
  }

  count() {
    // change dir at the ends
    if (this.center === this.numLeds - 1) this.dir = -1;
    if (this.center === 0) this.dir = 1;

    this.center += this.dir;
  }

  compute() {
    this.update();
    this.count();
    return this.colorArray;
  }
}

module.exports = KnightRiderEffect;
