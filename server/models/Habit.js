const mongoose = require("mongoose");

const habitSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    color: {
      type: String,
      default: "#534AB7",
    },
    completedDates: [
      {
        type: String,
      },
    ],
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Habit", habitSchema);