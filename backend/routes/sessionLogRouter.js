import express from "express";
import {mongoDB, collections } from "../db/mongoDB.js";
const router = express.Router();

//create a new log, return the log id
router.post("", async (req, res) => {
  console.log("POST /api/log body: ", req.body);
  try {
    const { userId, distressLevel, emotion } = req.body;

    const newSessionLog = {
      userId,
      emotionBefore: emotion,
      distressBefore: distressLevel,
      timestamp: new Date().toISOString(),
    };
    const result = await mongoDB.insertOne(
      collections.SESSION_LOGS,
      newSessionLog,
    );
    res.status(201).json({ success: true, id: result.insertedId });
    console.log("POST success: id", result.insertedId);
  } catch (err) {
    console.log("ERROR: sessionLogRouter POST: ", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//get a log by its logid
router.get("/:logId", async (req, res) => {
  const logId = req.params.logId;
  console.log(`sessionLogRouter: GET /api/log/${logId}`);
  try {
    const log = await mongoDB.findOne(collections.SESSION_LOGS, logId);
    res.status(200).json({ log });
  } catch (err) {
    console.log("ERROR: sessionLogRouter GET/log/:logId:", err);
    res.status(500).json({ error: "Internal Server Error", log: {} });
  }
});

//get a list of all of a user's logs in a given time range
router.get("", async (req, res) => {
  console.log(`sessionLogRouter: GET /api/log/`);
  try {
    const logs = await mongoDB.find(collections.SESSION_LOGS);
    res.status(200).json({ logs });
  } catch (err) {
    console.log("ERROR: sessionLogRouter:", err);
    res.status(500).json({ error: "Internal Server Error", logs: [] });
  }
});

//delete a specific log
router.delete("/:logId", async (req, res) => {
  const logId = req.params.logId;
  console.log(`sessionLogRouter: DELETE /api/${logId}`);
  try {
    const result = await mongoDB.deleteOne(
      collections.SESSION_LOGS,
      req.params.logId,
    );
    res.status(204).json(result);
  } catch (error) {
    console.log("ERROR: sessionLogRouter DELETE: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//finalize a log (after a TIPP practice session)
router.patch("/:logId", async (req, res) => {
  const logId = req.params.logId;
  console.log(`sessionLogRouter: PATCH /api/${logId}`, req.body);
  try {
    const {
      distressLevel,
      emotion,
      tempTime,
      exerciseTime,
      breathingTime,
      relaxationTime,
    } = req.body;

    const recordAttributes = {
      emotionAfter: emotion,
      distressAfter: distressLevel,
      tempTime,
      exerciseTime,
      breathingTime,
      relaxationTime,
    };
    const result = await mongoDB.updateOne(collections.SESSION_LOGS, logId, {
      $set: recordAttributes,
    });
    console.log(result);
    if (result.modifiedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "no matching records found",
      });
    }
    return res.status(200).json({
      success: true,
      modified: result.modifiedCount,
    });
  } catch (err) {
    console.log("ERROR: sessionLogRouter PATCH: ", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;