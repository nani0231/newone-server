const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "outputs");
if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executeJava = (filePath) => {
  return new Promise((resolve, reject) => {
    const jobId = path.basename(filePath).split(`.`)[0];
    const outPath = path.join(outputPath, `${jobId}.java`);
    // 'C:\Program Files\Java\jdk-21\bin\java.exe' '--enable-preview' '-XX:+ShowCodeDetailsInExceptionMessages' '-cp' 'C:\Users\badas\AppData\Roaming\Code\User\workspaceStorage\45415be482997de07b10a77a8c3bd868\redhat.java\jdt_ws\code-098_977cc6f9\bin' 'Hello'
    exec(
      `javac "${filePath}" -d "${outPath}" && java -cp "${outputPath}" ${jobId}`,
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
  executeJava,
};

// const { exec } = require("child_process");
// const fs = require("fs");
// const path = require("path");

// const outputPath = path.join(__dirname, "outputs");
// if (!fs.existsSync(outputPath)) {
//   fs.mkdirSync(outputPath, { recursive: true });
// }

// // Set the path to your javac and java executables
// const javacPath = 'C:\\Program Files\\Java\\jdk-21\\bin\\javac.exe';
// const javaPath = 'C:\\Program Files\\Java\\jdk-21\\bin\\java.exe';

// const executeJava = (filePath) => {
//   return new Promise((resolve, reject) => {
//     const jobId = path.basename(filePath, path.extname(filePath));
    
//     // Compile Java source file
//     exec(`javac "${javacPath}" "${filePath}" -d "${outputPath}"`, (compileError, compileStdout, compileStderr) => {
//       if (compileError) {
//         reject({ error: compileError, stderr: compileStderr });
//       } else {
//         // Execute compiled Java class
//         exec(`"${javaPath}" -cp "${outputPath}" ${jobId}`, (javaError, javaStdout, javaStderr) => {
//           if (javaError) {
//             reject({ error: javaError, stderr: javaStderr });
//           } else {
//             resolve(javaStdout);
//           }
//         });
//       }
//     });
//   });
// };

// module.exports = {
//   executeJava,
// };

