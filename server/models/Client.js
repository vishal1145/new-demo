var mongoose = require('mongoose')

var ClientsSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    mobile_no: Number,
    telephone: Number,
    email: String,
    send_notifications_by: String,
    accepts_marketing_notifications: Boolean,
    address: String,
    suburb: String,
    city: String,
    state: String,
    zip_post_code: String,
    gender: String,
    referral_source: String,
    birthday: Date,
    client_notes: String,
    display_on_all_bookings: Boolean,
    company_id: {
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

mongoose.model('Clients', ClientsSchema)