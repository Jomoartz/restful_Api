// Helpers for various tasks
import crypto from "crypto";
import { env } from "../config.mjs";

// Container for helpers
export let helpers = {};

// This is a helper to encrypt strings like passwords
helpers.hash = (str) => {
  if (typeof str == "string" && str.length > 0) {
    const hash = crypto
      .createHmac("sha256", env.hashingSecrets)
      .update(str)
      .digest("hex");
    return hash;
  } else {
    return false;
  }
};

helpers.parseToObject = (data) => {
  try {
    const parsedData = JSON.parse(data);
    return parsedData;
  } catch (err) {
    console.log(`Error parsing data:  ${err}`);
  }
};
