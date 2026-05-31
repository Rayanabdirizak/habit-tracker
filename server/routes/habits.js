const express = require("express");
const router = express.Router();
const Habit = require("../models/Habit");
const auth = require("../middleware/auth");

router.use(auth);

// Get all habits
router.get("/", async (req, res) => {
  try {
    const habits = await Habit.find({ createdBy: req.user.userId }).sort("-createdAt");
    res.status(200).json({ habits });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a habit
router.post("/", async (req, res) => {
  try {
    const habit = await Habit.create({ ...req.body, createdBy: req.user.userId });
    res.status(201).json({ habit });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Toggle complete for today
router.patch("/:id/toggle", async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const habit = await Habit.findOne({ _id: req.params.id, createdBy: req.user.userId });
    if (!habit) return res.status(404).json({ message: "Habit not found" });

    const index = habit.completedDates.indexOf(today);
    if (index === -1) {
      habit.completedDates.push(today);
    } else {
      habit.completedDates.splice(index, 1);
    }

    await habit.save();
    res.status(200).json({ habit });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a habit
router.delete("/:id", async (req, res) => {
  try {
    const habit = await Habit.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.userId,
    });
    if (!habit) return res.status(404).json({ message: "Habit not found" });
    res.status(200).json({ message: "Habit deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;