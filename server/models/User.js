var mongoose = require('mongoose')

var UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    phone: Number,
    role: String,
    location: String,
    flat_no: String,
    landmark: String,
    city: String,
    consumption: [],
    user_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    created_at: {
        type: Date,
        default: new Date()
    },
    updated_at: {
        type: Date,
        default: new Date()
    }
})

mongoose.model('User', UserSchema)