const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");

router.post("/", UserController.AddUser);
router.get("/", UserController.getUserList);
router.get("/:id", UserController.geUserById);
router.post("/login", UserController.Login);
router.get("/get/count", UserController.getUserCount);
router.delete("/:id", UserController.deleteUser);

module.exports = router;
