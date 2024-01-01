const { toHex, fromHex } = require("./encode");
const { getProvider } = require("../class/Provider.js");

function writeCard(writeDataHex, callback) {
  const { mfrc522 } = getProvider();
  mfrc522.reset();

  let response = mfrc522.findCard();
  if (!response.status) return;

  console.log("Card detected!");

  response = mfrc522.getUid();
  if (!response.status) {
    console.log("UID Read Error.");
    return;
  }

  const uid = response.data;
  const uidString = [
    uid[0].toString(16),
    uid[1].toString(16),
    uid[2].toString(16),
    uid[3].toString(16),
  ].join(" ");

  // select the car
  mfrc522.selectCard(uid);

  const key = [0xff, 0xff, 0xff, 0xff, 0xff, 0xff];
  if (!mfrc522.authenticate(8, key, uid)) {
    console.log("Authentication Error.");
    return;
  }

  // write new data
  mfrc522.writeDataToBlock(8, writeDataHex);

  // read data
  const readDataHex = mfrc522.getDataForBlock(8);
  const readData = fromHex(readDataHex);

  mfrc522.stopCrypto();

  callback({
    uidString,
    readData,
    readDataHex,
  });
}

function startWriteSession(team, cardId, callback) {
  if (cardId.length > 14) {
    console.error(`writeData too long: ${cardId}`);
    return;
  }

  const writeData = `${team}-${cardId}`;
  const writeDataHex = toHex(writeData);

  const writeInterval = setInterval(() => {
    writeCard(writeDataHex, callback);
  }, 500);

  return writeInterval;
}

module.exports = {
  startWriteSession,
};
