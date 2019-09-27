const User = require('../models/uers');
const jwt = require('jsonwebtoken');
const Question = require('../models/questions');
const Answer = require('../models/answer');
const {secret} = require('../../config');

class UserController {
    async checkOwner(ctx, next) {
        if (ctx.params.id !== ctx.state.user._id) {
            ctx.throw(403, '没有权限')
        }
        await next()
    }

    async find(ctx) {
        const { per_page = 10} = ctx.query;
        const perPage = Math.max(per_page * 1, 1);
        const page = Math.max(ctx.query.page * 1 - 1, 0);
        ctx.body = await User.find(
            {
                name: new RegExp(ctx.query.q)
            }
        ).limit(perPage).skip(page)
    }

    async findById(ctx) {
        const {fields = ''} = ctx.query;
        const selectFields = fields.split(';')
            .filter(f => f)
            .map(f => '+' + f)
            .join('');
        const populateStr = fields.split(';').filter(f => f).map(f => {
            if(f === 'employments') {
                return  'employments.company employments.job'
            }
            if(f === 'educations') {
                return 'educations.school educations.major'
            }
            return f
        }).join(' ');
        const user = await User.findById(ctx.params.id).select(selectFields).populate(populateStr);
        if (!user) {
            ctx.throw(404, '用户不存在')
        }
        ctx.body = user
    }

    async create(ctx) {
        ctx.verifyParams({
            name: {type: 'string', required: true},
            password: {type: 'string', required: true},

        });
        const {name} = ctx.request.body;
        const repeateUser = await User.findOne({name})
        if (repeateUser) ctx.throw(409, '用户已存在')
        const user = await new User(ctx.request.body).save()
        ctx.body = user
    }

    async update(ctx) {
        ctx.verifyParams({
            name: {type: 'string', required: false},
            password: {type: 'string', required: false},
            avatar_url: {type: 'string', required: false},
            gender: {type: 'string', required: false},
            headerLine: {type: 'string', required: false},
            locations: {type: 'array', itemType: 'string', required: false},
            business: {type: 'string', required: false},
            employments: {type: 'array', itemType: 'object', required: false},
            education: {type: 'array', itemType: 'object', required: false},
        });

        const user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body)
        if (!user) {
            ctx.throw(404)
        }
        ctx.body = user;
    }

    async delete(ctx) {
        const user = await User.findOneAndDelete(ctx.params.id);
        if (!user) {
            ctx.throw(404)
        }
        ctx.body = user;
    }

    async login(ctx) {
        ctx.verifyParams({
            name: {type: 'string', required: true},
            password: {type: 'string', required: true}
        });
        const user = await User.findOne(ctx.request.body)
        if (!user) ctx.throw(401, '用户名或密码不正确')
        const {_id, name} = user;
        const token = jwt.sign({
            _id, name
        }, secret, {expiresIn: '1d'});
        ctx.body = {token}
    }
    async checkUserExist(ctx, next) {
        const user = await User.findById(ctx.parmas.id)
        if(!user) ctx.throw(404, '用户不存在')
        await next()
    }

    async listFollowing(ctx) {

        const user = await User.findById(ctx.params.id).select('+following').populate('following')
        if (!user) {
            ctx.throw(404)
        }
        ctx.body = user.following;
    }

    async following(ctx) {
        const me = await User.findById(ctx.state.user._id).select('+following')
        if (!me.following.map(id => id.toString()).includes(ctx.params.id)){
            me.following.push(ctx.params.id)
            me.save()
        }
        ctx.status = 204
    }
    async unfollow(ctx) {
        const me = await User.findById(ctx.state.user._id).select('+following')
        const index = me.following.map(id => id.toString()).indexOf(ctx.params.id)
        if(index > -1) {
            me.following.splice(index, 1);
            me.save()
        }
        ctx.status = 204
    }
    async listFollower(ctx) {
        const users = await User.find({following: ctx.params.id})
        ctx.body = users;
    }
    async followTopic (ctx) {
        const me = await User.findById(ctx.state.user._id).select('+followingTopic')
        if (!me.followingTopic.map(id => id.toString()).includes(ctx.params.id)){
            me.followingTopic.push(ctx.params.id)
            me.save()
        }
        ctx.status = 204
    }
    async unfollowTopic(ctx) {
        const me = await User.findById(ctx.state.user._id).select('+followingTopic')
        console.log(me)
        const index = me.followingTopic.map(id => id.toString()).indexOf(ctx.params.id)
        if(index > -1) {
            me.followingTopic.splice(index, 1);
            me.save()
        }
        ctx.status = 204
    }

    async listFollowTopic(ctx) {
        const user = await User.findById(ctx.params.id).select('+followingTopic').populate('followingTopic')
        if (!user) {
            ctx.throw(404, '用户不存在')
        }
        ctx.body = user.followingTopic;
    }
    async listQuestion(ctx) {
        const questions = await Question.find({
            questioner: ctx.params.id
        });
        ctx.body = questions;
    }
    /* -----------  赞和踩 --------------  */
    async listLinkingAnswer(ctx) {
        const users = await User.findById(ctx.params.id).select('+linkingAnswers').populate('linkingAnswers')
        if(!user) ctx.throw(404, '用户不存在')
        ctx.body = users.likingAnswers
    }
    async linkingAnswer (ctx, next) {
        const me = await User.findById(ctx.state.user._id).select('+likingAnswers')
        if (!me.likingAnswers.map(id => id.toString()).includes(ctx.params.id)){
            me.likingAnswers.push(ctx.params.id)
            me.save()
            await Answer.findByIdAndUpdate(ctx.params.id, {$inc: {voteCount: 1}})
        }
        ctx.status = 204
        await next()
    }
    async unlinkingAnswer(ctx) {
        const me = await User.findById(ctx.state.user._id).select('+likingAnswers')
        console.log(me)
        const index = me.likingAnswers.map(id => id.toString()).indexOf(ctx.params.id)
        if(index > -1) {
            me.likingAnswers.splice(index, 1);
            me.save()
            await Answer.findByIdAndUpdate(ctx.params.id, {$inc: {voteCount: -1}})
        }
        ctx.status = 204
    }
    async dislistLinkingAnswer(ctx) {
        const users = await User.findById(ctx.params.id).select('+dislikingAnswers').populate('dislikingAnswers')
        if(!user) ctx.throw(404, '用户不存在')
        ctx.body = users.dislikingAnswers
    }
    async dislinkingAnswer (ctx, next) {
        const me = await User.findById(ctx.state.user._id).select('+dislikingAnswers')
        if (!me.dislikingAnswers.map(id => id.toString()).includes(ctx.params.id)){
            me.dislikingAnswers.push(ctx.params.id)
            me.save()
            await Answer.findByIdAndUpdate(ctx.params.id, {$inc: {voteCount: 1}})
        }
        ctx.status = 204
        await next()
    }
    async disunlinkingAnswer(ctx) {
        const me = await User.findById(ctx.state.user._id).select('+dislikingAnswers')
        const index = me.dislikingAnswers.map(id => id.toString()).indexOf(ctx.params.id)
        if(index > -1) {
            me.dislikingAnswers.splice(index, 1);
            me.save()
        }
        ctx.status = 204
    }
    async listCollectAnswer(ctx) {
        const users = await User.findById(ctx.params.id).select('+collectAnswer').populate('collectAnswer');
        if(!user) ctx.throw(404, '用户不存在')
        ctx.body = users.collectAnswer
    }
    async collectAnswer (ctx, next) {
        const me = await User.findById(ctx.state.user._id).select('+collectAnswer')
        if (!me.collectAnswer.map(id => id.toString()).includes(ctx.params.id)){
            me.collectAnswer.push(ctx.params.id)
            me.save()
            await Answer.findByIdAndUpdate(ctx.params.id, {$inc: {voteCount: 1}})
        }
        ctx.status = 204
        await next()
    }
    async unCollectAnswer(ctx) {
        const me = await User.findById(ctx.state.user._id).select('+collectAnswer')
        const index = me.collectAnswer.map(id => id.toString()).indexOf(ctx.params.id)
        if(index > -1) {
            me.collectAnswer.splice(index, 1);
            me.save()
        }
        ctx.status = 204
    }

}

module.exports = new UserController()
