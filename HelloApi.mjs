/* This page is a sample api which runs on port 8022 and returns the response hello world if connected successfully.
It can be ignored as it does not useful to the project*/

//this file will likely also be used to test run code

import * as http from "http";
import { data } from "./lib/data.mjs";

const helloWorldServer = http.createServer((req, res) => {
  res.write("Hello World!");
  res.end();
});

// helloWorldServer.listen(8022, () => {
//   console.log("listening on port 8022");
// });

//Test data module
data.create(
  "test",
  "newFile2",
  { test_result: "data is saved succesfully" },
  (err) => {
    if (err) {
      console.error("Error:", err);
    } else {
      console.log("File created successfully!");
    }
  }
);
