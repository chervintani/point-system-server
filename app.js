const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const PORT = process.env.PORT || 3000;
const adminApi = require("./routes/admin-route");
const userApi = require("./routes/user-route");
const imageApi = require("./routes/image-upload");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Nexmo = require("nexmo");
const config = require("./config.json");
//socket
const http = require("http").Server(app);
const io = require("socket.io")(http);
const Model = require("./models/user");
// var corsOptions = {
//   origin: 'http://localhost:8080',
//   optionsSuccessStatus: 200 // 204
// }
io.on("connection", (socket) => {
  socket.on("disconnect", () => {
    io.emit("users-changed", { user: socket.username, event: "left" });
  });

  socket.on("new-delivery", async (customer_delivery) => {
    let delivery = new Model.Delivery(JSON.parse(customer_delivery))
    let delivery_id = await delivery.save();
    let result = await Model.Delivery.findById(delivery_id._id).populate("orders").exec();
    io.emit("delivery-notification", result);
  });

  socket.on("new-notification", async (notification) => {
    io.emit("user-notification", notification);
    let user_notif = new Model.Notification(JSON.parse(notification))
    await user_notif.save();
  });

  socket.on("request-notification", async (notification) => {
    io.emit("admin-notification", notification);
    let user_notif = new Model.Notification(JSON.parse(notification))
    await user_notif.save();
  });

});

const nexmo = new Nexmo({
  apiKey: config.nexmo_config.apiKey,
  apiSecret: config.nexmo_config.apiSecret,
});
app.use(bodyParser.json());
app.use(cors());
app.use("/api", adminApi);
app.use("/api", userApi);
app.use("/api", imageApi);
app.use("/uploads", express.static(path.join(__dirname + "/uploads")));

app.get("/", (req, res) => {
  // console.log(config.nexmo_config.apiKey);
  res.send("we are live!");
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

http.listen(PORT, function () {
  console.log("Server running on localhost: " + PORT);
});
