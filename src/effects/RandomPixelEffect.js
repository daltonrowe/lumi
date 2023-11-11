class RandomPixelEffect {
  numLeds = 0;
  colorArray = undefined;

  constructor(colorArray) {
    this.colorArray = colorArray;
    this.numLeds = colorArray.length;
  }

  getColor() {
    const hexChars = [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
    ];

    let randHex = "";

    for (let i = 0; i < 6; i++) {
      const randIndex = Math.round(Math.random() * 16);
      const randChar = hexChars[randIndex];
      randHex += randChar;
    }

    const color = parseInt(randHex, 16);

    return color;
  }

  update() {
    for (let i = 0; i < this.numLeds; i++) {
      this.colorArray[i] = this.getColor(i);
    }
  }

  compute() {
    this.update();
    return this.colorArray;
  }
}

module.exports = RandomPixelEffect;
