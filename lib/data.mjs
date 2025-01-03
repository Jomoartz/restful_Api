//This is a library for storing and editing data
import * as fs from "node:fs/promises";
import path from "node:path";
import { json } from "node:stream/consumers";
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
  // "wx" flag opens the file for writing and throws an error if the file already exists
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
const handleErrors = async (error, errorMessage) => {
  if (error) {
    console.log(errorMessage);
    throw new Error(errorMessage);
  }
};

//update data inside file
data.update = async (dir, fileName, updateData) => {
  try {
    data.baseDir = normalizedFilePath;
    const filePath = path.join(data.baseDir, dir, `${fileName}.json`);
    //open file for writing and throw an error if file does not exist
    const fileIdentifier = await fs.open(filePath, "r+");
    try {
      await fileIdentifier.truncate();
      const jsonData = JSON.stringify(updateData);
      await fs.writeFile(fileIdentifier, jsonData);
      fileIdentifier.close();
      console.log('file updated successfully');
    } catch (err) {
      await handleErrors(
        err,
        `Unable To Update File: ${err}`
      );
    }
  } catch (err) {
    await handleErrors(
      err,
      `Unable To Update File: ${err}`
    );
  }
};

//updating code to use es6 and created update functionality for data lib
