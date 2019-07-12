var mongoose = require('mongoose')

var StaffSchema = new mongoose.Schema({
    company_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    },
    first_name: String,
    last_name: String,
    mobile_no: String,
    email: String,
    user_permission: String,
    appointment_color: String,
    online_appointment: Boolean,
    staff_title: String,
    notes: String,
    employment_start_date: String,
    employment_end_date: String,

    services_id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service'
    }],
    staff_working: [{
        date: String,
        end_date: String,
        days: String,
        removedFroms: [],
        removeDates: [],

        shift_timing: [{
            start: String,
            end: String,

        }],
        closed: Boolean,
        repeat: String,
        ongoing: Boolean,
        specific_date: String,

    }],
    service_commission: String,
    product_commission: String,
    sales_commission: String,
    created_at: {
        type: Date,
        default: new Date()
    },
    updated_at: {
        type: Date,
        default: new Date()
    }
})
mongoose.model('Staff', StaffSchema)