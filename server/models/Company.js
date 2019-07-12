var mongoose = require('mongoose')

var CompanySchema = new mongoose.Schema({
    company_name: String,
    company_logo: String,
    company_website: String,
    company_address: String,
    company_phone_primary: String,
    company_phone_secondary: String,
    company_email: String,
    company_about: String,
    company_image: String,
    company_services: [],
    created_at: {
        type: Date,
        default: new Date()
    },
    updated_at: {
        type: Date,
        default: new Date()
    }
})

mongoose.model('Company', CompanySchema)