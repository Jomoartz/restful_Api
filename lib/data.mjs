//This is a library for storing and editing data
import * as fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";


export const data = {};

// Replicate __dirname behavior in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a fixed file path based on this script's location
const windowsFilePath = path.win32.join(__dirname, "/../.data/");
// Normalize the file path to ensure platform compatibility
const normalizedFilePath = path.normalize(windowsFilePath);


data.create = (dir, fileName, payload, callback) => {
  //if file does not exist, create file
  data.baseDir = normalizedFilePath;
  const filePath = path.join(data.baseDir, dir, `${fileName}.json`);

  fs.open(filePath, "wx", (err, fileIdentifier) => {
    if (!err && fileIdentifier) {
      //write to file
      const jsonData = JSON.stringify(payload);
      fs.write(fileIdentifier, jsonData, (error) => {
        // Handle possible errors
        handleErrors(error, "Error generating new file", callback, (error) => {
          fs.close(fileIdentifier, (err) => {
            handleErrors(err, "Error closing file", callback, () =>
              callback(false)
            );
          });
        });
      });
    } else {
      callback("Error creating new file. File may exist already.");
    }
  });
};

const handleErrors = (
  error,
  setErrorMessage,
  errorCallback,
  errorFreeEvent
) => {
  if (error) {
    errorCallback(setErrorMessage);
  } else {
    errorFreeEvent();
  }
};
