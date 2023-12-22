const { api } = require("./api");

async function sendNodeOnline() {
  const code = process.env.NODE_CODE;

  const response = await api("v1/node_online", "POST", {
    code,
  });

  console.log(await response.json());
}

module.exports = {
  sendNodeOnline,
};
