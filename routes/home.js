const Router = require('koa-router')
const router = new Router();
const homeCtrl = require('../app/controller/home')
router.get('/', homeCtrl.index);
router.post('/upload', homeCtrl.upload)

module.exports = router
