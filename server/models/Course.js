const mongoose = require('mongoose');

const ContentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    type: { type: String, enum: ['video', 'note', 'live'], required: true },
    url: { type: String, required: true }, // Video URL or File Path
    isFree: { type: Boolean, default: false }
});

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a course title']
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    category: {
        type: String,
        required: true,
        enum: ['GPAT', 'NIPER', 'Drug Inspector', 'Pharmacist', 'MPSC']
    },
    price: {
        type: Number,
        default: 0
    },
    thumbnail: {
        type: String,
        default: 'no-photo.jpg'
    },
    content: [ContentSchema], // Array of lectures/notes
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Course', CourseSchema);
