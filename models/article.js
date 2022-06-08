const mongoose = require("mongoose");

const ArticleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    writer: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    createdAt: Date
})

ArticleSchema.virtual("articleId").get(function () {
    return this._id.toHexString();
});
ArticleSchema.set("toJSON",{
    virtuals:true,
});

module.exports = mongoose.model("Article", ArticleSchema);