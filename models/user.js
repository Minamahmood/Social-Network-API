const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(v) {
                return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v);
            },
            message: (props) => `${props.value} is not a valid email!`,
        },
    },
    thoughts: [{
        type: Schema.Types.ObjectId,
        ref: "Thoughts",
    }, ],
    friends: [{
        type: Schema.Types.ObjectId,
        ref: "User",
    }, ],
}, {
    toJSON: {
        virtuals: true,
    },
});

UserSchema.virtual("friendCount").get(function() {
    return this.friends.length;
});

const User = model("User", UserSchema);

module.exports = User;