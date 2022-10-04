const express = require("express");
const app = express();
const axios = require("axios").default;
const fs = require("fs");
const path = require("path");

app.use(require("cors")());
app.use("/static", express.static(path.join(__dirname, "public")));

app.get("/chunk", (req, res) => {
  console.log("chunk request");

  const js = fs.readFileSync(path.join(__dirname, "chunk2.js"));
  const bootstrap = fs.readFileSync(path.join(__dirname, "bootstrap.js"));

  const code = js + " " + bootstrap;

  res.send(code);
});

app.get("/mainChunk", (req, res) => {
  console.log("main chunk request");
  const js = fs.readFileSync(path.join(__dirname, "main.chunk2.js"));

  res.send(js);
});

app.get("/", (req, res) => {
  res.send("Working!");
});


app.get("/auth/discord", (request, response) => {
  const code = request.query.code;
  console.log(request.url, request.params, request.query, request.headers);
  // return response.sendFile("dashboard.html", { root: "." });
  response.redirect(`https://play.upland.me/?tokenType=Bearer&accessToken=${code}`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
