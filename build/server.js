"use strict";
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const connection = require("./connection");
const app = express();
connection();
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.listen(4000, () => {
    console.log("Server started at PORT 4000!");
});
