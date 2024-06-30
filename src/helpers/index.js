const mongoose = require("mongoose");

async function isValidObjectId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}

module.exports = {
    isValidObjectId,
};
