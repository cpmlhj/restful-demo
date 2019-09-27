const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const UserSchema = new Schema({
    name: {type: String, required: true},
    age: {type: Number, required: false, default: 0},
    __v: {type: Number, select: false},
    password: {type: String, required: true, select: false},
    avatar_url: {type: String},
    gender: {type: String, enum: ['male', 'female'], default: 'male', required: true},
    headerLine: {type: String},
    locations: {type: [{type: Schema.Types.ObjectId, ref: 'Topic'}], select: false},
    business: {type: Schema.Types.ObjectId, ref: 'Topic'},
    employments: {
        type: [{
            company: {type: Schema.Types.ObjectId, ref: 'Topic'},
            job: {type: Schema.Types.ObjectId, ref: 'Topic'}
        }],
        select: false
    },
    educations: {
        type: [{
            school: {type: Schema.Types.ObjectId, ref: 'Topic'},
            major: {type: Schema.Types.ObjectId, ref: 'Topic'},
            diploma: {type: Number, enum: [1, 2, 3, 4, 5]},
            entrance_year: {type: Number},
            graduation_year: {type: Number}
        }],
        select: false
    },
    following: {
        type: [
            {
                type: Schema.Types.ObjectId, ref: 'User'
            }
        ],
        select: false
    },
    followingTopic: {
        type: [
            {
                type: Schema.Types.ObjectId, ref: 'Topic'
            }
        ]
    },
    likingAnswers: {
        type: [
            {
                type: Schema.Types.ObjectId, ref: 'Answer'
            }
        ],
        select: false
    },
    dislikingAnswers: {
        type: [
            {
                type: Schema.Types.ObjectId, ref: 'Answer'
            }
        ],
        select: false
    },
    collectAnswer: {
        type: [
            {
                type: Schema.Types.ObjectId, ref: 'Answer'
            }
        ],
        select: false
    }

});

module.exports = model('User', UserSchema);
