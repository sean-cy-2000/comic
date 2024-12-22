// src/models/userModel.ts
import crypto from 'crypto';
import psql from '../db.js';
import { UserInterface, UserResponseInterface } from './interface/UserInterface';

export class User implements UserInterface {
    constructor(
        public name: string,
        public email: string,
        public user_id: number,
        public point: number = 100
    ) { }

    async unlockChapter(chapterId: number): Promise<boolean> {
        if (this.point < 3) return false;
        this.point -= 3;
        // TODO: 實作解鎖邏輯
        return true;
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
): Promise<UserResponseInterface> {
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
                user: new User(name, email, result.rows[0].user_id)
            };
        }
        return { success: false, message: '註冊失敗' };
    } catch (err: any) {
        if (err.code === '23505') {
            return { success: false, message: '此信箱已被註冊' };
        }
        throw err;
    }
}

export async function loginUser(
    email: string,
    password: string
): Promise<UserResponseInterface> {
    try {
        const result = await psql.query(
            'SELECT * FROM users WHERE email = $1 AND password = $2',
            [email, encryptPass(password)]
        );
        if (result.rows.length === 1) {
            return {
                success: true,
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