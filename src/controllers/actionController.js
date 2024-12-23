import { registerUser, loginUser, User } from '../models/userModel.js';
import express from 'express';
import dotenv from 'dotenv';
import { after } from 'node:test';
import { afterLogin } from './userController.js';

const router = express.Router();
export { router as actionRouter };

router.post('/unlock/:chapter_id', afterLogin, async function unlock(req, res) {
    try {
        const { chapter_id } = req.params;
        const user = new User(
            req.user.name,
            req.user.email,
            req.user.user_id
        );
        const result = await user.unlockChapter(chapter_id);
        if (result) {
            res.json({ message: '解鎖成功', success: true });
        }
        else {
            res.json({ message: '解鎖失敗', success: false });
        }
    } catch (err) {
        console.error(`
            錯誤碼: ${err.code}\n
            錯誤訊息: ${err.message}\n
            錯誤詳細: ${err.detail}\n
            `);
        res.status(500).json({ message: err.message });
    }
});