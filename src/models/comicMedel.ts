import psql from '../db.js';

export class Comic {
    name: string;
    type: string;
    author: string;
    cover: string;
    description: string;
    constructor(name: string, type: string, author: string, cover: string, description: string) {
        this.name = name;
        this.type = type;
        this.author = author;
        this.cover = cover;
        this.description = description;
    }


    /**
     * 取得所有漫畫的 id 和name
     */
    static async getAllComics_id_name(): Promise<{ comic_id: string }[]> {
        try {
            const result = await psql.query('SELECT comic_id and name FROM comics');
            return result.rows;
        } catch (err: any) {
            throw err;
        }
    }

    /**
     * 獲取某部漫畫的資料
     * @param comic_id 
     * @returns 
     */
    static async getComic(comic_id: string): Promise<Comic> {
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
        } catch (err: any) {
            throw err;
        }
    }
    static async getChapters(comic_id: string) {
        const result = await psql.query(
            'SELECT * FROM chapters WHERE comic_id = $1',
            [comic_id]
        );
        return result.rows;
    }
}

export class chapter {
    chpater_id: string;
    comic_id: string;
    chapterNumber: number;
    price: number

    constructor(
        chpater_id: string, comic_id: string,
        chapterNumber: number, price: number = 3) {
        this.chapterNumber = chapterNumber;
        this.price = price
        this.chpater_id = chpater_id;
        this.comic_id = comic_id;
    }
}


