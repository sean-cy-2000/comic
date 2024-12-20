import psql from '../db.js';

export class Comic {
    constructor(name, type, author, cover, description) {
        this.name = name;
        this.type = type;
        this.author = author;
        this.cover = cover;
        this.description = description;
    }

    static async getAllComics_id() {
        try {
            const result = await psql.query('SELECT comic_id FROM comics');
            return result.rows;
        } catch (err) {
            console.error(`
                錯誤位置: comic.getAllComics_id \n
                錯誤碼: ${err.code}\n
                錯誤訊息: ${err.message}\n
                錯誤詳細: ${err.detail}\n
                `);
            throw err;
        }
    }

    static async getComic(comic_id) {
        try {
            const result = await psql.query(
                'SELECT * FROM comics WHERE comic_id = $1',
                [comic_id]
            );
            return new Comic(
                result.rows[0].name,
                result.rows[0].type,
                result.rows[0].author,
                result.rows[0].cover,
                result.rows[0].description
            );
        } catch (err) {
            console.error(`
                錯誤位置: comic.getComic \n
                錯誤碼: ${err.code}\n
                錯誤訊息: ${err.message}\n
                錯誤詳細: ${err.detail}\n
                `);
            throw err;
        }
    }
    static async getChapters(comic_id) {
        const result = await psql.query(
            'SELECT * FROM chapters WHERE comic_id = $1',
            [comic_id]
        );
        return result.rows;
    }
}

class chapter {
    constructor(chapterNumber, price = 3) {
        this.chapterNumber = chapterNumber;
        this.price = price
    }
}


