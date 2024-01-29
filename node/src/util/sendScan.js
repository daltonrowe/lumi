const { api } = require("./api");

async function sendScan(scan) {
  const code = process.env.NODE_CODE;

  const response = await api("card_scan", {
    code,
    team: scan.team,
    cardId: scan.cardId,
  });

  console.log(response);
}

module.exports = {
  sendScan,
};
