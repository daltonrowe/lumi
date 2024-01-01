const { getProvider } = require("./Provider");
const { checkValidScan } = require("../util/checkValidScan");

class Game {
  debounceInterval = null;
  debounceScans = [];

  nodeTeam = null;
  nodeCardId = null;

  constructor() {
    const { lights } = getProvider();
    this.lights = lights;
  }

  handleScan(readData) {
    const scan = checkValidScan(readData);
    if (!scan) return;

    if (this.debounceInterval) {
      clearInterval(this.debounceInterval);
    } else {
      this.acknowledgeFirstScan();
    }
    this.debounceScans.push(scan);

    this.debounceInterval = setInterval(() => {
      this.endScanDebounce();
    }, process.env.SCAN_DEBOUNCE);
  }

  endScanDebounce() {
    clearInterval(this.debounceInterval);

    const scans = [...this.debounceScans];
    this.debounceScans = [];

    scans.reverse();
    const scan = scans[0];

    const sameTeam = scan.team === this.nodeTeam;
    const sameCardId = scan.cardId === this.nodeCardId;

    if (sameCardId && sameTeam) {
      this.handleSameCardId(scan);
      return;
    }

    if (sameTeam) {
      this.handleSameTeam(scan);
      return;
    }

    this.handleNewTeam(scan);
  }

  handleSameCardId(scan) {
    console.log("Same Card Id:", scan.team, scan.cardId);
    this.lights.setTeamColor(scan.team);
  }

  handleSameTeam(scan) {
    console.log("Same Team:", scan.team, scan.cardId);
    this.lights.setTeamColor(scan.team);
  }

  handleNewTeam(scan) {
    console.log("New Team:", scan.team, scan.cardId);
    this.lights.setTeamColor(scan.team);
  }

  acknowledgeFirstScan() {
    this.lights.acknowledgeFirstScan();
  }
}

module.exports = {
  Game,
};
