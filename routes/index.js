const router = require("express").Router();
const apiRoutes = require("./api");

// exports a router that handles API routes using apiRoutes 
router.use("/api", apiRoutes);

router.use((req, res) => {
    // responds with 404 error for any other requests
  res.status(404).send("404 Error!");
});

module.exports = router;