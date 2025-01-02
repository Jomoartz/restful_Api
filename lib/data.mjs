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

// Module to handle data creation
data.create = (dir, fileName, payload, callback) => {
  // If file does not exist, create file
  data.baseDir = normalizedFilePath;
  const filePath = path.join(data.baseDir, dir, `${fileName}.json`);

  fs.open(filePath, "wx", (err, fileIdentifier) => {
    if (!err && fileIdentifier) {
      // Write to file
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

// Module to handle reading data
data.read = (dir, fileName, callBack) => {
  data.baseDir = normalizedFilePath;
  const filePath = path.join(data.baseDir, dir, `${fileName}.json`);

  fs.readFile(filePath, "utf8", (err, data) => {
    handleErrors(
      err,
      "Unable to read file",
      (errorMessage) => callBack(errorMessage),
      () => callBack(data)
    );
  });
};


// Utility to handle errors
const handleErrors = (error, errorMessage, errorCallback, successCallback) => {
  if (error) {
    errorCallback(errorMessage); // Pass the error message to the error callback
  } else {
    successCallback(); // Execute the success event
  }
};