const { api } = require("./api");
const { getSerial } = require("./getSerial");

async function sendNodeOnline() {
  const code = await getSerial();

  const response = await api("v1/node_online", "POST", {
    code,
  });
}

module.exports = {
  sendNodeOnline,
};
