const express = require("express");
const usersRouts = require("./users.js");
const resources = require("./resources.js")
const sendEmail = require("./email.js");

const router = express();

router.use("/users", usersRouts)
router.use("/data", resources)
router.use("/email", sendEmail)

module.exports = router;