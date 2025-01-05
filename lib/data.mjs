//This is a library for storing and editing data
import * as fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { helpers } from "./helpers.mjs";

export const data = {};

// Utility to handle errors
const handleErrors = async (error, errorMessage) => {
  if (error) {
    console.log(errorMessage);
    return errorMessage;
  }
};

// Replicate __dirname behavior in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a fixed file path based on this script's location
const windowsFilePath = path.win32.join(__dirname, "/../.data/");
// Normalize the file path to ensure platform compatibility
const normalizedFilePath = path.normalize(windowsFilePath);

// Module to handle data creation
data.create = async (dir, fileName, payload) => {
  try {
    // If file does not exist, create file
    data.baseDir = normalizedFilePath;
    const filePath = path.join(data.baseDir, dir, `${fileName}.json`);
    // "wx" flag opens the file for writing and throws an error if the file already exists
    const fileIdentifier = await fs.open(filePath, "wx");
    try {
      const jsonData = JSON.stringify(payload);
      await fs.writeFile(fileIdentifier, jsonData);
      await fileIdentifier.close();
      console.log("file created successfully");
    } catch (error) {
      handleErrors(error, `error creating new file: ${error}`);
    }
  } catch (error) {
    handleErrors(error, `error accessing file: ${error}`);
  }
};

// Module to handle reading data
data.read = async (dir, fileName) => {
  try {
    data.baseDir = normalizedFilePath;
    const filePath = path.join(data.baseDir, dir, `${fileName}.json`);
    const fileContent = await fs.readFile(filePath, "utf8");
    // @Todo: return false also? 
    return helpers.parseToObject(fileContent);
  } catch (error) {
    handleErrors(error, `Unable to read file: ${error}`);
    // @Todo: Refactor handler._users.post to avoid relying on and throwing this error.
    throw new Error(error);
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
      console.log("file updated successfully");
    } catch (err) {
      await handleErrors(err, `Unable To Update File: ${err}`);
    }
  } catch (err) {
    await handleErrors(err, `Unable To Update File: ${err}`);
  }
};

data.delete = async (dir, fileName) => {
  try {
    data.baseDir = normalizedFilePath;
    const filePath = path.join(data.baseDir, dir, `${fileName}.json`);
    await fs.unlink(filePath);
    console.log("Data deleted succesfully!");
  } catch (error) {
    handleErrors(error, `error deleting file: ${error}`);
  }
};


