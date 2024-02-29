const mongoose = require('mongoose');
const { Schema } = mongoose;
const blogSchema = new Schema(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        photoPath: { type: String, require: true },
        author: { type: mongoose.SchemaTypes.ObjectId, ref: 'users' },


    },
    {
        timestamps: true
    }
)
// module.exports = blogSchema = mongoose.model('blogs', blogSchema);
module.exports = mongoose.model("Blog", blogSchema, "blogs")
//exported as Blog and can be imported as Blog on other modules
//collection name will be blogs