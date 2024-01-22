const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const { stdout, stderr } = require("process");

const outputPath = path.join(__dirname, "outputs");
if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}
const executeCpp = (filePath) => {
  //C:\Users\badas\Desktop\code-098\skillhub_server\Model\CodeCompailer\codes\840f2a54-2325-4d0d-9b7a-8b8ee9428584.cpp
  const jobId = path.basename(filePath).split(`.`)[0];
  const outPath = path.join(outputPath, `${jobId}.exe`);
  return new Promise((resolve, reject) => {
    exec(
        `g++ ${filePath} -o ${outPath} && cd /d ${outputPath} && .\\${jobId}.exe`,
        (error, stdout, stderr) => {
          error && reject({ error, stderr });
          stderr && reject(stderr);
          resolve(stdout);
        }
      );
  });
};
module.exports = {
  executeCpp,
};
