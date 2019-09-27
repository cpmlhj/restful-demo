const Router = require('koa-router');
const router = new Router({prefix: '/question/:questionId/answer'});
const answer = require('../app/controller/answer');
const {secret} = require('../config');
const jwt = require('koa-jwt');
const auth = jwt({secret});


router.get('/', answer.find);
router.post('/', auth, answer.create);
router.get('/:id',answer.checkAnswerExist, answer.findById);
router.patch('/:id', answer.checkAnswerExist, answer.update);
router.delete('/:id', auth, answer.checkAnswerExist, answer.checkAnswerer, answer.delete)

module.exports = router;
