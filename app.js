const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const PORT = 5000;
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
const io = require("socket.io")(3030);
const Model = require("./models/user");
var corsOptions = {
  origin: 'https://premyo-f9a96.web.app',
  optionsSuccessStatus: 200 // 204
}
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
    let admin_notif = new Model.AdminNotification(JSON.parse(notification))
    await admin_notif.save();
  });

});

app.use(bodyParser.json({limit: "50mb"}));
app.use(cors());
app.use("/api", adminApi);
app.use("/api", userApi);
app.use("/api", imageApi);
app.use("/uploads", express.static(path.join(__dirname + "/uploads")));
app.use("/apk", express.static(path.join(__dirname + "/apk")));

app.get("/", (req, res) => {
  res.send("we are live v3!");
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

http.listen(PORT, function () {
  console.log("Server running on localhost: " + PORT);
});
