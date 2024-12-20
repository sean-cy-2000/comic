import { registerUser, loginUser } from '../models/userModel.js';
import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '../models/userModel.js';

dotenv.config();
const jwtkey = process.env.jwtkey;

const router = express.Router();
export { router as userRouter };

router.post('/register', async function register(req, res) {
    try {
        const { name, email, password } = req.body;
        const result = await registerUser(name, email, password);
        if (result.success) {
            res.json({
                message: result.message,
                user: result.user
            });

        }
        else {
            console.log('註冊失敗:\n', result);
            return res.status(400).json({ message: result.message });
        }
    } catch (err) {
        console.error(`
            錯誤碼: ${err.code}\n
            錯誤訊息: ${err.message}\n
            錯誤詳細:${err.detail}`);
        res.status(500).json({ message: err.message });
    }
});

router.post('/login', async function login(req, res) {
    try {
        const { email, password } = req.body;
        const result = await loginUser(email, password);
        if (result.success) {
            jwt.sign({ user: result.user },
                jwtkey,
                { expiresIn: '10m' },
                (err, token) => {
                    res.json({ user: result.user, token, success: true });
                });
        }
        else {
            console.log('登入失敗:\n', result);
            return res.status(400).json({ message: result.message, 登入失敗 });
        }
    } catch (err) {
        console.error(`
                錯誤碼: ${err.code}\n
                錯誤訊息: ${err.message}\n
                錯誤詳細:${err.detail}`);
        res.status(500).json({ message: err.message });
    }
});

/**
 * 登入確認中間件
 * @param {*} next - req.user
 */
export async function afterLogin(req, res, next) {
    const headers = req.headers;
    const token = headers['authorization'].split(' ')[1];
    if (!token) { return res.status(401).json({ message: '沒有token' }); }
    jwt.verify(token, jwtkey, (err, payload) => {
        if (err) {
            return res.status(401).json({ message: 'token錯誤' });
        }
        req.user = new User(payload.user.name, payload.user.email, payload.user.user_id);
        next();
    });
    // payload = {
    //     "user": {
    //         "name": "rutile",
    //         "email": "hoho@example.com",
    //         "point": 100,
    //         "user_id":id
    //     }
}

router.get('/tokenTest', afterLogin, (req, res) => {
    res.json({
        user: req.user,
        是否為類別型態: req.user instanceof User,
        success: true
    });
})