// routes/users.js
const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");

router.post("/register", UserController.registerUser);
router.get("/users", UserController.getUsers);
router.get("/users/:username/tasks", UserController.getUserTasks);
router.post("/users/:username/tasks", UserController.addTask);
router.delete("/users/:username/tasks/:formNumber", UserController.deleteTask);

module.exports = router;
// http://localhost:8080/api/register
// http://localhost:8080/api/users
