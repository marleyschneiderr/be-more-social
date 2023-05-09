const router = require("express").Router();

// put in user controller methods
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  addFriend,
  removeFriend,
} = require("../../controllers/user-controller");

// controller methods
router.get("/", getAllUsers); // GET /api/users
router.post("/", createUser); // POST /api/users

router.get("/:id", getUserById); // GET /api/users/:id
router.put("/:id", updateUser); // PUT /api/users/:id
router.delete("/:id", deleteUser); // DELETE /api/users/:id

router.post("/:userId/friends/:friendId", addFriend); // POST /api/users/:userId/friends/:friendId
router.delete("/:userId/friends/:friendId", removeFriend); // DELETE /api/users/:userId/friends/:friendId

module.exports = router;

