import express from "express";
import mongoose from "mongoose";
import shortUrl from "./model/shortStore.js";
import cors from "cors";

import dotenv from 'dotenv'
dotenv.config();

const app = express();

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(
  cors({
    origin: "https://your-url-shortener.netlify.app",
    credentials: true,
  })
);


app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello There!");
});

app.post("/short-url", async (req, res) => {
  const found = await shortUrl.find({ full: req.body.full });
  if (found.length > 0) {
    res.send(found);
  } else {
    await shortUrl.create({ full: req.body.full });
    const foundNow = await shortUrl.find({ full: req.body.full });
    res.send(foundNow);
  }
});

app.get("/:shortUrl", async (req, res) => {
  const short = await shortUrl.findOne({ short: req.params.shortUrl });
  if (short == null) return res.sendStatus(404);
  res.redirect(`${short.full}`);
});

let port = process.env.PORT || 9003;

app.listen(port, function () {
  console.log("Server started successfully on port: ", port);
});
