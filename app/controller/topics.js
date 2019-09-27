const Topics = require('../models/topics');
const User = require('../models/uers');
const Question = require('../models/questions');
class TopicsController {
    async find(ctx) {
        const { per_page = 10} = ctx.query;
        const perPage = Math.max(per_page * 1, 1);
        const page = Math.max(ctx.query.page * 1 - 1, 0);
        ctx.body = await Topics.find({
            name: new RegExp(ctx.query.q)
        })
            .limit(perPage)
            .skip(page * perPage);
    }
    async checkTopicExist(ctx, next) {
        const topic = await Topics.findById(ctx.params.id);
        if(!topic) ctx.throw(404, '话题不存在')
        await next()
    }
    async findById(ctx) {
        const {fields = ''} = ctx.query;
        const selectFields = fields.split(';').filter(f => f).map(f => ' +' + f).join('')
        const topic = await Topics.findById(ctx.params.id).select(selectFields)
        ctx.body = topic
    }

    async create(ctx) {
        ctx.verifyParams({
            name: {type: 'string', required: true},
            avatar_url: {type: 'string', required: false},
            instruction: {type: 'string', required: false}
        });
        const topic = await new Topics(ctx.request.body).save()
        ctx.body = topic;
    }
    async update(ctx) {
        ctx.verifyParams({
            name: {type: 'string', required: false},
            avatar_url: {type: 'string', required: false},
            instruction: {type: 'string', required: false}
        });
        const topic = await Topics.findByIdAndUpdate(ctx.params.id, ctx.request.body)
        ctx.body = topic
    }
    async listTopicsFollowers(ctx) {
        const user = await User.find({followingTopic: ctx.params.id});
        console.log(user);
        ctx.body = user.followingTopic;
    }
    async listQuestion(ctx) {
      const question = Question.find({
          topics: ctx.params.id
      })
        ctx.body = question;
    }

}

module.exports = new TopicsController();
