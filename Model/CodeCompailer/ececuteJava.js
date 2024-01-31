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

    // Simplified javac command
    exec(`javac "${escapedFilePath}" -d "${outPath}"`, (compileError, compileStderr) => {
      if (compileError) {
        reject({ compileError, compileStderr });
      } else {
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