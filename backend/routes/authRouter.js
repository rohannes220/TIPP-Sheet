import { Router } from "express";
import {connectDB} from "../db/mongoDB.js";
import crypto from "node:crypto"

const router = Router();

function generateJWT(userId) {
    const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString('base64url');
    const payload = Buffer.from(JSON.stringify({ userId: userId, iat: Date.now() })).toString('base64url');
    const signature = crypto.createHmac('sha256', process.env.JWT_SECRET)
                            .update(`${header}.${payload}`)
                            .digest('base64url');
    
    const jwt = `${header}.${payload}.${signature}`;
    return jwt;
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

        const token = generateJWT(username);

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

        await users.insertOne({username, firstName, password})

        const token = generateJWT(username);

        res.status(200).json({token});
    } catch(error) {
        res.status(500).json({"success": false, "message": "Internal server error"})
        console.error(error)
    }
})

// router.post("/delete", (req, res) => {
//     console.log("Delete request for: ", req.body);

//     try {
//         // check if jwt is valid

//         // delete user data from mongodb

//         // delete user from mongodb

//         // return success
//     }
// })

export default router;