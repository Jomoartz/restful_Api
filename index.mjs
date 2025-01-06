import * as http from "http";
import * as https from "https";
import url from "node:url";
import { StringDecoder } from "node:string_decoder";
import { env } from "./config.mjs";
import fs from "fs/promises";
import { handler } from "./lib/handlers.mjs";
import { helpers } from "./lib/helpers.mjs";

/*This page we create and run our servers: http and https. 
Handle the servers request and responses based on the users url path, method and other parameters i.e( route)*/

// Initiate HTTP server
const httpServer = http.createServer(async (req, res) => {
  await universalServerHandler(req, res);
});
// Start HTTP server
httpServer.listen(env.httpPort, () => {
  console.log(`Now listening on Http port: ${env.httpPort}`);
});

// Cert keys for HTTPS server
const httpsServerOptions = {
  key: await fs.readFile("./https/key.pem"),
  cert: await fs.readFile("./https/cert.pem"),
};
// Initiate HTTPS server
const httpsServer = https.createServer(httpsServerOptions, async (req, res) => {
  await universalServerHandler(req, res);
});
// Start HTTPS server
httpsServer.listen(env.httpsPort, () => {
  console.log(`Now listening on Https port: ${env.httpsPort}`);
});

// Handle server request and responses
const universalServerHandler = async (req, res) => {
  // Get the request URL
  const activeUrl = req.url;
  // Get the method the user is using
  const method = req.method.toLowerCase();
  // Get the headers
  const reqHeader = req.headers;
  // Initialize a decoder
  const decoder = new StringDecoder("utf8");
  // Get the payload
  let payload = ""; // Variable to store the payload
  // Decode payload
  for await (const chunk of req) {
    payload += decoder.write(chunk);
  }
  payload += decoder.end();

  // Parse the URL (to break it into its parts)
  const parsedUrl = url.parse(activeUrl, true);
  // Get the URL pathname
  const urlPathname = parsedUrl.pathname;
  // Get the URL query string
  const queryString = parsedUrl.query;

  // Trim URL to remove excess slashes
  const trimmedUrl = urlPathname.replace(/^\/+|\/+$/g, "");

  // Store data we wish to send to our chosen handler
  const data = {
    trimmedPath: trimmedUrl,
    queryString: queryString,
    method: method,
    headers: reqHeader,
    payload: helpers.parseToObject(payload),
  };

  const routes = {
    sample: handler.sample,
    notFound: handler.notFound,
    ping: handler.ping,
    foo: handler.foo,
    users: handler.users,
    tokens: handler.tokens,
  };
  const chooseHandler =
    typeof routes[trimmedUrl] !== "undefined"
      ? routes[trimmedUrl]
      : routes.notFound;

  try {
    const [statusCode, rPayload] = await chooseHandler(data);
    // Set defaults for payload and status codes
    const jsonPayload = JSON.stringify(rPayload || {});

    res.setHeader("Content-Type", "application/json");
    res.writeHead(statusCode || 404);
    res.end(jsonPayload);
    console.log("Returning this response:", jsonPayload, statusCode);
  } catch (error) {
    console.error("Error handling request:", error);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Internal Server Error" }));
  }
};
