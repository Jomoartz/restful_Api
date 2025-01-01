/* This page is a sample api which runs on port 8022 and returns the response hello world if connected successfully.
It can be ignored as it does not useful to the project*/

import * as http from "http";

const helloWorldServer = http.createServer((req, res) => {
  res.write("Hello World!");
  res.end();
});

helloWorldServer.listen(8022, () => {
  console.log("listening on port 8022");
});
