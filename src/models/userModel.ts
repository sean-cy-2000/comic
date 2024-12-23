import crypto from 'crypto';
import psql from '../db.js';

export class User {
    name: string;   // 有用interface就不需要寫這些
    email: string;
    point: number;
    user_id: number;
    constructor(nam: string, email: string, user_id: number, point: number = 100) {
        this.name = nam;
        this.email = email;
        this.user_id = user_id;
        this.point = point;
    }
    async unlockChapter(chapterId: string): Promise<boolean> {
        try {
            if (this.point < 3) return false;
            this.point -= 3;
            // TODO: 實作解鎖邏輯
            return true;
        } catch (err) {
            throw err;
        }
    }
}

function encryptPass(password: string): string {
    const hash = crypto.createHash('sha256');
    hash.update(password);
    return hash.digest('base64');
}

export async function registerUser(
    name: string,
    email: string,
    password: string
): Promise<{
    success: boolean,
    message: string,
    user?: User
}> {
    try {
        const checkEmail = await psql.query(
            'SELECT email FROM users WHERE email = $1',
            [email]
        );
        if (checkEmail.rows.length > 0) {
            return { success: false, message: '此信箱已被註冊' };
        }

        const result = await psql.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING user_id',
            [name, email, encryptPass(password)]
        );

        if (result.rowCount === 1) {
            return {
                success: true,
                message: '註冊成功',
                user: new User(name, email, result.rows[0].user_id)
            };
        }
        else return { success: false, message: '註冊失敗' };
    } catch (err) {
        throw err;
    }
}

export async function loginUser(
    email: string,
    password: string
): Promise<{
    success: boolean,
    message: string,
    user?: User
}> {
    try {
        const result = await psql.query(
            'SELECT * FROM users WHERE email = $1 AND password = $2',
            [email, encryptPass(password)]
        );
        if (result.rows.length === 1) {
            return {
                success: true,
                message: '登入成功',
                user: new User(
                    result.rows[0].name,
                    result.rows[0].email,
                    result.rows[0].user_id
                )
            };
        }
        if (result.rows.length > 1) {
            console.error('找到多個使用者');
        }
        return { success: false, message: '找不到使用者' };
    } catch (err) {
        throw err;
    }
}