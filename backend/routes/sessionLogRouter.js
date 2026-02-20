import express from "express";
import { mongoDB, collections } from "../db/mongoDB.js";
import { verifyJWT } from "../utils/jwtUtils.js";
import { ObjectId } from "mongodb";
const router = express.Router();

//create a new log, return the log id
router.post("", async (req, res) => {
  console.log("POST /api/log body: ", req.body);
  try {

    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];
    const decoded = verifyJWT(token);

    if (!decoded) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const authUserId = Number(decoded.userId);

    const { distressLevel, emotion } = req.body;

    const newSessionLog = {
      authUserId,
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
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];
    const decoded = verifyJWT(token);

    if (!decoded) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const currentUserId = Number(decoded.userId);
    const logId = Number(req.params.logId);

    const log = await mongoDB.findOne(collections.SESSION_LOGS, { 
      logId: logId 
    });

    if (!log) {
      return res.status(404).json({ success: false, message: "Log not found" });
    }

    if (log.userId !== currentUserId) {
      console.warn(`Unauthorized access attempt by user ${currentUserId} on log ${logId}`);
      return res.status(403).json({ 
        success: false, 
        message: "Forbidden: Access denied" 
      });
    }

    res.json({ success: true, log });
  } catch (err) {
    console.log("ERROR: sessionLogRouter GET/log/:logId:", err);
    res.status(500).json({ error: "Internal Server Error", log: {} });
  }
});

//get a list of all of a user's logs in a given time range
router.get("", async (req, res) => {
  console.log("received request for /api/log");

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyJWT(token);

    if (!decoded) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid or expired token" });
    }

    const userQuery = { userId: Number(decoded.userId) };

    const logs = await mongoDB.find(collections.SESSION_LOGS, userQuery);

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
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyJWT(token);

    if (!decoded) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid or expired token" });
    }

    const currentUserId = Number(decoded.userId);

    const log = await mongoDB.findOne(collections.SESSION_LOGS, {
      _id: new ObjectId(logId),
    });

    if (!log) {
      return res.status(404).json({ success: false, message: "Log not found" });
    }

    if (log.userId !== currentUserId) {
      console.warn(
        `Unauthorized delete try by user ${currentUserId} on log ${logId}`,
      );
      return res.status(403).json({
        success: false,
        message: "Forbidden: You do not own this log",
      });
    }

    const result = await mongoDB.deleteOne(collections.SESSION_LOGS, logId);

    res
      .status(200)
      .json({ success: true, message: `Log deleted successfully: ${result}` });
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
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("No token provided")
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyJWT(token);

    if (!decoded) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid or expired token" });
    }

    const currentUserId = Number(decoded.userId);

    const existingLog = await mongoDB.findOne(collections.SESSION_LOGS, {
      _id: new ObjectId(logId),
    });

    if (!existingLog) {
      return res.status(404).json({ success: false, message: "Log not found" });
    }

    if (existingLog.userId !== currentUserId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized log access",
      });
    }

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
    const result = await mongoDB.updateOne(
      collections.SESSION_LOGS,
      logId,
      recordAttributes,
    );

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
