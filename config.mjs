let environment = {};

environment.development = {
  httpPort: 4190,
  httpsPort: 4191,
  env_name: "Development",
};

environment.production = {
  httpPort: 3000,
  httpsPort: 3001,
  env_name: "Production",
};

//Listen to the cli and accept chosen env
const chosenEnv =
  typeof process.env.JomoApiEnv === "string"
    ? process.env.JomoApiEnv.toLowerCase()
    : "";

//Set environment variable based on chosen env
const env =
  chosenEnv in environment ? environment[chosenEnv] : environment.development;
console.log("config_error catcher:", chosenEnv);
export { env };
