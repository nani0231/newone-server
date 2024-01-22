const { exec } = require("child_process");

const executeRuby = (filePath) => {
  return new Promise((resolve, reject) => {
    exec(
      `ruby ${filePath}`,
      (error, stdout, stderr) => {
        if (error) {
          reject({ error, stderr });
        } else if (stderr) {
          reject(stderr);
        } else {
          resolve(stdout);
        }
      }
    );
  });
};

module.exports = {
  executeRuby,
};