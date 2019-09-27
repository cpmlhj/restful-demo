const Router = require('koa-router');
const router = new Router({prefix: '/question'});
const question = require('../app/controller/question');
const {secret} = require('../config');
const jwt = require('koa-jwt');
const auth = jwt({secret});


router.get('/', question.find);
router.post('/', auth, question.create);
router.get('/:id',question.checkQuestionExist, question.findById);
router.patch('/:id', question.checkQuestionExist, question.update);
router.delete('/:id', auth, question.checkQuestionExist, question.checkQuestioner, question.delete)

module.exports = router;
