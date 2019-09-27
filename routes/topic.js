const Router = require('koa-router');
const router = new Router({prefix: '/topic'});
const topic = require('../app/controller/topics');
const {secret} = require('../config');
const jwt = require('koa-jwt');
const auth = jwt({secret});


router.get('/', topic.find);
router.post('/', auth, topic.create);
router.get('/:id',topic.checkTopicExist, topic.findById);
router.patch('/:id', topic.checkTopicExist, topic.update);
router.get('/:id/followers', topic.checkTopicExist, topic.listTopicsFollowers);
router.get('/:id/questions', topic.checkTopicExist, topic.listQuestion)

module.exports = router;
