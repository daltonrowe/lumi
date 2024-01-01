// Imports

const ws281x = require("rpi-ws281x-native");
const SoftSPI = require("rpi-softspi");
const Mfrc522 = require("mfrc522-rpi");

// LED

const ledChannel = ws281x(60, {
  stripType: "ws2812",
  brightness: 50,
});

const colorArray = ledChannel.array;

// RFID

const softSPI = new SoftSPI({
  clock: 23, // SCLK
  mosi: 19, // MOSI
  miso: 21, // MISO
  client: 24, // CS
});

const mfrc522 = new Mfrc522(softSPI).setResetPin(22);

const Provider = {
  ws281x,
  ledChannel,
  colorArray,
  softSPI,
  mfrc522,
  lights: null,
  game: null,
};

function getProvider() {
  return Provider;
}

function register(name, content) {
  Provider[name] = content;
}

module.exports = {
  getProvider,
  register,
};
