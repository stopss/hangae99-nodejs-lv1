const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
    articleId: {
        type: String,
    },
    value: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
    }

});
CommentSchema.virtual("commentId").get(function () {
    return this._id.toHexString();
});
CommentSchema.set("toJSON", {
virtuals: true,
});
module.exports = mongoose.model("Comment", CommentSchema);