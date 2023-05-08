const { User, Thought } = require("../models");

const userController = {
  // getting all users
  getAllUsers: async (req, res) => {
    try {
      const dbUserData = await User.find({})
        .populate({
          path: "friends",
          select: "-__v",
        })
        .select("-__v")
        .sort({ _id: -1 });
      res.json(dbUserData);
    } catch (err) {
      console.log(err);
      res.sendStatus(400);
    }
  },

  // get one user by id
  getUserById: async ({ params }, res) => {
    try {
      const dbUserData = await User.findOne({ _id: params.id })
        .populate({
          path: "thoughts",
          select: "-__v",
        })
        .populate({
          path: "friends",
          select: "-__v",
        })
        .select("-__v");
      if (!dbUserData) {
        return res
          .status(404)
          .json({ message: "No user found related to this id!" });
      }
      res.json(dbUserData);
    } catch (err) {
      console.log(err);
      res.sendStatus(400);
    }
  },

  // create a single user
  createUser({ body }, res) {
    User.create(body)
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => res.json(err));
  },

  // user updating by id
  updateUser: async function ({ params, body }, res) {
    try {
      const dbUserData = await User.findOneAndUpdate({ _id: params.id }, body, {
        new: true,
        runValidators: true,
      });
      if (!dbUserData) {
        res.status(404).json({ message: "No user found related to this id!" });
        return;
      }
      res.json(dbUserData);
    } catch (err) {
      res.json(err);
    }
  },

  // deleting a user
  deleteUser: async function ({ params }, res) {
    try {
      const dbUserData = await User.findOneAndDelete({ _id: params.id });
      if (!dbUserData) {
        return res.status(404).json({ message: "No user found with this id!" });
      }
      // Get ids of user's thoughts that were inputed, then delete all of them
      await Thought.deleteMany({ _id: { $in: dbUserData.thoughts } });
      res.json({ message: "User and their thoughts have been deleted!" });
    } catch (err) {
      res.json(err);
    }
  },

  // adding a friend
  addFriend: async function ({ params }, res) {
    try {
      const dbUserData = await User.findOneAndUpdate(
        { _id: params.userId },
        { $addToSet: { friends: params.friendId } },
        { new: true, runValidators: true }
      );

      if (!dbUserData) {
        return res.status(404).json({ message: "No user with this id" });
      }

      res.json(dbUserData);
    } catch (err) {
      res.json(err);
    }
  },

  // deleting a friend
  removeFriend: async function ({ params }, res) {
    try {
      const dbUserData = await User.findOneAndUpdate(
        { _id: params.userId },
        { $pull: { friends: params.friendId } },
        { new: true }
      );
      if (!dbUserData) {
        return res.status(404).json({ message: "No user with this id!" });
      }
      res.json(dbUserData);
    } catch (err) {
      console.log(err);
      res.sendStatus(400);
    }
  },
};

module.exports = userController;
