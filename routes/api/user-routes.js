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
router.get("/users", getAllUsers); // GET /api/users
router.post("/users", createUser); // POST /api/users

router.get("/users/:id", getUserById); // GET /api/users/:id
router.put("/users/:id", updateUser); // PUT /api/users/:id
router.delete("/users/:id", deleteUser); // DELETE /api/users/:id

router.post("/users/:userId/friends/:friendId", addFriend); // POST /api/users/:userId/friends/:friendId
router.delete("/users/:userId/friends/:friendId", removeFriend); // DELETE /api/users/:userId/friends/:friendId

module.exports = router;
