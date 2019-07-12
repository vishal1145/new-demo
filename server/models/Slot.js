var mongoose = require('mongoose')

var SlotSchema = new mongoose.Schema({
    slot: String,
    owner_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    company_name: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    },
    start_date: {
        type: Date,
        default: new Date()
    },
    end_date: {
        type: Date,
        default: new Date()
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

mongoose.model('Slot', SlotSchema)