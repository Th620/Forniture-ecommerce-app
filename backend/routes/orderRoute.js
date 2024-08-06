const express = require("express");
const { newOrder, editOrder, cancelOrder, getOrders, getOrder, confirmOrder } = require("../controllers/orderController");
const { authGuard, adminGuard } = require("../middelware/authMiddelware");

const router = express.Router();

router.get("/", authGuard, getOrders);
router.get("/:id", authGuard, getOrder);
router.post("/new", authGuard, newOrder);
router.put("/edit/:id", authGuard, editOrder);
router.put("/cancel/:id", authGuard, cancelOrder);
router.put("/confirm/:id", authGuard,adminGuard, confirmOrder);


module.exports = router;
