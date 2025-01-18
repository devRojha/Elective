const express = require("express");
const usersRouts = require("./users.js");

const router = express();

router.use("/users", usersRouts)

module.exports = router;