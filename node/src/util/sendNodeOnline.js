const { api } = require("./api");

async function sendNodeOnline() {
  const code = process.env.NODE_CODE;

  const response = await api("node_online", { code });

  console.log(response);
}

module.exports = {
  sendNodeOnline,
};
