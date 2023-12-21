const exec = require("child_process").exec;

function getSerial(callback) {
  exec(
    "cat /proc/cpuinfo | grep Serial | cut -d ' ' -f 2",
    function (_error, stdout, _stderr) {
      callback(stdout.trim());
    }
  );
}

module.exports = { getSerial };
