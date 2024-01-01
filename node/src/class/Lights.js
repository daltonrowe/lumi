const { getProvider } = require("./Provider");
const { fillArray } = require("../util/fillArray");

class Lights {
  teamColors = {
    A: 0x0000ff,
    B: 0xff0000,
    C: 0x00ff00,
  };

  constructor() {
    const { ws281x, ledChannel, colorArray } = getProvider();
    this.ws281x = ws281x;
    this.ledChannel = ledChannel;
    this.colorArray = colorArray;
  }

  setDefaultColor() {
    fillArray(this.colorArray, 0x555555);
    this.ws281x.render();
  }

  acknowledgeFirstScan() {
    fillArray(this.colorArray, 0xffffff);
    this.ws281x.render();
  }

  setTeamColor(team) {
    if (!this.teamColors[team]) return;

    const color = this.teamColors[team];
    fillArray(this.colorArray, color);
    this.ws281x.render();
  }
}

module.exports = {
  Lights,
};
