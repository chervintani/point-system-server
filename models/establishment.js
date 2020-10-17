const mongoose = require('mongoose')

const Schema = mongoose.Schema

const establishmentSchema = new Schema({
    name: String,
    logo: String,
    website: String,
    details: new mongoose.Schema({
        contact_number: {
            telephone_number: String,
            mobile_number: String
        },
        location: {
            street: String,
            city_town: String,
            province_state: String,
            zip: String,
            country: String
        }
    }),
    description: String,
    files: Array,
    qr_code : new mongoose.Schema({
        establishment_id: Object,
        establishment_name: String
    }),

    status: String
})

module.exports = mongoose.model('establishment',establishmentSchema,'establishment')