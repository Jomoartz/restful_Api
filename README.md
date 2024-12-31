#RESTFUL API

Description .... comming soon

installation:

- install node js
- clone repository this repository
- Run project - node index.mjs

Cli commands

- Send request to the running server via the cli - curl localhost:port/path?query

- Ports - production: 3000 and development: 4190

- start sever in environment of choice - $env:JomoApiEnv='environment_name'; node index.mjs
- \*\* environment names - production and develoment
  (PowerShell)

- Start server using CMD -
  set JomoApiEnv=production && node index.mjs

- Start server using liux/macOs/unix-based systems -
  JomoApiEnv=production node index.mjs

- code to create certificate and keys for development:
  openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem
  Ensure you have openssl installed (for windows: Download from here - https://slproweb.com/products/Win32OpenSSL.html?form=MG0AV3 ).
