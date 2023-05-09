const mongoose = require("mongoose");
const formatDate = require("../utils/formatDate");

// taking the Schema class from the mongoose object
const { Schema } = mongoose;

const reactionSchema = new Schema(
  {
    reactionId: {
        // using the object data type
      type: Schema.Types.ObjectId,
      // setting a default value to a new ObjectId
      default: () => new mongoose.Types.ObjectId(),
    },

    reactionBody: {
      type: String,
      required: true,
      maxlength: 300,
    },

    username: {
      type: String,
      required: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
      // formatting the timestamp 
      get: (timestamp) => formatDate(timestamp),
    },
  },
  {
    toJSON: {
      getters: true,
    },
    id: false,
  }
);

const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: [true, "Thought is Required"], // error message if no thought added
      minlength: 1,
      maxlength: 300,
    },

    createdAt: {
      type: Date,
      default: Date.now,
      get: (timestamp) => formatDate(timestamp),
    },

    username: {
      type: String,
      required: true,
    },

    reactions: [reactionSchema], // array of nested documents with the reactionSchema 
  },
  {
    toJSON: {
      virtuals: true, // make virtual properties on toJson output
      getters: true, // make virtual getters on toJson output
    },
    id: false, // don't use the _id field in the output
  }
);

thoughtSchema.virtual("reactionCount").get(function () {
  return this.reactions.length;
});

// make the Thought model
const Thought = mongoose.model("Thought", thoughtSchema);

// exporting the Thought model to use in other files 
module.exports = Thought;

