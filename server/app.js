const express = require("express");
const { Sequelize } = require("sequelize");
const usersRouter = require("./routes/users");
const postsRouter = require("./routes/posts");
const authRouter = require("./auth");
const activityRouter = require("./routes/activity");
const cors = require("cors");

const app = express();
// app.use(cors({ origin: true }));
// Enable CORS
app.use(cors({ origin: "*" }));

// Body parser middleware
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Mount routes
app.use("/users", usersRouter);
app.use("/auth", authRouter);
app.use("/posts", postsRouter);
app.use("/activity", activityRouter);

app.listen(1201, () => {
  console.log("Server listening on port 1201");
});
