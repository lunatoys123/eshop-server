const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

router.get("/", orderController.getOrderList);
router.post("/", orderController.AddOrder);
router.get("/:id", orderController.getOrderById);
router.put("/:id", orderController.updateOrder);
router.delete("/:id", orderController.deleteOrder);
router.get("/get/totalSales", orderController.totalSales);
router.get("/get/Count", orderController.CountOrder);
router.get('/get/userorders/:userid', orderController.getUserOrder)

module.exports = router;
