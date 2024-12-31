import * as http from "http";
import url from "node:url";
import { StringDecoder } from "node:string_decoder";

//this server should responed to all requests with a string
const myServer = http.createServer((req, res) => {
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
    const routes = {
      sample: handler.sample,
      notFound: handler.notFound,
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

    // return a response telling the user they've been rediected to another url.
    // res.end(
    //   `Hello, you have been redirected to: ${trimmedUrl} method:${method}`
    // );
  });
});

myServer.listen(4190, () => {
  console.log("listeneing on port 419 now");
});
