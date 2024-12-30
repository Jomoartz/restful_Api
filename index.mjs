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
    const trimmedUrl = urlPathname.replace(/^\/+\/+$/g, "");

    console.log(trimmedUrl);
    console.log("req comes with this headers: ", reqHeader);
    console.log("req comes with this query: ", queryString);
    console.log("req comes with this payload:", payload);

    // return a response telling the user they've been rediected to another url.
    res.end(
      `Hello, you have been redirected to: ${trimmedUrl} method:${method}`
    );
  });
});

myServer.listen(4190, () => {
  console.log("listeneing on port 419 now");
});
