const { startWriteSession } = require("./util/write");

console.log("Start Write Session");

const writerInterval = startWriteSession("A", "ball", (writeResponse) => {
  const { readData, readDataHex, writeData, writeDataHex, uidString } =
    writeResponse;

  console.log(`
Card UID     : ${uidString}
Data Written : ${writeData} (${writeDataHex.join(" ")})
Data Read    : ${readData} (${readDataHex.join(" ")})
`);

  clearInterval(writerInterval);
});
