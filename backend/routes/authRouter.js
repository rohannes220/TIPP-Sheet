import { Router } from "express";
import {connectDB} from "../db/mongoDB.js";
import crypto from "node:crypto"

const router = Router();

function generateJWT(userId) {
    const nowInSeconds = Math.floor(Date.now() / 1000);
    const expiresAt = nowInSeconds + (60 * 60 * 24);

    const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString('base64url');
    const payload = Buffer.from(JSON.stringify({ userId: userId, iat: nowInSeconds, exp: expiresAt })).toString('base64url');
    const signature = crypto.createHmac('sha256', process.env.JWT_SECRET)
                            .update(`${header}.${payload}`)
                            .digest('base64url');
    
    const jwt = `${header}.${payload}.${signature}`;
    return jwt;
}

function verifyJWT(token) {
    try {
        const [headerB64, payloadB64, signature] = token.split('.');

        const expectedSignature = crypto.createHmac('sha256', process.env.JWT_SECRET)
            .update(`${headerB64}.${payloadB64}`)
            .digest('base64url');

        if (signature !== expectedSignature) return null;

        const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString());
        const nowInSeconds = Math.floor(Date.now() / 1000);

        if(payload.exp && nowInSeconds > payload.exp) {
            console.log("Token expired");
            return null;
        }

        return payload;
    } catch (e) {
        return null;
    }
}

router.post("/login", async (req, res) => {
    console.log("Login route reached: ", req.body);
    try {
        const { username, password } = req.body;
        const db = await connectDB();
        const users = db.collection('users');

        const user = await users.findOne({username})

        if(!user) {
            return res.status(400).json({"success": false, "message": "Incorrect details"})
        }

        if(user.password !== password) {
            return res.status(400).json({"success": false, "message": "Incorrect details"})
        }

        const token = generateJWT(user.userId);

        res.status(200).json({token});
    } catch(error) {
        res.status(500).json({"success": false, "message": "Internal server error"})
    }
})

router.post("/signup", async (req, res) => {
    console.log("Sign up route reached: ", req.body);

    try {
        const {username, firstName, password, passwordConfirm} = req.body;

        const db = await connectDB();
        const users = db.collection('users');

        const user = await users.findOne({username})

        if(user) {
            return res.status(400).json({"success": false, "message": "Username already exists"})
        }

        const lastUser = await users.find().sort({userId: -1}).limit(1).toArray();

        let newUserId = 1;
        if(lastUser.length > 0) {
            newUserId = lastUser[0].userId + 1;
        }

        await users.insertOne({userId: newUserId, username, first_name: firstName, password})

        const token = generateJWT(userId);

        res.status(200).json({token});
    } catch(error) {
        res.status(500).json({"success": false, "message": "Internal server error"})
        console.error(error)
    }
})

router.get("/me", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ "success": false, "message": "No token provided" });
        }

        const token = authHeader.split(' ')[1];
        const decoded = verifyJWT(token);

        if (!decoded) {
            return res.status(401).json({ "success": false, "message": "Invalid or expired token" });
        }

        const db = await connectDB();
        const users = db.collection('users');

        const user = await users.findOne(
            { userId: decoded.userId },
            { projection: { password: 0 } } 
        );

        if (!user) {
            return res.status(404).json({ "success": false, "message": "User not found" });
        }

        res.status(200).json({ "success": true, user });
    } catch (error) {
        console.error("Profile Fetch Error:", error);
        res.status(500).json({ "success": false, "message": "Internal server error" });
    }
});

router.delete("/delete", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.split(' ')[1];
        const decoded = verifyJWT(token);

        if (!decoded || !decoded.userId) {
            return res.status(401).json({ "success": false, "message": "Unauthorized" });
        }

        const db = await connectDB();
        
        const logResult = await db.collection('sessionLogs').deleteMany({ 
            userId: decoded.userId 
        });
        
        console.log(`Deleted ${logResult.deletedCount} session logs for user ${decoded.userId}`);

        const userResult = await db.collection('users').deleteOne({ 
            userId: decoded.userId 
        });

        if (userResult.deletedCount === 1) {
            res.status(200).json({ 
                "success": true, 
                "message": "Account and all session logs have been removed." 
            });
        } else {
            res.status(404).json({ "success": false, "message": "User not found" });
        }

    } catch (error) {
        console.error("Delete Error:", error);
        res.status(500).json({ "success": false, "message": "Internal server error" });
    }
});

export default router;