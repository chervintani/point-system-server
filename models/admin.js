const mongoose = require('mongoose')
const bcrypt = require("bcryptjs");

const Schema = mongoose.Schema

const adminSchema = new Schema({
    username: String,
    password: String
})
adminSchema.pre("save", function (next) {
this.password = bcrypt.hashSync(this.password, 10);
next();
});
const Admin = mongoose.model('admin',adminSchema,'admin');
module.exports = {Admin};