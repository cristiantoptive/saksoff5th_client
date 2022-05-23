/* eslint-disable */
const API_URL = process.env.API_URL || "http://localhost:3000";

const PROXY_CONFIG = {
  "/api/*": {
    target: API_URL,
    secure: false,
    logLevel: "debug",
    changeOrigin: true,
  },
};

module.exports = PROXY_CONFIG;
