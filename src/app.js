import koa from 'koa';
import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';
import router from './router.js';
import connectDB from './db.js';

const app = new koa();

app.use(cors());
app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

connectDB().then(() => {
    app.listen(3000, () => {
        console.log('Server running on port 3000');
    });
});