const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const AnswerSchema = new Schema({
    _v: {type: Number, select: false},
    content: {type: String, required: true},
    description: {type: String},
    answerer: {type: Schema.Types.ObjectId, ref: 'User', select: false},
    questionId: {type: String, required: true},
    voteCount: {type: Number, required: true, default: 0}
});

module.exports = model('Answer', AnswerSchema);
