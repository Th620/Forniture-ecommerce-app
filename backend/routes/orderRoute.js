const express = require("express");
const {
  newOrder,
  editOrder,
  cancelOrder,
  getOrders,
  getOrder,
  confirmOrder,
  markOrderAsDelivered,
  getSoldProductNumberAndProfits,
} = require("../controllers/orderController");
const { authGuard, adminGuard } = require("../middelware/authMiddelware");

const router = express.Router();

router.get("/", authGuard, adminGuard, getOrders);
router.get("/:id", authGuard, getOrder);
router.post("/new", authGuard, newOrder);
router.put("/edit/:id", authGuard, editOrder);
router.put("/cancel/:id", authGuard, cancelOrder);
router.put("/confirm/:id", authGuard, adminGuard, confirmOrder);
router.put("/delivery/:id", authGuard, adminGuard, markOrderAsDelivered);
router.get("/products", authGuard, adminGuard, getSoldProductNumberAndProfits);

module.exports = router;
