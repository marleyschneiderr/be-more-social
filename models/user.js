const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      trim: true,
      required: "Username required",
      // minimum length for username
      minlength: 5,
      // maximum length for username 
      maxlength: 20,
    },

    email: {
      type: String,
      unique: true,
      required: "Email required",
      // validating email with REGEX!!
      match: [/.+@.+\..+/],
    },

    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Thought",
      },
    ],

    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    toJSON: {
        // virtual properties in JSON output
      virtuals: true,
        // use getters to apply formatting to properties 
      getters: true,
    },
    id: false,
  }
);

// get the count of a user's friends with virtual property 
UserSchema.virtual("friendCount").get(function () {
  return this.friends.length;
});

const User = model("User", UserSchema);

module.exports = User;
