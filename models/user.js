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
    new mongoose.Schema({
      establishment_id: String,
      points: Number,
    }),
  ],
  rewards: [
    new mongoose.Schema({
      user_id: {
        type: Schema.Types.ObjectId,
        required: true,
      },
      establishment_id: {
        type: Schema.Types.ObjectId,
        required: true,
      },
      promo_name: String,
      points: Number,
      image: String,
    }),
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
      city_town: String,
      province_state: String,
      zip: String,
      country: String,
    },
  }),
  description: String,
  files: Array,
  qr_code: new mongoose.Schema({
    establishment_id: {
      type: String,
      required: true,
    },
    establishment_name: String,
  }),
  news: [{ type: Schema.Types.ObjectId, ref: "News" }],
  posts: [{ type: Schema.Types.ObjectId, ref: "Promo" }],
  employees: [{ type: Schema.Types.ObjectId, ref: "User" }],
  daily_scanners: [{ type: Schema.Types.ObjectId, ref: "DailyScanners" }],
  status: String,
  updated_at: String,
  created_at: String,
});

//news
const newsSchema = new Schema({
  establishment_id: {
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
  establishment_id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  time_in: {
    type: String,
    required: true,
  },
  time_out: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "user",
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
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

establishmentSchema.pre("save", function (next) {
  if (!this.status) this.status = "Waiting";
  var currentDate = new Date();
  this.updated_at = currentDate;
  if (!this.created_at) this.created_at = currentDate;
  next();
});

promoSchema.pre("save", function (next) {
  var currentDate = new Date();
  if (!this.date_created) this.date_created = currentDate;
  next();
});
newsSchema.pre("save", function (next) {
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
const News = mongoose.model("News", newsSchema, "news");
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
module.exports = {
  Establishment,
  User,
  News,
  Promo,
  DailyScanners,
  UserRewardObtained,
};
