import express from "express";
import tippDB from "../db/mongoDB.js";

const router = express.Router();

//create a new log, return the log id
router.post("/log", async (req, res) => {
  console.log("POST /api/log body: ", req.body);
  try {
    const { userId, distressLevel, emotion } = req.body;

    const newSessionLog = {
      userId,
      emotionBefore: emotion,
      distressBefore: distressLevel,
      date: new Date(),
    };
    const result = await tippDB.insertOne(newSessionLog);
    res.status(201).json({ success: true, id: result.insertedId });
  } catch (err) {
    console.log("ERROR: sessionLogRouter POST: ", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//get a log by its logid
router.get("/log/:logId", async (req, res) => {
  try {
    const logId = Number(req.params.logId);
    const log = await tippDB.find({ logId });
    res.json({ log });
  } catch (err) {
    console.log("ERROR: sessionLogRouter GET/log/:logId:", err);
    res.status(500).json({ error: "Internal Server Error", log: {} });
  }
});

//get a list of all of a user's logs in a given time range
router.get("/log", async (req, res) => {
  console.log("received request for /api/log");
  try {
    const logs = await tippDB.find();
    res.json({ logs });
  } catch (err) {
    console.log("ERROR: sessionLogRouter:", err);
    res.status(500).json({ error: "Internal Server Error", logs: [] });
  }
});

//delete a specific log
router.delete("/log/:logId", async (req, res) => {});

//finalize a log (after a TIPP practice session)
router.patch("/log/:logId", async (req, res) => {});

export default router;
