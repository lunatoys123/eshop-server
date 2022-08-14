const mongoose = require("mongoose");

require("dotenv").config({ path: "../.env" });
const DB_URL = process.env.DB_URL

mongoose.connect(
  DB_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("User Connection successful");
  },
  (e) => {
    console.error(e);
  }
);

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  street: {
    type: String,
    default: "",
  },
  apartment: {
    type: String,
    default: "",
  },
  zip: {
    type: String,
    default: "",
  },
  city: {
    type: String,
    default: "",
  },
  country: {
    type: String,
    default: "",
  }
});

userSchema.virtual('id').get(function(){
    return this._id.toHexString();
})

userSchema.set('toJSON',{
    virtauls: true
})

const UserModel = mongoose.model('User', userSchema);
module.exports = UserModel