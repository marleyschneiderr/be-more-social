// imports the Mongoose library, connects interface to work with Node.js
const mongoose = require("mongoose");

// connects to the MongoDB
mongoose.connect(
    process.env.MONGODB_URI || "",
    {
        // connection string used to avoid deprecation warnings that could pop up during connection
        useNewUrlParser: true,
        // connection string used to avoid deprecation warnings that could pop up during connection
        useUnifiedTopology: true,
    }
);

// lets Mongoose log all the database operations, can help locate what queries are working
mongoose.set("debug", true);

// exports Mongoose connection object so other parts of application can use it
module.exports = mongoose.connection; 