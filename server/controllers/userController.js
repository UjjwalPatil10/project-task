// controllers/userController.js
const User = require("../models/user");

module.exports = {
  registerUser: async (req, res) => {
    try {
      const { username } = req.body;
      const registration = new Date().toISOString();
      const user = new User({ username, registration });
      await user.save();
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ message: "Error registering user.", error });
    }
  },

  getUsers: async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: "Error fetching users.", error });
    }
  },

  getUserTasks: async (req, res) => {
    try {
      const { username } = req.params;
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
      res.status(200).json(user.tasks);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user tasks.", error });
    }
  },

  addTask: async (req, res) => {
    try {
      const { username } = req.params;
      const { taskName, taskDescription, formDateTime } = req.body;
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      const formNumber = generateFormNumber();
      user.tasks.push({ formNumber, taskName, taskDescription, formDateTime });
      await user.save();
      res.status(201).json(user.tasks);
    } catch (error) {
      res.status(500).json({ message: "Error adding task.", error });
    }
  },

  deleteTask: async (req, res) => {
    try {
      const { username, formNumber } = req.params;
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      user.tasks = user.tasks.filter((task) => task.formNumber !== formNumber);
      await user.save();
      res.status(200).json(user.tasks);
    } catch (error) {
      res.status(500).json({ message: "Error deleting task.", error });
    }
  },
};

function generateFormNumber() {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  // You may need to implement logic to handle concurrency and increment the form number.
  const formNumber = `${day}${month}${year}_01`;
  return formNumber;
}
