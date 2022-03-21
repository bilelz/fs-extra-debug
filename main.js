const fs = require("fs");
const fse = require("fs-extra");
const { createReadStream, createWriteStream } = require("fs");
const { createGzip } = require("zlib");

const gzipFile = async (filePath) => {
  return new Promise((resolve, reject) => {
    const stream = createReadStream(filePath);
    stream
      .pipe(createGzip({ level: 9 }))
      .pipe(createWriteStream(`${filePath}.gz`, { mode: 0o777 }))
      .on("finish", () => resolve(true))
      .on("error", (err) => {
        reject(err);
      });
  });
};

const sourceFolder = "src";
const distFolder = "dist";

gzipFile(`${sourceFolder}/html/index.html`);

// suppression du package prédécent
fse.removeSync(distFolder);

try {
  fse.copySync(`${sourceFolder}/html`, `${distFolder}/html`, {
    overwrite: true,
  });
  console.info(`copie du dossier ${sourceFolder}/html`);
} catch (err) {
  console.error(`copie du dossier ${sourceFolder}/html echoué`, err);
}
