const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for your collection
const TokenSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    refreshToken: { type: String, required: true },
    expirationDate: { type: Date, default: Date.now, expireAfterSeconds: 86400 }
});

// Create a model using the schema
const TokenModel = mongoose.model('Token', TokenSchema);

module.exports = TokenModel;
