const { getDataFromJWTCookie_id } = require("../helpers/dataFromJwtCookies");
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const UserModel = require("../models/UserModel");
const ConnectionsModel = require("../models/ConnectionsModel");
const { ObjectId } = require('mongoose').Types;

exports.getSuggestions = async (req, res) => {
    try {
        const jwtToken = req?.cookies?.accessToken;
        const id = new ObjectId(getDataFromJWTCookie_id(res, jwtToken))
        console.log(id);
        const suggestions = await UserModel.aggregate([
            { $match: { _id: { $ne: id } } },
            {
                $lookup: {
                    from: "connections",
                    localField: "_id",
                    foreignField: "user",
                    as: "connections",
                }
            },
            { $unwind: { path: "$connections", preserveNullAndEmptyArrays: true } },
            {
                $match: {
                    "connections.friends": { $ne: id }
                }
            },
            {
                $group: {
                    _id: "$_id",
                    name: { $first: "$name" },
                    username: { $first: "$username" },
                    picture: { $first: "$picture" },
                }
            },
            { $match: { _id: { $ne: id } } }
        ]);

        res.status(200).json({ suggestions });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

exports.addFriend = async (req, res) => {

}