const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const PORT = process.env.PORT||3000;
const adminApi = require("./routes/admin-route");
const userApi = require("./routes/user-route");
const app = express();
const mongoose = require("mongoose");
const Nexmo = require("nexmo");
const config = require("./config.json");

// var corsOptions = {
//   origin: 'http://localhost:8080',
//   optionsSuccessStatus: 200 // 204
// }
app.use(bodyParser.json());
app.use(cors());
app.use("/api", adminApi);
app.use("/api", userApi);

app.get("/", (req, res) => {
  // console.log(config.nexmo_config.apiKey);
  res.send("we are live!")
});

mongoose.connect(
  config.DB,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  },
  (err, data) => {
    if (err) {
      console.log("error : " + err);
    } else {
      console.log("Database is connected!");
    }
  }
);

// const nexmo = new Nexmo({
//   apiKey: config.nexmo_config.apiKey,
//   apiSecret: config.nexmo_config.apiSecret,
// });

// const from = "REWARDSHUB";
// const to = "639304030197";
// const text =
//   "REWARDSHUB:\nYour verification code is 561564. Expires in 5 minutes.";

// nexmo.message.sendSms(from, to, text,(err,response)=>{
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(JSON.stringify(response, null, 2));
//   }
// });

app.listen(PORT, '0.0.0.0' ,function () {
  console.log("Server running on localhost: " + PORT);
});
