import * as http from "http";
import url from "node:url";

//this server should responed to all requests with a string
const myServer = http.createServer((req, res) => {
  //get the requests url
  const activeurl = req.url;
  //get the method the user is using
  const method = req.method.toLowerCase();

  //parse the url(to break it into its parts)
  const parsedUrl = url.parse(activeurl, true);
  console.log(parsedUrl);
  //get the url pathname
  const urlPathname = parsedUrl.pathname;
  //trim url to remove excess slashes
  const trimmedUrl = urlPathname.replace(/^\/+\/+$/g, "");
  console.log(trimmedUrl);
  // return a response telling the user they've been rediected to another url.
  res.end(
    `Hello, you have been redirected to: ${trimmedUrl} method:${method} `
  );
});

myServer.listen(4190, () => {
  console.log("listeneing on port 419 now");
});
