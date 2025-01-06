// Some node modules: node standard library
import fs from "fs"; //file system
import * as http from "http"; //server
import path from "path"; // handles file paths
import os from "os"; // Performs operations on the os

// Use cases
// File system:
fs.writeFileSync("example.txt", "Hello, Node.js!"); //create fle
console.log(fs.readFileSync("example.txt", "utf-8")); //read file

// // Http server
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello, World!");
});
server.listen(3000, () => console.log("Server running on port 3000"));

// // Operatiing system
console.log("Platform:", os.platform());
console.log("Free Memory:", os.freemem());
