import { connectDB } from "./db.js";
import express from "express";
// 路由
import { userRouter } from "./controllers/userController.js";
const app = express();
app.use(express.json()); // 解析 -d 中的json
app.use(express.urlencoded({ extended: true })); // 解析 <form></form>
app.use('/user', userRouter);
(async () => {
    try {
        await connectDB();
        app.listen(3000, async () => {
            console.log('伺服器啟動中');
        });
    }
    catch (err) {
        console.error('伺服器啟動失敗', err);
    }
})();
