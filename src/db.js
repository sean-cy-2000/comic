import express from 'express';
import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();


const psql = new pg.Pool({
    connectionString: process.env.DB,
    ssl: {
        rejectUnauthorized: true
    }
});

export async function connectDB() {
    try {
        console.log('資料庫連線中');
        await psql.connect();
        console.log('資料庫連線成功');
    } catch (err) {
        console.error('資料庫連線失敗', err);
    }
}

export default psql;