const Razorpay = require("razorpay");
const crypto = require("crypto");
const axios = require("axios");
const coinPacks = require("../static/coinPack");
const ZingCoinsModel = require("../models/ZingCoins");
const { default: mongoose } = require("mongoose");
exports.createOrder = async (req, res) => {
	try {
		const instance = new Razorpay({
			key_id: process.env.RAZORPAY_KEY_ID,
			key_secret: process.env.RAZORPAY_KEY_SECRET,
		});
        const {name,coins} = req.body
		const options = {
			amount: req.body.amount * 100,
			currency: "INR",
			receipt: crypto.randomBytes(10).toString("hex"),
		};
		instance.orders.create(options, (error, order) => {
			if (error) {
				console.log(error);
				return res.status(500).json({ message: "Something Went Wrong!" });
			}
            const packName = name.split(' ')
            order.name = `${packName[0]}-${coins} Coins`
			res.status(200).json({ data: order });
		});
	} catch (error) {
		res.status(500).json({ message: "Internal Server Error!" });
		console.log(error);
	}
};
exports.verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
		const userId = new mongoose.Types.ObjectId(req?.userData?.id);
        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        let newCoinBalance;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest("hex");
			if (razorpay_signature === expectedSign) {
            const response = await axios.get(`https://api.razorpay.com/v1/orders/${razorpay_order_id}`, {
                auth: {
                    username: process.env.RAZORPAY_KEY_ID,
                    password: process.env.RAZORPAY_KEY_SECRET
                }
            });
            const orderAmount = response.data.amount;
            const coinPack = coinPacks.find(pack => pack.price * 100 === orderAmount);
            if (coinPack) {
                const newPurchase = {
                    coinPackName: coinPack.name,
                    purchaseAmount: coinPack.price,
                    coins: coinPack.coins,
                    razorpayOrderId: razorpay_order_id
                };
                const existingCoinsData = await ZingCoinsModel.findOne({});
                if (!existingCoinsData) {
                    await ZingCoinsModel.create({
                        userId:userId,
                        coins: coinPack.coins,
                        purchases: [newPurchase]
                    });
                } else {	
					existingCoinsData.coins += coinPack.coins;
                    existingCoinsData.purchases.push(newPurchase);
                    await existingCoinsData.save();
                    newCoinBalance = existingCoinsData.coins;
                }
            } else {
                console.log("No matching coin pack found for the order amount:", orderAmount);
            }
            return res.status(200).json({ message: "Payment verified successfully",newCoinBalance });
        } else {
            return res.status(400).json({ message: "Invalid signature sent!" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error!" });
        console.log(error);
    }
};
exports.zingBalance = async (req,res)=>{
    try {
        const userId = new mongoose.Types.ObjectId(req?.userData?.id);
        const existingCoinsData = await ZingCoinsModel.findOne({userId:userId});
        if (!existingCoinsData) {
            return res.status(200).json({coinBalance:0});
        } else {
            return res.status(200).json({coinBalance:existingCoinsData.coins});
        }
        
    }catch{
        res.status(500).json({ message: "Internal Server Error!" });
        console.log(error);
    }
}