// choosing to excluding the __v field from all returned code = making returned documents 'lightweight'/ prevents exposing info
const { thought, user } = require("../models");

const thoughtController = {
  // GET all thoughts to load when api pathway is defined
  async getAllThought(req, res) {
    try {
      // find  all thoughts
      const dbThoughtInfo = await thought
        .find({})
        // populate the reactions field of each thought with its associated reactions, excluding __v field from popping up
        .populate({
          path: "reactions",
          select: "-__v",
        })
        // exclude the __v field from the returned document
        .select("-__v")
        // sort related info in descending order by the _id field
        .sort({ _id: -1 });
      // send the resulting JSON back to the client
      res.json(dbThoughtInfo);
    } catch (err) {
      // log any errors and send a 400 status code back
      console.log(err);
      res.sendStatus(400);
    }
  },

  // GET ONE thought to load when api pathway is defined
  async getOneThought({ params }, res) {
    try {
      // find the thought by ID
      const dbThoughtInfo = await thought
        .findOne({ _id: params.id })
        // populate the reactions field of the thought with its associated reactions, excluding __v field from popping up
        .populate({
          path: "reactions",
          select: "-__v",
        })
        // exclude the __v field from the returned document
        .select("-__v");
      if (!dbThoughtInfo) {
        // if the thought is not found, return a 404 status code with a message
        return res
          .status(404)
          .json({ message: "There are NO thoughts related to this id!" });
      }
      // send the resulting JSON back to the client
      res.json(dbThoughtInfo);
    } catch (err) {
      // log any errors and send a 400 status code back
      console.log(err);
      res.sendStatus(400);
    }
  },

  // create a thought
  async createThought({ params, body }, res) {
    try {
      const createdThought = await thought.create(body);
      const updatedUser = await user.findOneAndUpdate(
        { _id: body.userId },
        { $push: { thoughts: createdThought._id } },
        { new: true }
      );
      if (!updatedUser) {
        return res
          .status(404)
          .json({
            message:
              "Thought has been created, but there is no user relates to this id!",
          });
      }
      res.json({ message: "Thought has been created successfully!" });
    } catch (err) {
      res.json(err);
    }
  },
};
