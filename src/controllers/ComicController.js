// controllers/ComicController.js
import Comic from '../models/Comic.js';
import Chapter from '../models/Chapter.js';
import { psql } from '../db.js';

class ComicController {
    async getAllComics(ctx) {
        const result = await psql.query('SELECT * FROM comics');
        ctx.body = result.rows;
    }

    async getComic(ctx) {
        const { id } = ctx.params;
        const result = await psql.query('SELECT * FROM comics WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            ctx.throw(404, '漫畫不存在');
        }
        ctx.body = result.rows[0];
    }

    async getChapters(ctx) {
        const { id } = ctx.params;
        const result = await psql.query(
            'SELECT * FROM chapters WHERE comic_id = $1 ORDER BY chapter_number',
            [id]
        );
        ctx.body = result.rows;
    }

    async unlockChapter(ctx) {
        const { comicId, chapterId } = ctx.params;
        const userId = ctx.state.user.id; // 假設已經做了身份驗證

        const client = await psql.connect();
        try {
            await client.query('BEGIN');
            
            // 檢查用戶點數
            const userResult = await client.query(
                'SELECT points FROM users WHERE id = $1',
                [userId]
            );
            const userPoints = userResult.rows[0].points;
            
            // 檢查章節解鎖費用
            const chapterResult = await client.query(
                'SELECT points_cost FROM chapters WHERE id = $1',
                [chapterId]
            );
            const pointsCost = chapterResult.rows[0].points_cost;

            if (userPoints < pointsCost) {
                ctx.throw(400, '點數不足');
            }

            // 解鎖章節
            await client.query(
                'INSERT INTO unlocked_chapters (user_id, chapter_id) VALUES ($1, $2)',
                [userId, chapterId]
            );

            // 扣除點數
            await client.query(
                'UPDATE users SET points = points - $1 WHERE id = $2',
                [pointsCost, userId]
            );

            await client.query('COMMIT');
            ctx.body = { success: true };
        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }
    }

    async getChapterContent(ctx) {
        const { comicId, chapterId } = ctx.params;
        const userId = ctx.state.user.id;

        // 檢查是否已解鎖
        const unlocked = await psql.query(
            'SELECT 1 FROM unlocked_chapters WHERE user_id = $1 AND chapter_id = $2',
            [userId, chapterId]
        );

        if (unlocked.rows.length === 0) {
            ctx.throw(403, '尚未解鎖此章節');
        }

        const result = await psql.query(
            'SELECT content FROM chapters WHERE id = $1 AND comic_id = $2',
            [chapterId, comicId]
        );

        ctx.body = result.rows[0];
    }
}

export default ComicController;