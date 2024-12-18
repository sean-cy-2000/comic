// models/Comic.js
import { psql } from '../db.js';

class Comic {
    constructor(data) {
        this.id = data.id;
        this.title = data.title;
        this.author = data.author;
        this.description = data.description;
        this.cover_url = data.cover_url;
    }

    static async findAll() {
        const result = await psql.query('SELECT * FROM comics ORDER BY title');
        return result.rows.map(row => new Comic(row));
    }

    static async findById(id) {
        const result = await psql.query(
            'SELECT * FROM comics WHERE id = $1',
            [id]
        );
        return result.rows[0] ? new Comic(result.rows[0]) : null;
    }

    async getChapters() {
        const result = await psql.query(
            'SELECT * FROM chapters WHERE comic_id = $1 ORDER BY chapter_number',
            [this.id]
        );
        return result.rows;
    }
}

export default Comic;