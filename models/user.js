const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
//user
const userSchema = new Schema({
  firstname: String,
  lastname: String,
  birthdate: String,
  phone_number: String,
  username: String,
  password: String,
  qr_code: new mongoose.Schema({ user_id: Object, username: String }),
  employee: new mongoose.Schema({ status: Boolean, establishment_id: Object }),
  establishments: [{ type: Schema.Types.ObjectId, ref: "Establishment" }],
  subscribed_stores: [
    {
      establishment: { type: Schema.Types.ObjectId, ref: "Establishment" },
      points: Number,
      date_subscribed: String,
      rewards: Array,
    },
  ],
  total_points: Number,
  feeds_activity: [
    {
      title: String, //Reward Redeemed, Earned 1 point, Subscribed to a store
      description: String,
      location: String,
      date: String,
    },
  ],
  profile_picture: String,
  status: String,
  updated_at: String,
  created_at: String,
});

//establishment
const establishmentSchema = new Schema({
  user_id: String,
  name: String,
  logo: String,
  website: String,
  details: new mongoose.Schema({
    contact_number: {
      telephone_number: String,
      mobile_number: String,
    },
    location: {
      street: String,
      barangay: String,
      city_town: String,
      province_state: String,
    },
  }),
  description: String,
  qr_code: {
    establishment_id: {
      type: String,
    },
    establishment_name: String,
  },
  coordinates: {
    latitude: Number,
    longitude: Number,
  },
  offers: [{ type: Schema.Types.ObjectId, ref: "Offer" }],
  promos: [{ type: Schema.Types.ObjectId, ref: "Promo" }],
  employees: [{ type: Schema.Types.ObjectId, ref: "User" }],
  daily_scanners: [
    new mongoose.Schema({
      date: String,
      statistics_date: Number,
      employee: [{
        user_id: String,
        time_in: String,
        time_out: String,
        processed: {
          price: Number,
          points: Number
        }
      }],
    }),
  ],
  subscribers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  status: String,
  lock_employees: Boolean,
  support_delivery: Boolean,
  updated_at: String,
  created_at: String,
});

//image
const imageSchema = new Schema({
  filename: String,
  originalName: String,
  desc: String,
  created: { type: Date, default: Date.now() },
});

//offer
const offerSchema = new Schema({
  user_id: {
    type: String,
    required: true
  },
  establishment_id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  points: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required:true
  },
  image: {
    type: String,
    required: true,
  },
  status: {
    type: String
  },
  date_created: String,
});

//promo
const promoSchema = new Schema({
  user_id: {
    type: String,
    required: true
  },
  establishment_id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  points: {
    type: Number,
    required: true,
  },
  expiry_date: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  status: {
    type: String
  },
  date_created: String,
});

//post
const postSchema = new Schema({
  establishment_id: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  likes: Array,
  date_created: String,
});

//daily scanners
const daily_scannersSchema = new Schema({
  date: String,
  employee: {
    user_id: String,
    time_in: String,
    time_out: String,
  },
});

//user_reward_obtained
const user_reward_obtainedSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  establishment_id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  promo_name: {
    type: String,
    required: true,
  },
  points: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

//delivery schema
const deliverySchema = new Schema({
  establishment_id: String,
  orders: [{ type: Schema.Types.ObjectId, ref: "Offer" }],
  customer_name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  phone_number: {
    type: String,
    required: true,
  },
  date_created: String
});


const notificationSchema = new Schema({
  user_id: String,
  image: String,
  description: String,
  date_created: String
})

const adminNotificationSchema = new Schema({
  image: String,
  request_type: String,
  description: String,
  datetime: String
})

userSchema.pre("save", function (next) {
  this.firstname = this.firstname.replace(
    /\b[a-z]|['_][a-z]|\B[A-Z]/g,
    function (x) {
      return x[0] === "'" || x[0] === "_"
        ? x
        : String.fromCharCode(x.charCodeAt(0) ^ 32);
    }
  );
  this.lastname = this.lastname.replace(/\b[a-z]|['_][a-z]|\B[A-Z]/g, function (
    x
  ) {
    return x[0] === "'" || x[0] === "_"
      ? x
      : String.fromCharCode(x.charCodeAt(0) ^ 32);
  });
  var currentDate = new Date();
  this.updated_at = currentDate;
  if (!this.created_at) this.created_at = currentDate;
  if (!this.profile_picture) this.profile_picture = "";
  if (!this.isModified("password")) {
    return next();
  }
  this.status = "Activated";
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

establishmentSchema.pre("save", function (next) {
  if(!this.subscribers) this.subscribers = [];
  if (!this.status) this.status = "Waiting";
  var currentDate = new Date();
  this.updated_at = currentDate;
  if (!this.created_at) this.created_at = currentDate;
  if (!this.lock_employees) this.lock_employees = false;
  next();
});

promoSchema.pre("save", function (next) {
  if (!this.status) this.status = "Waiting";
  var currentDate = new Date();
  if (!this.date_created) this.date_created = currentDate;
  next();
});
postSchema.pre("save", function (next) {
  var currentDate = new Date();
  if (!this.date_created) this.date_created = currentDate;
  next();
});
offerSchema.pre("save", function (next) {
  if (!this.status) this.status = "Waiting";
  var currentDate = new Date();
  if (!this.date_created) this.date_created = currentDate;
  next();
});
deliverySchema.pre("save", function (next) {
  var currentDate = new Date();
  if (!this.date_created) this.date_created = currentDate;
  next();
});
notificationSchema.pre("save", function (next) {
  var currentDate = new Date();
  if (!this.date_created) this.date_created = currentDate;
  next();
});
adminNotificationSchema.pre("save", function (next) {
  var currentDate = new Date();
  if (!this.datetime) this.datetime = currentDate;
  next();
});
const Establishment = mongoose.model(
  "Establishment",
  establishmentSchema,
  "establishment"
);
const User = mongoose.model("User", userSchema, "user");
const Image = mongoose.model("Image", imageSchema, "image");
const Offer = mongoose.model("Offer", offerSchema, "offer");
const Promo = mongoose.model("Promo", promoSchema, "promo");
const DailyScanners = mongoose.model(
  "DailyScanners",
  daily_scannersSchema,
  "daily_scanners"
);
const UserRewardObtained = mongoose.model(
  "UserRewardObtained",
  user_reward_obtainedSchema,
  "user_reward_obtained"
);
const Post = mongoose.model("Post", postSchema,"post");
const Delivery = mongoose.model("Delivery", deliverySchema,"delivery");
const Notification = mongoose.model("Notification", notificationSchema,"notification");
const AdminNotification = mongoose.model("AdminNotification", adminNotificationSchema,"admin_notification");
module.exports = {
  Establishment,
  User,
  Image,
  Offer,
  Promo,
  DailyScanners,
  UserRewardObtained,
  Post,
  Delivery,
  Notification,
  AdminNotification
};
