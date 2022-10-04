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

  function getToken(code) {
    const data = {
        client_id: "1026659897636560959",
        client_secret: "-XGsIvIXw34abaSPTP4qe1dbhxNsdka",
        grant_type: "authorization_code",
        code: code,
        redirect_uri: "https://play.upland.me/",
    };
    return axios
        .post(`https://discord.com/api/v10/oauth2/token`, data, {
            headers: "'Content-Type': 'application/x-www-form-urlencoded'",
        })
        .then((response) => {
            console.log("data", response);
            return response.data;
        });
}
app.get("/auth/discord", async (request, response) => {
    const code = request.query.code;
    console.log(request.url, request.params, request.query, request.headers);
    // return response.sendFile("dashboard.html", { root: "." });
    const authData = await getToken(code);
    console.log("authData", authData);
    const accessToken = authData.access_token;
    console.log("accessToken", accessToken);
    response.redirect(
        "https://play.upland.me/#token_type=Bearer&access_token=" + accessToken
    );
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
