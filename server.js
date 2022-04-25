/* eslint-disable */
process.env.NODE_TLS_REJECT_UNAUTHORIZED = false;

const compression = require("compression");
const express     = require("express");
const path        = require("path");
const app         = express();
const proxy       = require("http-proxy").createProxyServer({ rejectUnauthorized: false });
const cors        = require("cors");

app.use(cors());
app.use(compression());

// proxy all requests to target url changing origin
app.all("/api/*", (req, res) => {
  proxy.web(req, res, {
    target:       process.env.API_URL,
    changeOrigin: true,
    secure:       false,
  }, err => console.error(err));
});

app.use(express.static(`${__dirname}/dist`));

app.get("*", function (req, res) {
  res.sendFile(path.join(`${__dirname}/dist/index.html`), {
    headers: {
      'Service-Worker-Allowed': '/',
    }
  });
});

app.listen(process.env.PORT || 8080);
