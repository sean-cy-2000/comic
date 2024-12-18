// controllers/UserController.js
import { psql } from '../db.js';

class UserController {
    async register(ctx) {
        const { name, email, password } = ctx.request.body;

        try {
            const result = await psql.query(
                'INSERT INTO users (id, name, email, password) VALUES ($1, $2, $3, $4) RETURNING id, name, email, points',
                [crypto.randomUUID(), name, email, password] // 暫時存明文密碼
            );
            ctx.body = result.rows[0];
        } catch (e) {
            if (e.constraint === 'users_email_key') {
                ctx.throw(400, '信箱已被使用');
            }
            throw e;
        }
    }

    async login(ctx) {
        const { email, password } = ctx.request.body;
        
        const result = await psql.query(
            'SELECT * FROM users WHERE email = $1 AND password = $2',
            [email, password]
        );

        if (result.rows.length === 0) {
            ctx.throw(401, '信箱或密碼錯誤');
        }

        ctx.body = result.rows[0];
    }

    async getPoints(ctx) {
        const userId = ctx.state.user.id;
        
        const result = await psql.query(
            'SELECT points FROM users WHERE id = $1',
            [userId]
        );

        ctx.body = { points: result.rows[0].points };
    }
}

export default UserController;