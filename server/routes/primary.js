const { Activity } = require("../models/userModel");

// Create Activity Log
async function createActivityLog(user_id, activity) {
  const response = await Activity.create({
    user_id,
    activity,
    created_at: currentDate(),
  });
}

function currentDate() {
  var date = new Date();
  var dateStr =
    date.getFullYear() +
    "-" +
    ("00" + (date.getMonth() + 1)).slice(-2) +
    "-" +
    ("00" + date.getDate()).slice(-2) +
    " " +
    ("00" + date.getHours()).slice(-2) +
    ":" +
    ("00" + date.getMinutes()).slice(-2) +
    ":" +
    ("00" + date.getSeconds()).slice(-2);
  return dateStr;
}

module.exports = { createActivityLog, currentDate };
