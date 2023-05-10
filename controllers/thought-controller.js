// choosing to excluding the __v field from all returned code = making returned documents 'lightweight'/ prevents exposing info
const { Thought, User } = require("../models");

const thoughtController = {
  // GET all thoughts to load when api pathway is defined
  async getAllThought(req, res) {
    try {
      // find  all thoughts
      const dbThoughtInfo = await Thought
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
      const dbThoughtInfo = await Thought
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
      const { _id } = await Thought.create(body);
      const dbUserData = await User.findOneAndUpdate(
        { _id: body.userId },
        { $addToSet: { Thoughts: _id } },
        { new: true }
      );

      if (!dbUserData) {
        return res
          .status(404)
          .json({ message: "Thought created but no user with this id!" });
      }

      res.json({ message: "Thought successfully created!" });
    } catch (err) {
      res.json(err);
    }
  },

  // update thought by ID
  async updateThought({ params, body }, res) {
    try {
      const dbThoughtInfo = await Thought.findOneAndUpdate(
        { _id: params.id },
        body,
        { new: true, runValidators: true }
      );
      if (!dbThoughtInfo) {
        return res
          .status(404)
          .json({ message: "No thought found related to this id!" });
      }
      res.json(dbThoughtInfo);
    } catch (err) {
      res.json(err);
    }
  },

  // delete Thought
  async deleteThought({ params }, res) {
    try {
      const dbThoughtInfo = await Thought.findOneAndDelete({ _id: params.id });
      if (!dbThoughtInfo) {
        return res
          .status(404)
          .json({ message: "No thought found related to this id!" });
      }

      const dbUserData = await User.findOneAndUpdate(
        { Thoughts: params.id },
        // $pull removes from value already created that connect to a certain condition
        { $pull: { Thoughts: params.id } },
        { new: true }
      );
      if (!dbUserData) {
        return res
          .status(404)
          .json({
            message: "Thought successfully deleted!",
          });
      }

      res.json({ message: "Thought successfully deleted!" });
    } catch (err) {
      res.json(err);
    }
  },

  // adding a reaction
  async addReaction({ params, body }, res) {
    try {
      const dbThoughtInfo = await Thought.findOneAndUpdate(
        { _id: params.thoughtId },
        { $addToSet: { reactions: body } },
        { new: true, runValidators: true }
      );
      if (!dbThoughtInfo) {
        return res
          .status(404)
          .json({ message: "No thought found related to this id!" });
      }
      res.json(dbThoughtInfo);
    } catch (err) {
      res.json(err);
    }
  },

  async removeReaction({ params }, res) {
    try {
      const dbThoughtInfo = await Thought.findOneAndUpdate(
        { _id: params.thoughtId },
        { $pull: { reactions: { reactionId: params.reactionId } } },
        { new: true }
      );
      res.json(dbThoughtInfo);
    } catch (err) {
      res.json(err);
    }
  },
};

module.exports = thoughtController;
