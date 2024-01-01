const { fromHex } = require("./encode");
const { getProvider } = require("../class/Provider.js");

function readCard(callback) {
  const { mfrc522 } = getProvider();
  mfrc522.reset();

  let response = mfrc522.findCard();
  if (!response.status) return;

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

function startReadSession(callback) {
  const readInterval = setInterval(() => {
    readCard(callback);
  }, 500);

  return readInterval;
}

module.exports = {
  readCard,
  startReadSession,
};
