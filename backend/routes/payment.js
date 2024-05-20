const router = require("express").Router();
const { verifyPayment, createOrder,zingBalance } = require("../controllers/PaymentController");

router.post("/orders", createOrder);
router.post("/verify",verifyPayment);
router.get('/zinc-balance',zingBalance)
module.exports = router;
