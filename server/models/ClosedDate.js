var mongoose = require('mongoose')

var ClosedDateSchema = new mongoose.Schema({
    company_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    },
    start_date: String,
    end_date: String,
    description: String,
    created_at: {
        type: Date,
        default: new Date()
    },
    updated_at: {
        type: Date,
        default: new Date()
    }
})

mongoose.model('ClosedDate', ClosedDateSchema)