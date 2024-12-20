import crypto from 'crypto';
import psql from '../db.js';
export class User {
    constructor(name, email, id) {
        this.name = name;
        this.email = email;
        this.point = 100;
        this.user_id = id;
    }
    unlockChapter(chapterNumber_id) {
        this.point -= 3;
        // 未完成
    }
}

function encryptPass(password) {
    try {
        const hash = crypto.createHash('sha256');
        hash.update(password);
        return hash.digest('base64');
    }
    catch (err) {
        console.error(err);
        throw err;
    }
}

/**
 * 註冊
 * @param {string} name 使用者名稱
 * @param {string} email 使用者信箱
 * @param {string} password 使用者密碼
 * @returns {Promise<{success: boolean, message: string, user: User}>}
 * user有user.name, user.email, user.user_id
 * @throws {Error}
 */
export async function registerUser(name, email, password) {
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
            const newUser = new User(name, email, result.rows[0].user_id);
            return {
                success: true,
                user: newUser
            };
        }
        return { success: false, message: '註冊失敗' };
    }
    catch (err) {
        if (err.code === '23505') { // 唯一約束違反
            console.log('此信箱已被註冊');
            return { success: false, message: '此信箱已被註冊' };
        }
        console.error(`${err.code}\n ${err.message}\n ${err.detail}`);
        throw err;
    }
}


/**
 * 登入
 * @param {string} email
 * @param {string} password - 輸入明文密碼
 * @returns {Promise<{success: boolean, message: string, user: User}>}
 * user={user.name, user.email, user.user_id}
 * @throws {Error}
 */
export async function loginUser(email, password) {
    try {
        const resulte = await psql.query(
            'select * from users where email = $1 and password = $2',
            [email, encryptPass(password)]);
        if (resulte.rows.length === 1) {
            const user = new User(resulte.rows[0].name, resulte.rows[0].email, resulte.rows[0].user_id);
            return {
                success: true,
                user: user
            };
        }
        if (resulte.rows.length > 1) { console.error('找到多個使用者'); }
        else {
            return { message: '找不到使用者', success: false };
        }
    } catch (err) {
        console.error(`${err.code}\n ${err.message}\n ${err.detail}`);
        throw err;
    }
}

