let environment = {};

environment.development = {
  port: 4190,
  env_name: "Development",
};

environment.production = {
  port: 3000,
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

export { env };
