const exec = require("child_process").exec;

async function getSerial() {
  return new Promise((resolve, reject) => {
    exec(
      "cat /proc/cpuinfo | grep Serial | cut -d ' ' -f 2",
      function (error, stdout, stderr) {
        if (error) reject(error);
        if (stderr) reject(stderr);

        resolve(stdout.trim());
      }
    );
  });
}

module.exports = { getSerial };
