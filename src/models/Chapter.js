// models/Chapter.js
import { psql } from '../db.js';

class Chapter {
    constructor(data) {
        this.id = data.id;
        this.comic_id = data.comic_id;
        this.chapter_number = data.chapter_number;
        this.content = data.content;
        this.points_cost = data.points_cost;
    }

    static async findById(id) {
        const result = await psql.query(
            'SELECT * FROM chapters WHERE id = $1',
            [id]
        );
        return result.rows[0] ? new Chapter(result.rows[0]) : null;
    }

    static async isUnlocked(userId, chapterId) {
        const result = await psql.query(
            'SELECT 1 FROM unlocked_chapters WHERE user_id = $1 AND chapter_id = $2',
            [userId, chapterId]
        );
        return result.rows.length > 0;
    }

    async unlock(userId) {
        const client = await psql.connect();
        try {
            await client.query('BEGIN');

            // 檢查是否已解鎖
            const unlockedResult = await client.query(
                'SELECT 1 FROM unlocked_chapters WHERE user_id = $1 AND chapter_id = $2',
                [userId, this.id]
            );

            if (unlockedResult.rows.length > 0) {
                await client.query('ROLLBACK');
                return true; // 已經解鎖過了
            }

            // 檢查使用者點數
            const userResult = await client.query(
                'SELECT points FROM users WHERE id = $1',
                [userId]
            );

            if (userResult.rows[0].points < this.points_cost) {
                await client.query('ROLLBACK');
                throw new Error('點數不足');
            }

            // 扣除點數並記錄解鎖
            await client.query(
                'UPDATE users SET points = points - $1 WHERE id = $2',
                [this.points_cost, userId]
            );

            await client.query(
                'INSERT INTO unlocked_chapters (user_id, chapter_id) VALUES ($1, $2)',
                [userId, this.id]
            );

            await client.query('COMMIT');
            return true;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }
}

export default Chapter;