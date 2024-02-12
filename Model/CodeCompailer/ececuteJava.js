const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "outputs");
if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executeJava = (filePath) => {
  return new Promise((resolve, reject) => {
    const jobId = path.basename(filePath, ".Java");
    const outPath = path.join(outputPath, jobId);

    const escapedFilePath = filePath.replace(/\\/g, "\\\\"); // Replace backslashes with double backslashes
    console.log("Final path:",escapedFilePath);
    // Simplified javac command
    exec(`javac "${escapedFilePath}" -d "${outPath}"`, (compileError, compileStderr) => {
      if (compileError) {
        // console.log("IF",compileError);
        reject({ compileError, compileStderr });
      } else {
        // console.log("else",outPath);
        // Execute the compiled Java class
        exec(
          `java --enable-preview -XX:+ShowCodeDetailsInExceptionMessages -cp "${outPath}" ${jobId}`,
          (runError, runStdout, runStderr) => {
            if (runError) {
              reject({ runError, runStderr });
            } else {
              resolve(runStdout);
            }
          }
        );
      }
    });
  });
};

module.exports = {
  executeJava,
};