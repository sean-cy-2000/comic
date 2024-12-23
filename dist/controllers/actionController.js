import { registerUser, loginUser } from '../models/userModel.js';
import express from 'express';
import dotenv from 'dotenv';
const router = express.Router();
export { router as actionRouter };
router.unlock = async function unlock(req, res) {
    try {
        const { chapterNumber_id } = req.body;
        const result = await loginUser(email, password);
        if (result.success) {
            jwt.sign({ user: result.user }, jwtkey, { expiresIn: '10m' }, (err, token) => {
                res.json({ user: result.user, token, success: true });
            });
        }
        else {
            console.log('登入失敗:\n', result);
            return res.status(400).json({ message: result.message, 登入失敗 });
        }
    }
    catch (err) {
        console.error(`
            錯誤碼: ${err.code}\n
            錯誤訊息: ${err.message}\n
            錯誤詳細: ${err.detail}\n
            `);
        res.status(500).json({ message: err.message });
    }
};
