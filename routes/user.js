const Router = require('koa-router')
const jwt = require('koa-jwt')
const {secret} = require('../config')
const router = new Router({prefix: '/users'});
const User = require('../app/controller/user');
const topic = require('../app/controller/topics')
const Answer = require('../app/controller/answer')

const auth = jwt({secret})
router.get('/', User.find);
router.get('/:id', User.findById);
router.post('/create_user', User.create);
router.patch('/update_user:id', auth, User.checkOwner, User.update);
router.delete('/delete', auth, User.checkOwner, User.delete);
router.post('/login', User.login);
router.get('/:id/following', User.listFollowing);
router.put('/following/:id', auth, User.checkUserExist, User.following);
router.delete('/unfollow/:id', auth, User.checkUserExist, User.unfollow);
router.get('/listFollower/:id', User.listFollower);
router.get('/:id/followingTopics', User.listFollowTopic)
router.put('/followTopic/:id', auth, topic.checkTopicExist, User.followTopic);
router.delete('/unfollowTopic/:id', auth, topic.checkTopicExist, User.unfollowTopic);
router.get('/:id/listQuestions', User.listQuestion)

router.get('/:id/linkingAnswers', User.listLinkingAnswer);
router.put('/linkingAnswers/:id', auth, Answer.checkAnswerExist, User.linkingAnswer, User.dislinkingAnswer);
router.delete('/unfollow/:id', auth, Answer.checkAnswerExist, User.unlinkingAnswer);

router.get('/:id/dislinkingAnswers', User.dislistLinkingAnswer);
router.put('/linkingAnswers/:id', auth, Answer.checkAnswerExist, User.dislinkingAnswer, User.linkingAnswer);
router.delete('/unfollow/:id', auth, Answer.checkAnswerExist, User.disunlinkingAnswer);

router.get('/:id/collectAnswer', User.listCollectAnswer);
router.put('/collectAnswer/:id', auth, Answer.checkAnswerExist, User.collectAnswer);
router.delete('/uncollect/:id', auth, Answer.checkAnswerExist, User.unCollectAnswer)
module.exports = router;
