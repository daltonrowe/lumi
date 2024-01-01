function checkValidScan(readData) {
  if (typeof readData !== "string") return false;
  if (readData.indexOf("-") !== 1) return false;

  const [team, cardId] = readData.split("-");

  return {
    team,
    cardId,
  };
}

module.exports = {
  checkValidScan,
};
