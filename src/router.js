import Router from '@koa/router';
import ComicController from './controllers/ComicController.js';
import UserController from './controllers/UserController.js';

const router = new Router();
const comicController = new ComicController();
const userController = new UserController();

// 用戶相關路由
router.post('/users/register', userController.register);
router.post('/users/login', userController.login);
router.get('/users/points', userController.getPoints);

// 漫畫相關路由
router.get('/comics', comicController.getAllComics);
router.get('/comics/:id', comicController.getComic);
router.get('/comics/:id/chapters', comicController.getChapters);
router.post('/comics/:comicId/chapters/:chapterId/unlock', comicController.unlockChapter);
router.get('/comics/:comicId/chapters/:chapterId', comicController.getChapterContent);

export default router;