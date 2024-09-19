const express = require("express");
const {
  addCustomOrder,
  getCustomOrders,
  approveCustomOrder,
  rejectCustomOrder,
  rescheduleCustomOrder,
  getMeeting,
} = require("../controllers/customOrderController");
const { adminGuard, authGuard } = require("../middelware/authMiddelware");

const router = express.Router();

router.post("/", addCustomOrder);
router.get("/", authGuard, adminGuard, getCustomOrders);
router.put("/approve/:id", authGuard, adminGuard, approveCustomOrder);
router.put("/reject/:id", authGuard, adminGuard, rejectCustomOrder);
router.put("/reschedule/:id", authGuard, adminGuard, rescheduleCustomOrder);
router.get("/meetings", authGuard, adminGuard, getMeeting);

module.exports = router;
