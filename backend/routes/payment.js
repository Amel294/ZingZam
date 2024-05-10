const router = require("express").Router();
const { verifyPayment, createOrder } = require("../controllers/PaymentController");

router.post("/orders", createOrder);
router.post("/verify",verifyPayment);

module.exports = router;
