const { api } = require("./api");
const { getSerial } = require("./getSerial");

async function sendNodeOnline() {
  const code = process.env.NODE_CODE;
  const response = await api("v1/node_online", "POST", {
    code,
  });
}

module.exports = {
  sendNodeOnline,
};
