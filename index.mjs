import * as http from "http";
import * as https from "https";
import url from "node:url";
import { StringDecoder } from "node:string_decoder";
import { env } from "./config.mjs";
import fs from "fs";

//initiate http servers
const httpServer = http.createServer((req, res) => {
  universalServerhandler(req, res);
});
//start http server
httpServer.listen(env.httpPort, () => {
  console.log(`now listening on port: ${env.httpPort}`);
});

const httpsSeverOptions = {
  key: fs.readFileSync("./https/key.pem"),
  cert: fs.readFileSync("./https/cert.pem"),
};
//initiate https server
const httpsServer = https.createServer(httpsSeverOptions, (req, res) => {
  universalServerhandler(req, res);
});
//start https server
httpsServer.listen(env.httpsPort, () => {
  console.log(`now listening on port: ${env.httpsPort} `);
});

//handle server requests and responses
const universalServerhandler = (req, res) => {
  //get the requests url
  const activeurl = req.url;
  //get the method the user is using
  const method = req.method.toLowerCase();
  //get the headers
  const reqHeader = req.headers;
  //initialize a decoder
  const decoder = new StringDecoder("utf8");
  //get the payload
  let payload = ""; //variabe to store the payload
  req.on("data", (data) => {
    //decode the data to utf-8 charset
    payload += decoder.write(data);
  });
  //listen for when payload is done sending
  req.on("end", () => {
    payload += decoder.end();

    //parse the url(to break it into its parts)
    const parsedUrl = url.parse(activeurl, true);
    //get the url pathname
    const urlPathname = parsedUrl.pathname;
    //get the url query string
    const queryString = parsedUrl.query;

    //trim url to remove excess slashes
    const trimmedUrl = urlPathname.replace(/^\/+|\/+$/g, "");

    //store data we wish to send to  our chosen handler
    const data = {
      "trimmed path": trimmedUrl,
      "query string": queryString,
      method: method,
      headers: reqHeader,
      payload: payload,
    };

    let handler = {};
    handler.sample = (data, callback) => {
      callback(200, { name: data });
    };
    handler.foo = (data, callback) => {
      callback(404, { Alert: "page is under development" });
    };
    handler.notFound = (data, callback) => {
      callback(404);
    };
    handler.ping = (data, callback) => {
      callback(200);
    };
    const routes = {
      sample: handler.sample,
      notFound: handler.notFound,
      ping: handler.ping,
      foo: handler.foo,
    };
    const chooseHandler =
      typeof routes[trimmedUrl] !== "undefined"
        ? routes[trimmedUrl]
        : routes.notFound;

    try {
      chooseHandler(data, (statuscode, rpayload) => {
        //set defaults for payload and status codes
        rpayload = typeof rpayload == "object" ? rpayload : {};
        statuscode = typeof statuscode == "number" ? statuscode : 404;
        //ensure payload is inn json
        const jsonPayload = JSON.stringify(rpayload);

        res.setHeader("Content-Type", "application/json");
        res.writeHead(statuscode);
        res.end(jsonPayload);
        console.log("returning this response:", jsonPayload, statuscode);
      });
    } catch (error) {
      if (trimmedUrl == undefined) {
        console.log("url is undefined");
      } else if (trimmedUrl in routes == false) {
        console.log(`trimmed url does not match any route`);
      } else {
        console.log("unknownerror", error);
      }
    }
  });
};
