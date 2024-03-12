class ResultsComputer {
  constructor() {}

  processedScans = [];
  totalScans = 0;
  firstScan = null;

  players = {};
  nodes = {};
  teams = {};
  sortedNodeKeys = null;

  processScan(scan) {
    this.totalScans++;
    const [_id, _time, card, _game, node, team] = scan;

    // add to teams array
    if (!this.teams[team]) {
      this.teams[team] = {
        scans: {
          ALL: [],
          CAPTURE: [],
        },
        time: 0,
      };
    }

    // add to players array
    if (!this.players[card]) {
      this.players[card] = {
        ALL: [],
        FIRST: [],
        CAPTURE: [],
        SAMEPLAYER: [],
        SAMETEAM: [],
      };
    }

    // add to nodes array
    if (!this.nodes[node]) {
      this.nodes[node] = {
        scans: [],
        teamControl: {},
        lastTime: 0,
        lastTeam: null,
      };
    }

    const captureType = this.appendDerivedData(scan);

    this.processedScans.push(scan);
    this.players[card].ALL.push(scan);
    this.players[card][captureType].push(scan);
    this.nodes[node].scans.push(scan);

    this.teams[team].scans.ALL.push(scan);
    if (captureType === "CAPTURE") this.teams[team].scans.CAPTURE.push(scan);

    this.computeNodeTime(scan);

    if (this.firstScan === null) this.firstScan = scan;
    this.lastScan = scan;
  }

  appendDerivedData(scan) {
    const [_id, _time, card, _game, node, team] = scan;

    let captureType = "FIRST";

    const lastNode = this.nodes[node].scans.slice(-1);

    if (lastNode.length) {
      captureType = "CAPTURE";
      if (lastNode[0][5] === team) captureType = "SAMETEAM";
      if (lastNode[0][2] === card) captureType = "SAMEPLAYER";
    }

    scan.push(captureType);
    return captureType;
  }

  computeNodeTime(scan) {
    const [_id, time, _card, _game, node, team, captureType] = scan;
    const { lastTeam, lastTime } = this.nodes[node];

    if (!this.nodes[node].teamControl[lastTeam]) {
      this.nodes[node].teamControl[lastTeam] = 0;
    }

    if (captureType === "CAPTURE") {
      const captureTime = this.epochSecs(time) - lastTime;
      this.nodes[node].teamControl[lastTeam] += captureTime;
      this.teams[lastTeam].time += captureTime;
    }

    this.nodes[node].lastTime = this.epochSecs(time);
    this.nodes[node].lastTeam = team;
  }

  humanDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleString();
  }

  epochSecs(dateStr) {
    const d = new Date(dateStr);
    return d.getTime() / 1000;
  }

  sortByValue(key, finder) {
    const keys = Object.keys(this[key]);
    keys.sort((a, b) => finder(b) - finder(a));

    return keys;
  }

  translateNodeCode(code) {
    switch (code) {
      case "PIZZATIME":
        return "KITCHEN";

      case "KFC":
        return "LIVING ROOM";

      case "OHYEAH":
        return "GAME ROOM";
    }
  }

  translateTeam(team) {
    switch (team) {
      case "A":
        return "BLUE";

      case "B":
        return "RED";

      case "C":
        return "GREEN";
    }
  }

  printResults() {
    const sortedTeams = this.sortByValue("teams", (item) => {
      return this.teams[item].time;
    });

    const teamsTime = {};
    sortedTeams.forEach((t) => {
      teamsTime[this.translateTeam(t)] = forHumans(this.teams[t].time);
    });

    const sortedTeamCaptures = this.sortByValue("teams", (item) => {
      return this.teams[item].scans.CAPTURE.length;
    });

    const teamsCaptures = {};
    sortedTeamCaptures.forEach((t) => {
      teamsCaptures[this.translateTeam(t)] = this.teams[t].scans.CAPTURE.length;
    });

    const sortedNodes = this.sortByValue("nodes", (item) => {
      return this.nodes[item].scans.length;
    });

    const captures = this.sortByValue("players", (item) => {
      return (
        this.players[item].CAPTURE.length + this.players[item].FIRST.length
      );
    });

    const cheats = this.sortByValue("players", (item) => {
      return (
        this.players[item].SAMEPLAYER.length +
        this.players[item].SAMETEAM.length
      );
    });

    const scanners = this.sortByValue("players", (item) => {
      return this.players[item].ALL.length;
    });

    console.log("%c Most Capture Time ", "background: #bada55; color: #222");
    console.table(teamsTime);

    console.log("%c Most Captures ", "background: #bada55; color: #222");
    console.table(teamsCaptures);

    console.log("%c Player Stats ", "background: #bada55; color: #222");
    console.table({
      "Most Legit Captures": `${captures[0]}, ${captures[1]}, ${captures[2]}`,
      "Top Cheaters": `${cheats[0]}, ${cheats[1]}, ${cheats[2]}`,
      "Top Scanners": `${scanners[0]}, ${scanners[1]}, ${scanners[2]}`,
      "Total Scans": this.totalScans,
    });

    console.log("%c First + Lasts ", "background: #bada55; color: #222");
    console.table({
      "First Scan Name": this.firstScan[2],
      "First Scan Time": this.humanDate(this.firstScan[1]),
      "Last Scan Name": this.lastScan[2],
      "Last Scan Time": this.humanDate(this.lastScan[1]),
      "Most Scanned Node": this.translateNodeCode(sortedNodes[0]),
      "Least Scanned Node": this.translateNodeCode(sortedNodes.slice(-1)[0]),
    });

    const leaders = {};
    captures.forEach((p) => {
      const types = Object.keys(this.players[p]);
      leaders[p] = {};

      types.forEach((t) => {
        leaders[p][t] = this.players[p][t].length;
      });
    });

    console.log("%c Player Data ", "background: #bada55; color: #222");
    console.table(leaders);
  }
}

function forHumans(seconds) {
  const levels = {
    y: seconds / 31536000,
    d: (seconds % 31536000) / 86400,
    h: ((seconds % 31536000) % 86400) / 3600,
    m: (((seconds % 31536000) % 86400) % 3600) / 60,
    s: (((seconds % 31536000) % 86400) % 3600) % 60,
  };

  const formattedDuration = [];

  for (const key in levels) {
    const value = Math.floor(levels[key]);
    if (value === 0) continue;

    formattedDuration.push(`${value}${key}`);
  }

  return formattedDuration.join(" ");
}

const resultsComputerInstance = new ResultsComputer();

function parseCsv(txt) {
  const rows = txt.split("\r\n");

  rows.forEach((row, i) => {
    if (i === 0) return;
    const cols = row.split(",");
    resultsComputerInstance.processScan(cols);
  });

  resultsComputerInstance.printResults();
}

function testFunction() {
  const FILE_INPUT = document.querySelector("#csv");
  const file = FILE_INPUT.files[0];

  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const contents = e.target.result;
    parseCsv(contents);
  };

  reader.readAsText(file);
}

document.querySelector("#test").addEventListener("click", testFunction);
