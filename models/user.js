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
      rewards: [{ type: Schema.Types.ObjectId, ref: "Promo" }],
    },
  ],
  // rewards: [
  //   new mongoose.Schema({
  //     user_id: {
  //       type: Schema.Types.ObjectId,
  //       required: true,
  //     },
  //     establishment_id: {
  //       type: Schema.Types.ObjectId,
  //       required: true,
  //     },
  //     promo_name: String,
  //     points: Number,
  //     image: String,
  //   }),
  // ],
  total_points: Number,
  feeds_activity: [
    {
      title: String, //Reward Redeemed, Earned 1 point, Subscribed to a store
      description: String,
      location: String,
      date: String,
    },
  ],
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
      employee: [{
        user_id: String,
        time_in: String,
        time_out: String,
      }],
    }),
  ],
  subscribers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  status: String,
  lock_employees: Boolean,
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
  collection_id: {
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
  // establishment_id: {
  //   type: Schema.Types.ObjectId,
  //   required: true,
  // },
  // date: {
  //   type: String,
  //   required: true,
  // },
  // time_in: {
  //   type: String,
  //   required: true,
  // },
  // time_out: {
  //   type: String,
  //   required: true,
  // },
  // user: {
  //   type: Schema.Types.ObjectId,
  //   required: true,
  //   ref: "user",
  // },
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
  this.lock_employees = false;
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
module.exports = {
  Establishment,
  User,
  Image,
  Offer,
  Promo,
  DailyScanners,
  UserRewardObtained,
  Post
};
