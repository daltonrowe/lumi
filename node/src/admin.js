const { startWriteSession } = require("./util/write");

console.log("Start Write Session");

const writerInterval = startWriteSession("A", "ball", (writeResponse) => {
  const { readData, readDataHex, uidString } = writeResponse;

  console.log(`
Card UID     : ${uidString}
Data Read    : ${readData} (${readDataHex.join(" ")})
`);

  clearInterval(writerInterval);
});
