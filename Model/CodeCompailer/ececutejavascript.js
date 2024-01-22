const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "outputs");
if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executeJavaScript = (code) => {
  return new Promise((resolve, reject) => {
    const jobId = "output"; // You can use a unique identifier here if needed
    const outPath = path.join(outputPath, `${jobId}.js`);
    
    fs.writeFileSync(outPath, code);

    exec(
      `node "${outPath}"`,
      (error, stdout, stderr) => {
        if (error) {
          reject({ error, stderr });
        } else {
          resolve(stdout);
        }
      }
    );
  });
};

module.exports = {
  executeJavaScript,
};
