"use strict";
const Mfrc522 = require("mfrc522-rpi");
const SoftSPI = require("rpi-softspi");
const { toHex, fromHex } = require("../util/encode");

//# This loop keeps checking for chips. If one is near it will get the UID and authenticate
console.log("scanning...");
console.log("Please put chip or keycard in the antenna inductive zone!");
console.log("Press Ctrl-C to stop.");

const softSPI = new SoftSPI({
  clock: 23, // pin number of SCLK
  mosi: 19, // pin number of MOSI
  miso: 21, // pin number of MISO
  client: 24, // pin number of CS
});

const mfrc522 = new Mfrc522(softSPI).setResetPin(22);

setInterval(function () {
  //# reset card
  mfrc522.reset();

  //# Scan for cards
  let response = mfrc522.findCard();
  if (!response.status) {
    console.log("No Card");
    return;
  }
  console.log("Card detected, CardType: " + response.bitSize);

  //# Get the UID of the card
  response = mfrc522.getUid();
  if (!response.status) {
    console.log("UID Scan Error");
    return;
  }
  //# If we have the UID, continue
  const uid = response.data;
  console.log(
    "Card read UID: %s %s %s %s",
    uid[0].toString(16),
    uid[1].toString(16),
    uid[2].toString(16),
    uid[3].toString(16)
  );

  //# Select the scanned card
  const memoryCapacity = mfrc522.selectCard(uid);
  console.log("Card Memory Capacity: " + memoryCapacity);

  //# This is the default key for authentication
  const key = [0xff, 0xff, 0xff, 0xff, 0xff, 0xff];

  //# Authenticate on Block 8 with key and uid
  if (!mfrc522.authenticate(8, key, uid)) {
    console.log("Authentication Error");
    return;
  }

  console.log("Read current data:");
  console.log(mfrc522.getDataForBlock(8));

  const resetData = [
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00,
  ];

  console.log("Reset data with 16 x 0");
  mfrc522.writeDataToBlock(8, resetData);

  console.log("Read data after reset:");
  console.log(mfrc522.getDataForBlock(8));

  console.log("Now set our custom data");
  mfrc522.writeDataToBlock(8, toHex("pizza"));

  const newData = mfrc522.getDataForBlock(8);
  console.log("Read data after write:");
  console.log(newData);

  console.log("Decode data:");
  console.log(fromHex(newData));

  mfrc522.stopCrypto();

  console.log("finished successfully!");
}, 500);
