const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

const executeJavaScript = async (filepath) => {
  return new Promise((resolve, reject) => {
    if (!filepath || typeof filepath !== 'string' || filepath.trim() === '') {
      reject(new Error('Invalid filepath. It must be a non-empty string.'));
      return;
    }

    exec(
      `node "${filepath}"`,
      (error, stdout, stderr) => {
        if (error) {
          console.error("Execution error:", error);
          console.error("stderr:", stderr);
          reject({ error, stderr });
        } else {
          console.log("Execution successful. Output:", stdout);
          resolve(stdout);
        }
      }
    );
  });
};

module.exports = {
  executeJavaScript,
};