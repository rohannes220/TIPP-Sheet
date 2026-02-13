import express from "express";
import tippDB from "../db/mongoDB.js";

const router = express.Router();

router.get("/log", async (req, res) => {
  console.log("received request for /api/log");

  try {
    const logs = await tippDB.getSessionLogs();
    res.json({ logs });
  } catch (err) {
    console.log("ERROR: sessionLogRouter:", err);
    res.status(500).json({ error: "Internal Server Error", logs: [] });
  }
});

export default router;
