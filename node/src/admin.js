const { startWriteSession } = require("./util/write");

const args = process.argv.slice(2);
let mode = "default";
let team = "A";
let cardId = "ball";

const singleFlag = args.findIndex((arg) => arg.includes("--single="));
if (singleFlag !== -1) {
  console.log("single write mode");
  mode = "single";

  const [_flag, value] = args[singleFlag].split("=");
  const [teamValue, teamCardId] = value.split(",");

  team = teamValue;
  cardId = teamCardId;
}

console.log(`
Start Write Session:
Data: ${team}-${cardId}
Mode: ${mode}
`);

const writerInterval = startWriteSession(team, cardId, (writeResponse) => {
  const { readData, readDataHex, uidString } = writeResponse;

  console.log(`
Card UID     : ${uidString}
Data Read    : ${readData} (${readDataHex.join(" ")})
`);

  clearInterval(writerInterval);
});
