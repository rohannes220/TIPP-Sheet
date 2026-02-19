import express from "express";
import {mongoDB} from "../db/mongoDB.js";
// to keep parity for now
const tippDB = mongoDB;

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
      timestamp: new Date().toISOString(),
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
    const log = await tippDB.findOne({ logId });
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
router.delete("/log/:logId", async (req, res) => {
  const logId = req.params.logId;
  console.log(`sessionLogRouter: PATCH /api/${logId}`);
  try {
    const result = await tippDB.deleteOne(req.params.logId);
    res.status(204).json(result);
  } catch (error) {
    console.log("ERROR: sessionLogRouter DELETE: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//finalize a log (after a TIPP practice session)
router.patch("/log/:logId", async (req, res) => {
  const logId = req.params.logId;
  console.log(`sessionLogRouter: PATCH /api/${logId}`,  req.body);
  try {
    const {
      distressLevel, 
      emotion, 
      tempTime, 
      exerciseTime, 
      breathingTime, 
      relaxationTime
    } = req.body;

    const recordAttributes = {
      emotionAfter: emotion,
      distressAfter: distressLevel,
      tempTime,
      exerciseTime,
      breathingTime,
      relaxationTime,
    }
    const result = await tippDB.updateOne(logId, {$set: recordAttributes});
    console.log(result);
    if (result.modifiedCount === 0) {
      return res.status(404).json({
        success: false, 
        message: "no matching records found"
      });
    }
    return res.status(200).json({
      success: true, 
      modified: result.modifiedCount
    });
    
  } catch (err) {
    console.log("ERROR: sessionLogRouter PATCH: ", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
