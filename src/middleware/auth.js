// middlewares/auth.js
import jwt from 'jsonwebtoken';

export async function auth(ctx, next) {
    const token = ctx.headers.authorization?.split(' ')[1];
    
    if (!token) {
        ctx.throw(401, '未登入');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        ctx.state.user = { id: decoded.id };
        await next();
    } catch (e) {
        ctx.throw(401, '無效的token');
    }
}