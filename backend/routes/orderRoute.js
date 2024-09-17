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
  getUserOrders,
  deleteOrder,
  setShippingDate,
  getCartTotalPrice,
  getEarnings,
} = require("../controllers/orderController");
const { authGuard, adminGuard } = require("../middelware/authMiddelware");

const router = express.Router();

router.get("/", authGuard, adminGuard, getOrders);
router.get("/user", authGuard, getUserOrders);
router.get("/:id", authGuard, getOrder);
router.post("/new", authGuard, newOrder);
router.put("/edit/:id", authGuard, editOrder);
router.put("/cancel/:id", authGuard, cancelOrder);
router.put("/confirm/:id", authGuard, adminGuard, confirmOrder);
router.delete("/delete/:id", authGuard, adminGuard, deleteOrder);
router.put("/delivery/:id", authGuard, adminGuard, markOrderAsDelivered);
router.put("/shippingDate/:id", authGuard, adminGuard, setShippingDate);
router.get(
  "/dashboard/info",
  authGuard,
  adminGuard,
  getSoldProductNumberAndProfits
);
router.get("/dashboard/earnings", authGuard, adminGuard, getEarnings);
router.post("/cart", getCartTotalPrice);

module.exports = router;
