const express = require("express");
const db = require("./config/connection");
const routes = require("./routes");

const PORT = process.env.PORT || 3001;

// if there's an error connecting to the database, we log the error and exit the process 
async function startServer() {
  try {
    await db.connect();
    console.log("Connected to database");

    // if the database connection is successful it will create the express app and set up the app.use lines 
    const app = express();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(routes);

    // start server calling app.listen(PORT)
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
    });
  } catch (err) {
    console.error("Error connecting to database:", err);
    process.exit(1);
  }
}

startServer();