import * as http from "http";
import url from "node:url";

//this server should responed to all requests with a string
const myServer = http.createServer((req, res) => {
  //get the requests url
  const activeurl = req.url;
  //get the method the user is using
  const method = req.method.toLowerCase();
  //get the headers
  const reqHeader = req.headers;

  //parse the url(to break it into its parts)
  const parsedUrl = url.parse(activeurl, true);
  //get the url pathname
  const urlPathname = parsedUrl.pathname;
  //get the url query string
  const queryString = parsedUrl.query;

  //trim url to remove excess slashes
  const trimmedUrl = urlPathname.replace(/^\/+\/+$/g, "");
  console.log(trimmedUrl);
  // return a response telling the user they've been rediected to another url.
  res.end(`Hello, you have been redirected to: ${trimmedUrl} method:${method}`);
  console.log("req comes with this headers: ", reqHeader);
  console.log("req comes with this query: ", queryString);
});

myServer.listen(4190, () => {
  console.log("listeneing on port 419 now");
});
