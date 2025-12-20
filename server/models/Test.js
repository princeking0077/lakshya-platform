const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    questionText: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctOption: { type: Number, required: true },
    marks: { type: Number, default: 4 }
});

const TestSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a test title']
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        default: null
    },
    duration: {
        type: Number, // in minutes
        required: true,
        default: 180
    },
    negativeMarks: {
        type: Number,
        default: 1, // Default -1 for wrong answer
        min: 0
    },
    totalMarks: {
        type: Number,
        default: 0
    },
    questions: [QuestionSchema],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Test', TestSchema);
