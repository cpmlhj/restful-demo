const Question = require('../models/questions')
const User = require('../models/uers')

class QuestionCtl {
    async find(ctx) {
        const { per_page = 10} = ctx.query;
        const perPage = Math.max(per_page * 1, 1);
        const page = Math.max(ctx.query.page * 1 - 1, 0);
        const q = new RegExp(ctx.query.q)
        ctx.body = await Question.find({
           $or: [{title: q}, {description: q}]
        })
            .limit(perPage)
            .skip(page * perPage);
    }
    async checkQuestionExist(ctx, next) {
        const question = await Question.findById(ctx.params.id).select('+questioner');
        if(!question) ctx.throw(404, '问题不存在')
        ctx.state.question = question;
        await next()
    }
    async findById(ctx) {
        const {fields = ''} = ctx.query;
        const selectFields = fields.split(';').filter(f => f).map(f => ' +' + f).join('')
        const question = await Question.findById(ctx.params.id).select(selectFields).populate('questioner topics')
        ctx.body = question
    }

    async create(ctx) {
        ctx.verifyParams({
            description: {type: 'string', required: false},
            title: {type: 'string', required: true}
        });
        const question = await new Question({
            ...ctx.request.body,
            questioner: ctx.state.user._id
        }).save()
        ctx.body = question;
    }
    async checkQuestioner(ctx, next) {
        const {question} = ctx.state;
        if(question.questioner.toString() !== ctx.state.user._id) {
            ctx.throw(403, '没有权限')
        }
        await next()
    }
    async update(ctx) {
        ctx.verifyParams({
            description: {type: 'string', required: false},
            title: {type: 'string', required: false}
        });
        await ctx.state.question.update(ctx.request.body)
        ctx.body = ctx.state.question
    }
    async listTopicsFollowers(ctx) {
        const user = await User.find({followingTopic: ctx.params.id});
        console.log(user);
        ctx.body = user.followingTopic;
    }
    async delete(ctx) {
        await Question.findByIdAndRemove(ctx.params.id)
    }
}

module.exports = new QuestionCtl();
