var mongoose = require('mongoose')

var ServicegroupSchema = new mongoose.Schema({
    company_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    },
	orderno: {type: Number, default: 0},
    group_name: String,
    group_description: String,
    appointment_color: String,
    services: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service'
    }],
    created_at: {
        type: Date,
        default: new Date()
    },
    updated_at: {
        type: Date,
        default: new Date()
    }
})

mongoose.model('Servicegroup', ServicegroupSchema)