require("dotenv").config();

const { sendNodeOnline } = require("./util/sendNodeOnline");

sendNodeOnline();

setInterval(() => {
  console.log("alive");
}, 500);
