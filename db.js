// db.js

const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://admin:6mAfwN3riCWZxAkG@cluster0.5rx6crh.mongodb.net/users?retryWrites=true&w=majority&appName=Cluster0"
  )

  .then(() => {
    console.log("Connected to MongoDB");
  })

  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
  });
