var mongoose = require('mongoose')

var ServiceSchema = new mongoose.Schema({
    service_name: String,
    treatment_type: String,

    pricing: [{
        duration: String,
        retail_price: String,
        pricing_name: String,
        special_price: String
    }],
    service_order: {type: Number, default: 0},
    //staff: [],
    staff: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Staff'
    }],
    online_booking: Boolean,
    service_description: String,
    selected_service: String,
    created_at: {
        type: Date,
        default: new Date()
    },
    updated_at: {
        type: Date,
        default: new Date()
    }
})

mongoose.model('Service', ServiceSchema)