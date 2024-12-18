import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

export const psql = new pg.Client({
    connectionString: process.env.DB,
    ssl: {
        rejectUnauthorized: true
    }
});

async function connectDB() {
    try {
        console.log('資料庫連線中...');
        await psql.connect();
        console.log('資料庫連線成功');
    }
    catch (err) { console.log(err); };

}

export default connectDB;
