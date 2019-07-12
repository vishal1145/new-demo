var mongoose = require('mongoose')

var UserSchema = new mongoose.Schema({
    email: String,
    password: String,
    phone: Number,
    role: String,
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